import { Field, InputType } from 'type-graphql'
import { CategoryColor, CategoryIcon } from '../../models/category.model'

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  name!: string

  @Field(() => CategoryIcon)
  icon!: CategoryIcon

  @Field(() => CategoryColor)
  color!: CategoryColor
}

@InputType()
export class UpdateCategoryInput {
  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => CategoryIcon, { nullable: true })
  icon?: CategoryIcon

  @Field(() => CategoryColor, { nullable: true })
  color?: CategoryColor
}
