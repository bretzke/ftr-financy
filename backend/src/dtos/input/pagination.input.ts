import { Field, InputType, Int } from 'type-graphql'

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  pageSize?: number
}
