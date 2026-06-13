import { Field, Float, GraphQLISODateTime, InputType, Int } from 'type-graphql'
import { TransactionType } from '../../models/transaction.model'
import { PaginationInput } from './pagination.input'

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  title!: string

  @Field(() => Float)
  amount!: number

  @Field(() => TransactionType)
  type!: TransactionType

  @Field(() => GraphQLISODateTime)
  date!: Date

  @Field(() => String)
  categoryId!: string
}

@InputType()
export class ListTransactionsInput extends PaginationInput {
  @Field(() => String, { nullable: true })
  search?: string

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType

  @Field(() => String, { nullable: true })
  categoryId?: string

  @Field(() => Int, { nullable: true })
  month?: number

  @Field(() => Int, { nullable: true })
  year?: number
}

@InputType()
export class UpdateTransactionInput {
  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => Float, { nullable: true })
  amount?: number

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType

  @Field(() => GraphQLISODateTime, { nullable: true })
  date?: Date

  @Field(() => String, { nullable: true })
  categoryId?: string
}
