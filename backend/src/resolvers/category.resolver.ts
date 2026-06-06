import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql'
import { CategoryModel } from '../models/category.model'
import { TransactionModel } from '../models/transaction.model'
import { UserModel } from '../models/user.model'
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../dtos/input/category.input'
import { CategoryService } from '../services/category.service'
import { TransactionService } from '../services/transaction.service'
import { GqlUser } from '../graphql/decorators/user.decorator'
import { IsAuth } from '../middlewares/auth.middleware'

@Resolver(() => CategoryModel)
@UseMiddleware(IsAuth)
export class CategoryResolver {
  private categoryService = new CategoryService()
  private transactionService = new TransactionService()

  @Mutation(() => CategoryModel)
  async createCategory(
    @Arg('data', () => CreateCategoryInput) data: CreateCategoryInput,
    @GqlUser() user: UserModel
  ): Promise<CategoryModel> {
    return this.categoryService.createCategory(data, user.id)
  }

  @Mutation(() => CategoryModel)
  async updateCategory(
    @Arg('id', () => String) id: string,
    @Arg('data', () => UpdateCategoryInput) data: UpdateCategoryInput,
    @GqlUser() user: UserModel
  ): Promise<CategoryModel> {
    return this.categoryService.updateCategory(id, data, user.id)
  }

  @Mutation(() => Boolean)
  async deleteCategory(
    @Arg('id', () => String) id: string,
    @GqlUser() user: UserModel
  ): Promise<boolean> {
    await this.categoryService.deleteCategory(id, user.id)
    return true
  }

  @Query(() => [CategoryModel])
  async listCategories(@GqlUser() user: UserModel): Promise<CategoryModel[]> {
    return this.categoryService.listCategories(user.id)
  }

  @Query(() => CategoryModel)
  async getCategory(
    @Arg('id', () => String) id: string,
    @GqlUser() user: UserModel
  ): Promise<CategoryModel> {
    return this.categoryService.getCategory(id, user.id)
  }

  @FieldResolver(() => [TransactionModel])
  async transactions(
    @Root() category: CategoryModel,
    @GqlUser() user: UserModel
  ): Promise<TransactionModel[]> {
    const transactions = await this.transactionService.listTransactions(user.id)
    return transactions.filter(
      (transaction) => transaction.categoryId === category.id
    )
  }
}
