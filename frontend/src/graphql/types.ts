export const TransactionType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType]

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description?: string | null
  icon: string
  color: string
  transactionsCount?: number
  transactionsTotal?: number
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  title: string
  amount: number
  type: TransactionType
  date: string
  categoryId: string
  userId: string
  category?: Category | null
  createdAt: string
  updatedAt: string
}

export interface AuthPayload {
  token: string
  refreshToken: string
  user: User
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface UpdateProfileInput {
  name: string
}

export interface CreateTransactionInput {
  title: string
  amount: number
  type: TransactionType
  date: string
  categoryId: string
}

export interface UpdateTransactionInput {
  title?: string
  amount?: number
  type?: TransactionType
  date?: string
  categoryId?: string
}

export interface ListTransactionsInput {
  page?: number
  pageSize?: number
  search?: string
  type?: TransactionType
  categoryId?: string
  month?: number
  year?: number
}

export interface TransactionPeriod {
  month: number
  year: number
}

export interface Overview {
  balance: number
  monthlyIncome: number
  monthlyExpenses: number
}

export interface PaginatedTransactions {
  items: Transaction[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CreateCategoryInput {
  name: string
  description?: string | null
  icon: string
  color: string
}

export interface UpdateCategoryInput {
  name?: string
  description?: string | null
  icon?: string
  color?: string
}
