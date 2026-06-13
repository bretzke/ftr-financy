import { Field, Int, ObjectType } from 'type-graphql'
import { TransactionModel } from '../../models/transaction.model'

@ObjectType()
export class PaginatedTransactions {
  @Field(() => [TransactionModel])
  items!: TransactionModel[]

  @Field(() => Int)
  total!: number

  @Field(() => Int)
  page!: number

  @Field(() => Int)
  pageSize!: number

  @Field(() => Int)
  totalPages!: number
}

@ObjectType()
export class TransactionPeriod {
  @Field(() => Int)
  month!: number

  @Field(() => Int)
  year!: number
}
