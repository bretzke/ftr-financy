import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/graphql/operations'
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
} from '@/graphql/types'

export const transactionKeys = {
  all: ['transactions'] as const,
}

export function useTransactions() {
  return useQuery({
    queryKey: transactionKeys.all,
    queryFn: () => api.listTransactions(),
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTransactionInput) => api.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all })
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateTransactionInput
    }) => api.updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all })
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all })
    },
  })
}
