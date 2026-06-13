import { gql } from 'graphql-request'
import { graphqlClient } from '@/lib/graphql-client'
import type {
  AuthPayload,
  Category,
  CreateCategoryInput,
  CreateTransactionInput,
  ListTransactionsInput,
  LoginInput,
  Overview,
  PaginatedTransactions,
  RegisterInput,
  Transaction,
  TransactionPeriod,
  UpdateCategoryInput,
  UpdateTransactionInput,
} from './types'

const USER_FIELDS = gql`
  fragment UserFields on UserModel {
    id
    name
    email
    createdAt
    updatedAt
  }
`

const CATEGORY_FIELDS = gql`
  fragment CategoryFields on CategoryModel {
    id
    name
    description
    icon
    color
    transactionsCount
    userId
    createdAt
    updatedAt
  }
`

const TRANSACTION_FIELDS = gql`
  fragment TransactionFields on TransactionModel {
    id
    title
    amount
    type
    date
    categoryId
    userId
    createdAt
    updatedAt
    category {
      id
      name
      icon
      color
    }
  }
`

const LOGIN_MUTATION = gql`
  ${USER_FIELDS}
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      token
      refreshToken
      user {
        ...UserFields
      }
    }
  }
`

const REGISTER_MUTATION = gql`
  ${USER_FIELDS}
  mutation Register($data: RegisterInput!) {
    register(data: $data) {
      token
      refreshToken
      user {
        ...UserFields
      }
    }
  }
`

const LIST_TRANSACTIONS_QUERY = gql`
  ${TRANSACTION_FIELDS}
  query ListTransactions($params: ListTransactionsInput) {
    listTransactions(params: $params) {
      items {
        ...TransactionFields
      }
      total
      page
      pageSize
      totalPages
    }
  }
`

const RECENT_TRANSACTIONS_QUERY = gql`
  ${TRANSACTION_FIELDS}
  query RecentTransactions($limit: Int) {
    recentTransactions(limit: $limit) {
      ...TransactionFields
    }
  }
`

const OVERVIEW_QUERY = gql`
  query Overview {
    overview {
      balance
      monthlyIncome
      monthlyExpenses
    }
  }
`

const TRANSACTION_PERIODS_QUERY = gql`
  query TransactionPeriods {
    transactionPeriods {
      month
      year
    }
  }
`

const CREATE_TRANSACTION_MUTATION = gql`
  ${TRANSACTION_FIELDS}
  mutation CreateTransaction($data: CreateTransactionInput!) {
    createTransaction(data: $data) {
      ...TransactionFields
    }
  }
`

const UPDATE_TRANSACTION_MUTATION = gql`
  ${TRANSACTION_FIELDS}
  mutation UpdateTransaction($id: String!, $data: UpdateTransactionInput!) {
    updateTransaction(id: $id, data: $data) {
      ...TransactionFields
    }
  }
`

const DELETE_TRANSACTION_MUTATION = gql`
  mutation DeleteTransaction($id: String!) {
    deleteTransaction(id: $id)
  }
`

const LIST_CATEGORIES_QUERY = gql`
  ${CATEGORY_FIELDS}
  query ListCategories {
    listCategories {
      ...CategoryFields
    }
  }
`

const CREATE_CATEGORY_MUTATION = gql`
  ${CATEGORY_FIELDS}
  mutation CreateCategory($data: CreateCategoryInput!) {
    createCategory(data: $data) {
      ...CategoryFields
    }
  }
`

const UPDATE_CATEGORY_MUTATION = gql`
  ${CATEGORY_FIELDS}
  mutation UpdateCategory($id: String!, $data: UpdateCategoryInput!) {
    updateCategory(id: $id, data: $data) {
      ...CategoryFields
    }
  }
`

const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id)
  }
`

export const api = {
  login(data: LoginInput) {
    return graphqlClient
      .request<{ login: AuthPayload }>(LOGIN_MUTATION, { data })
      .then((res) => res.login)
  },
  register(data: RegisterInput) {
    return graphqlClient
      .request<{ register: AuthPayload }>(REGISTER_MUTATION, { data })
      .then((res) => res.register)
  },
  listTransactions(params?: ListTransactionsInput) {
    return graphqlClient
      .request<{ listTransactions: PaginatedTransactions }>(
        LIST_TRANSACTIONS_QUERY,
        { params }
      )
      .then((res) => res.listTransactions)
  },
  getOverview() {
    return graphqlClient
      .request<{ overview: Overview }>(OVERVIEW_QUERY)
      .then((res) => res.overview)
  },
  listRecentTransactions(limit?: number) {
    return graphqlClient
      .request<{ recentTransactions: Transaction[] }>(
        RECENT_TRANSACTIONS_QUERY,
        { limit }
      )
      .then((res) => res.recentTransactions)
  },
  listTransactionPeriods() {
    return graphqlClient
      .request<{ transactionPeriods: TransactionPeriod[] }>(
        TRANSACTION_PERIODS_QUERY
      )
      .then((res) => res.transactionPeriods)
  },
  createTransaction(data: CreateTransactionInput) {
    return graphqlClient
      .request<{ createTransaction: Transaction }>(CREATE_TRANSACTION_MUTATION, {
        data,
      })
      .then((res) => res.createTransaction)
  },
  updateTransaction(id: string, data: UpdateTransactionInput) {
    return graphqlClient
      .request<{ updateTransaction: Transaction }>(UPDATE_TRANSACTION_MUTATION, {
        id,
        data,
      })
      .then((res) => res.updateTransaction)
  },
  deleteTransaction(id: string) {
    return graphqlClient
      .request<{ deleteTransaction: boolean }>(DELETE_TRANSACTION_MUTATION, {
        id,
      })
      .then((res) => res.deleteTransaction)
  },
  listCategories() {
    return graphqlClient
      .request<{ listCategories: Category[] }>(LIST_CATEGORIES_QUERY)
      .then((res) => res.listCategories)
  },
  createCategory(data: CreateCategoryInput) {
    return graphqlClient
      .request<{ createCategory: Category }>(CREATE_CATEGORY_MUTATION, { data })
      .then((res) => res.createCategory)
  },
  updateCategory(id: string, data: UpdateCategoryInput) {
    return graphqlClient
      .request<{ updateCategory: Category }>(UPDATE_CATEGORY_MUTATION, {
        id,
        data,
      })
      .then((res) => res.updateCategory)
  },
  deleteCategory(id: string) {
    return graphqlClient
      .request<{ deleteCategory: boolean }>(DELETE_CATEGORY_MUTATION, { id })
      .then((res) => res.deleteCategory)
  },
}
