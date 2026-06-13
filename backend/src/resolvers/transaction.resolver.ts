import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql'
import { TransactionModel } from '../models/transaction.model'
import { CategoryModel } from '../models/category.model'
import { UserModel } from '../models/user.model'
import {
  CreateTransactionInput,
  ListTransactionsInput,
  UpdateTransactionInput,
} from '../dtos/input/transaction.input'
import {
  PaginatedTransactions,
  TransactionPeriod,
} from '../dtos/output/transaction.output'
import { TransactionService } from '../services/transaction.service'
import { CategoryService } from '../services/category.service'
import { GqlUser } from '../graphql/decorators/user.decorator'
import { IsAuth } from '../middlewares/auth.middleware'
import { prismaClient } from '../../prisma/prisma'

@Resolver(() => TransactionModel)
@UseMiddleware(IsAuth)
export class TransactionResolver {
  private transactionService = new TransactionService()
  private categoryService = new CategoryService()

  @Mutation(() => TransactionModel)
  async createTransaction(
    @Arg('data', () => CreateTransactionInput) data: CreateTransactionInput,
    @GqlUser() user: UserModel
  ): Promise<TransactionModel> {
    return this.transactionService.createTransaction(data, user.id)
  }

  @Mutation(() => TransactionModel)
  async updateTransaction(
    @Arg('id', () => String) id: string,
    @Arg('data', () => UpdateTransactionInput) data: UpdateTransactionInput,
    @GqlUser() user: UserModel
  ): Promise<TransactionModel> {
    return this.transactionService.updateTransaction(id, data, user.id)
  }

  @Mutation(() => Boolean)
  async deleteTransaction(
    @Arg('id', () => String) id: string,
    @GqlUser() user: UserModel
  ): Promise<boolean> {
    await this.transactionService.deleteTransaction(id, user.id)
    return true
  }

  @Query(() => PaginatedTransactions)
  async listTransactions(
    @Arg('params', () => ListTransactionsInput, { nullable: true })
    params: ListTransactionsInput,
    @GqlUser() user: UserModel
  ): Promise<PaginatedTransactions> {
    return this.transactionService.listTransactions(user.id, params)
  }

  @Query(() => [TransactionPeriod])
  async transactionPeriods(
    @GqlUser() user: UserModel
  ): Promise<TransactionPeriod[]> {
    return this.transactionService.listPeriods(user.id)
  }

  @Query(() => TransactionModel)
  async getTransaction(
    @Arg('id', () => String) id: string,
    @GqlUser() user: UserModel
  ): Promise<TransactionModel> {
    return this.transactionService.getTransaction(id, user.id)
  }

  @FieldResolver(() => CategoryModel)
  async category(
    @Root() transaction: TransactionModel,
    @GqlUser() user: UserModel
  ): Promise<CategoryModel> {
    return this.categoryService.getCategory(transaction.categoryId, user.id)
  }

  @FieldResolver(() => UserModel)
  async user(@Root() transaction: TransactionModel): Promise<UserModel> {
    const user = await prismaClient.user.findUnique({
      where: { id: transaction.userId },
    })
    if (!user) throw new Error('User not found')
    return user
  }
}
