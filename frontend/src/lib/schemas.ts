import { z } from "zod";
import { TransactionType } from "@/graphql/types";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/category-options";

export const loginSchema = z.object({
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z.email("E-mail inválido"),
  password: z.string().min(8, { error: "" }),
});

export const transactionSchema = z.object({
  title: z.string().min(1, "Informe um título"),
  amount: z
    .number({ message: "Informe um valor válido" })
    .positive("O valor deve ser maior que zero"),
  type: z.enum([TransactionType.INCOME, TransactionType.EXPENSE], {
    message: "Selecione o tipo",
  }),
  date: z.string().min(1, "Informe a data"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Informe o nome da categoria"),
  description: z.string().max(200, "No máximo 200 caracteres").optional(),
  icon: z.enum(CATEGORY_ICONS, { message: "Selecione um ícone" }),
  color: z.enum(CATEGORY_COLORS, { message: "Selecione uma cor" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type TransactionFormValues = z.infer<typeof transactionSchema>;
export type CategoryFormValues = z.infer<typeof categorySchema>;

