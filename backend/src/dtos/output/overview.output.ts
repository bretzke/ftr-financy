import { Field, Float, ObjectType } from 'type-graphql'

@ObjectType()
export class Overview {
  @Field(() => Float)
  balance!: number

  @Field(() => Float)
  monthlyIncome!: number

  @Field(() => Float)
  monthlyExpenses!: number
}
