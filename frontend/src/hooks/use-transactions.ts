import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/graphql/operations";
import type {
  CreateTransactionInput,
  ListTransactionsInput,
  UpdateTransactionInput,
} from "@/graphql/types";

export const transactionKeys = {
  all: ["transactions"] as const,
  list: (params?: ListTransactionsInput) =>
    [...transactionKeys.all, "list", params ?? {}] as const,
  periods: () => [...transactionKeys.all, "periods"] as const,
  overview: () => [...transactionKeys.all, "overview"] as const,
  recent: (limit?: number) =>
    [...transactionKeys.all, "recent", limit ?? 5] as const,
};

export function useTransactions(params?: ListTransactionsInput) {
  return useQuery({
    queryKey: transactionKeys.list(params),
    queryFn: () => api.listTransactions(params),
    placeholderData: keepPreviousData,
  });
}

export function useTransactionPeriods() {
  return useQuery({
    queryKey: transactionKeys.periods(),
    queryFn: () => api.listTransactionPeriods(),
  });
}

export function useOverview() {
  return useQuery({
    queryKey: transactionKeys.overview(),
    queryFn: () => api.getOverview(),
  });
}

export function useRecentTransactions(limit?: number) {
  return useQuery({
    queryKey: transactionKeys.recent(limit),
    queryFn: () => api.listRecentTransactions(limit),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTransactionInput) => api.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionInput }) =>
      api.updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}

