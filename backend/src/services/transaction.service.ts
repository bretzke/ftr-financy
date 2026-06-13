import { Prisma } from "@prisma/client";
import { prismaClient } from "../../prisma/prisma";
import {
  CreateTransactionInput,
  ListTransactionsInput,
  UpdateTransactionInput,
} from "../dtos/input/transaction.input";
import { TransactionType } from "../models/transaction.model";
import {
  assertAtLeastOneField,
  assertNotEmpty,
  assertPositiveAmount,
  assertValidDate,
} from "../utils/validation";

export class TransactionService {
  private async validateCategoryOwnership(categoryId: string, userId: string) {
    const category = await prismaClient.category.findFirst({
      where: { id: categoryId, userId },
    });
    if (!category) throw new Error("Category not found");
    return category;
  }

  private mapTransaction(transaction: {
    id: string;
    title: string;
    amount: { toNumber(): number } | number;
    type: string;
    date: Date;
    categoryId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      ...transaction,
      type: transaction.type as TransactionType,
      amount:
        typeof transaction.amount === "number"
          ? transaction.amount
          : transaction.amount.toNumber(),
    };
  }

  async createTransaction(data: CreateTransactionInput, userId: string) {
    const title = assertNotEmpty(data.title, "title");
    const amount = assertPositiveAmount(data.amount);
    const date = assertValidDate(data.date);
    const categoryId = assertNotEmpty(data.categoryId, "categoryId");

    await this.validateCategoryOwnership(categoryId, userId);

    const transaction = await prismaClient.transaction.create({
      data: {
        title,
        amount,
        type: data.type,
        date,
        categoryId,
        userId,
      },
    });

    return this.mapTransaction(transaction);
  }

  private buildWhere(
    userId: string,
    params?: ListTransactionsInput,
  ): Prisma.TransactionWhereInput {
    const where: Prisma.TransactionWhereInput = { userId };

    const search = params?.search?.trim();
    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    if (params?.type) {
      where.type = params.type;
    }

    if (params?.categoryId) {
      where.categoryId = params.categoryId;
    }

    if (params?.month && params?.year) {
      const start = new Date(Date.UTC(params.year, params.month - 1, 1));
      const end = new Date(Date.UTC(params.year, params.month, 1));
      where.date = { gte: start, lt: end };
    }

    return where;
  }

  async listTransactions(userId: string, params?: ListTransactionsInput) {
    const page = Math.max(1, Math.trunc(params?.page ?? 1));
    const pageSize = Math.max(1, Math.trunc(params?.pageSize ?? 10));
    const where = this.buildWhere(userId, params);

    const [transactions, total] = await Promise.all([
      prismaClient.transaction.findMany({
        where,
        orderBy: { date: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prismaClient.transaction.count({ where }),
    ]);

    return {
      items: transactions.map((transaction) => this.mapTransaction(transaction)),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }

  async listPeriods(userId: string) {
    const rows = await prismaClient.$queryRaw<
      { year: number; month: number }[]
    >(Prisma.sql`
      SELECT DISTINCT
        EXTRACT(YEAR FROM "date")::int AS year,
        EXTRACT(MONTH FROM "date")::int AS month
      FROM "transactions"
      WHERE "userId" = ${userId}
      ORDER BY year DESC, month DESC
    `);

    return rows.map((row) => ({
      month: Number(row.month),
      year: Number(row.year),
    }));
  }

  async countByCategory(categoryId: string, userId: string) {
    return prismaClient.transaction.count({
      where: { userId, categoryId },
    });
  }

  async listTransactionsByCategory(categoryId: string, userId: string) {
    const transactions = await prismaClient.transaction.findMany({
      where: { userId, categoryId },
      orderBy: { date: "desc" },
    });

    return transactions.map((transaction) => this.mapTransaction(transaction));
  }

  async getTransaction(id: string, userId: string) {
    const transactionId = assertNotEmpty(id, "id");

    const transaction = await prismaClient.transaction.findFirst({
      where: { id: transactionId, userId },
    });
    if (!transaction) throw new Error("Transaction not found");
    return this.mapTransaction(transaction);
  }

  async updateTransaction(
    id: string,
    data: UpdateTransactionInput,
    userId: string,
  ) {
    const transactionId = assertNotEmpty(id, "id");
    assertAtLeastOneField({
      title: data.title,
      amount: data.amount,
      type: data.type,
      date: data.date,
      categoryId: data.categoryId,
    });

    const transaction = await prismaClient.transaction.findFirst({
      where: { id: transactionId, userId },
    });
    if (!transaction) throw new Error("Transaction not found");

    const title =
      data.title !== undefined
        ? assertNotEmpty(data.title, "title")
        : undefined;
    const amount =
      data.amount !== undefined ? assertPositiveAmount(data.amount) : undefined;
    const date =
      data.date !== undefined ? assertValidDate(data.date) : undefined;
    const categoryId =
      data.categoryId !== undefined
        ? assertNotEmpty(data.categoryId, "categoryId")
        : undefined;

    if (categoryId) {
      await this.validateCategoryOwnership(categoryId, userId);
    }

    const updated = await prismaClient.transaction.update({
      where: { id: transactionId },
      data: {
        title,
        amount,
        type: data.type ?? undefined,
        date,
        categoryId,
      },
    });

    return this.mapTransaction(updated);
  }

  async deleteTransaction(id: string, userId: string) {
    const transactionId = assertNotEmpty(id, "id");

    const transaction = await prismaClient.transaction.findFirst({
      where: { id: transactionId, userId },
    });
    if (!transaction) throw new Error("Transaction not found");

    await prismaClient.transaction.delete({
      where: { id: transactionId },
    });
  }
}

