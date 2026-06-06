import { prismaClient } from '../../prisma/prisma'
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../dtos/input/category.input'
import {
  assertAtLeastOneField,
  assertMinLength,
  assertNotEmpty,
} from '../utils/validation'

export class CategoryService {
  async createCategory(data: CreateCategoryInput, userId: string) {
    const name = assertMinLength(
      assertNotEmpty(data.name, 'name'),
      2,
      'name'
    )

    return prismaClient.category.create({
      data: {
        name,
        userId,
      },
    })
  }

  async listCategories(userId: string) {
    return prismaClient.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    })
  }

  async getCategory(id: string, userId: string) {
    const categoryId = assertNotEmpty(id, 'id')

    const category = await prismaClient.category.findFirst({
      where: { id: categoryId, userId },
    })
    if (!category) throw new Error('Category not found')
    return category
  }

  async updateCategory(
    id: string,
    data: UpdateCategoryInput,
    userId: string
  ) {
    const categoryId = assertNotEmpty(id, 'id')
    assertAtLeastOneField({ name: data.name })

    const category = await prismaClient.category.findFirst({
      where: { id: categoryId, userId },
    })
    if (!category) throw new Error('Category not found')

    const name =
      data.name !== undefined
        ? assertMinLength(assertNotEmpty(data.name, 'name'), 2, 'name')
        : undefined

    return prismaClient.category.update({
      where: { id: categoryId },
      data: { name },
    })
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
