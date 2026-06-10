import {
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
  registerEnumType,
} from 'type-graphql'

export enum CategoryIcon {
  BUSINESS = 'BUSINESS',
  CAR = 'CAR',
  HEALTH = 'HEALTH',
  FINANCY = 'FINANCY',
  CART = 'CART',
  TICKET = 'TICKET',
  TOOL_CASE = 'TOOL_CASE',
  UTENSILS = 'UTENSILS',
  PET = 'PET',
  HOUSE = 'HOUSE',
  GIFT = 'GIFT',
  GYM = 'GYM',
  BOOK = 'BOOK',
  BAGGAGE = 'BAGGAGE',
  MAILBOX = 'MAILBOX',
  RECEIPT = 'RECEIPT',
}

export enum CategoryColor {
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  PURPLE = 'PURPLE',
  PINK = 'PINK',
  RED = 'RED',
  ORANGE = 'ORANGE',
  YELLOW = 'YELLOW',
}

registerEnumType(CategoryIcon, {
  name: 'CategoryIcon',
  description: 'Available category icons',
})

registerEnumType(CategoryColor, {
  name: 'CategoryColor',
  description: 'Available category colors',
})

@ObjectType()
export class CategoryModel {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => CategoryIcon)
  icon!: CategoryIcon

  @Field(() => CategoryColor)
  color!: CategoryColor

  @Field(() => String)
  userId!: string

  @Field(() => GraphQLISODateTime)
  createdAt!: Date

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date
}
