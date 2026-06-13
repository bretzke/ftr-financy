import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useCreateTransaction,
  useUpdateTransaction,
} from "@/hooks/use-transactions";
import { useCategories } from "@/hooks/use-categories";
import { transactionSchema, type TransactionFormValues } from "@/lib/schemas";
import { getErrorMessage } from "@/lib/error";
import { toDateInputValue } from "@/lib/format";
import { CategoryIcon } from "@/components/category-icon";
import { cn } from "@/lib/utils";
import { TransactionType, type Transaction } from "@/graphql/types";

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
}

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
}: TransactionDialogProps) {
  const isEditing = !!transaction;
  const { data: categories = [] } = useCategories();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: "",
      amount: undefined as unknown as number,
      type: TransactionType.EXPENSE,
      date: toDateInputValue(new Date()),
      categoryId: "",
    },
  });

  React.useEffect(() => {
    if (!open) return;
    if (transaction) {
      form.reset({
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        date: toDateInputValue(transaction.date),
        categoryId: transaction.categoryId,
      });
    } else {
      form.reset({
        title: "",
        amount: undefined as unknown as number,
        type: TransactionType.EXPENSE,
        date: toDateInputValue(new Date()),
        categoryId: "",
      });
    }
  }, [open, transaction, form]);

  const isPending = createTransaction.isPending || updateTransaction.isPending;

  async function onSubmit(values: TransactionFormValues) {
    const payload = {
      title: values.title,
      amount: values.amount,
      type: values.type,
      categoryId: values.categoryId,
      date: new Date(`${values.date}T00:00:00`).toISOString(),
    };

    try {
      if (isEditing && transaction) {
        await updateTransaction.mutateAsync({
          id: transaction.id,
          data: payload,
        });
        toast.success("Transação atualizada com sucesso");
      } else {
        await createTransaction.mutateAsync(payload);
        toast.success("Transação criada com sucesso");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar transação" : "Nova transação"}
          </DialogTitle>
          <DialogDescription>
            Adicione uma nova movimentação financeira
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => field.onChange(TransactionType.EXPENSE)}
                        className={cn(
                          "flex cursor-pointer items-center justify-center gap-2 rounded-lg border bg-background px-4 py-3 text-sm font-medium transition-colors",
                          field.value === TransactionType.EXPENSE
                            ? "border-destructive bg-muted/50 text-foreground"
                            : "border-input text-muted-foreground hover:bg-muted/40",
                        )}
                      >
                        <ArrowDownCircle
                          className={cn(
                            "size-4",
                            field.value === TransactionType.EXPENSE
                              ? "text-destructive"
                              : "text-muted-foreground",
                          )}
                        />
                        Despesa
                      </button>
                      <button
                        type="button"
                        onClick={() => field.onChange(TransactionType.INCOME)}
                        className={cn(
                          "flex cursor-pointer items-center justify-center gap-2 rounded-lg border bg-background px-4 py-3 text-sm font-medium transition-colors",
                          field.value === TransactionType.INCOME
                            ? "border-success bg-muted/50 text-foreground"
                            : "border-input text-muted-foreground hover:bg-muted/40",
                        )}
                      >
                        <ArrowUpCircle
                          className={cn(
                            "size-4",
                            field.value === TransactionType.INCOME
                              ? "text-success"
                              : "text-muted-foreground",
                          )}
                        />
                        Receita
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Salário, Aluguel, Compras..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0,00"
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value ?? ""}
                        onChange={(event) =>
                          field.onChange(
                            event.target.value === ""
                              ? undefined
                              : event.target.valueAsNumber,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          Crie uma categoria primeiro
                        </div>
                      ) : (
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <span className="flex items-center gap-2">
                              <CategoryIcon
                                icon={category.icon}
                                color={category.color}
                                size="sm"
                              />
                              {category.name}
                            </span>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-2 w-full" disabled={isPending}>
              {isEditing ? "Salvar alterações" : "Salvar transação"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

