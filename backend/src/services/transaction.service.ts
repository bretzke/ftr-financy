import { prismaClient } from "../../prisma/prisma";
import {
  CreateTransactionInput,
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

  async listTransactions(userId: string) {
    const transactions = await prismaClient.transaction.findMany({
      where: { userId },
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

