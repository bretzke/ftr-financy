import { prismaClient } from '../../prisma/prisma'
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../dtos/input/category.input'
import { CategoryColor, CategoryIcon } from '../models/category.model'
import {
  assertAtLeastOneField,
  assertMinLength,
  assertNotEmpty,
} from '../utils/validation'

export class CategoryService {
  private mapCategory(category: {
    id: string
    name: string
    icon: string
    color: string
    userId: string
    createdAt: Date
    updatedAt: Date
  }) {
    return {
      ...category,
      icon: category.icon as CategoryIcon,
      color: category.color as CategoryColor,
    }
  }

  async createCategory(data: CreateCategoryInput, userId: string) {
    const name = assertMinLength(
      assertNotEmpty(data.name, 'name'),
      2,
      'name'
    )

    const category = await prismaClient.category.create({
      data: {
        name,
        icon: data.icon,
        color: data.color,
        userId,
      },
    })

    return this.mapCategory(category)
  }

  async listCategories(userId: string) {
    const categories = await prismaClient.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    })

    return categories.map((category) => this.mapCategory(category))
  }

  async getCategory(id: string, userId: string) {
    const categoryId = assertNotEmpty(id, 'id')

    const category = await prismaClient.category.findFirst({
      where: { id: categoryId, userId },
    })
    if (!category) throw new Error('Category not found')
    return this.mapCategory(category)
  }

  async updateCategory(
    id: string,
    data: UpdateCategoryInput,
    userId: string
  ) {
    const categoryId = assertNotEmpty(id, 'id')
    assertAtLeastOneField({ name: data.name, icon: data.icon, color: data.color })

    const category = await prismaClient.category.findFirst({
      where: { id: categoryId, userId },
    })
    if (!category) throw new Error('Category not found')

    const name =
      data.name !== undefined
        ? assertMinLength(assertNotEmpty(data.name, 'name'), 2, 'name')
        : undefined

    const updated = await prismaClient.category.update({
      where: { id: categoryId },
      data: { name, icon: data.icon, color: data.color },
    })

    return this.mapCategory(updated)
  }

  async deleteCategory(id: string, userId: string) {
    const categoryId = assertNotEmpty(id, 'id')

    const category = await prismaClient.category.findFirst({
      where: { id: categoryId, userId },
    })
    if (!category) throw new Error('Category not found')

    const linkedTransactions = await prismaClient.transaction.count({
      where: { categoryId, userId },
    })
    if (linkedTransactions > 0) {
      throw new Error('Cannot delete category with linked transactions')
    }

    await prismaClient.category.delete({
      where: { id: categoryId },
    })
  }
}
