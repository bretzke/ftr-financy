import { gql } from 'graphql-request'
import { graphqlClient } from '@/lib/graphql-client'
import type {
  AuthPayload,
  Category,
  CreateCategoryInput,
  CreateTransactionInput,
  LoginInput,
  RegisterInput,
  Transaction,
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
  query ListTransactions {
    listTransactions {
      ...TransactionFields
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
  listTransactions() {
    return graphqlClient
      .request<{ listTransactions: Transaction[] }>(LIST_TRANSACTIONS_QUERY)
      .then((res) => res.listTransactions)
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
