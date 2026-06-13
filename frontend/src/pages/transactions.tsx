import * as React from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useDeleteTransaction,
  useTransactions,
} from "@/hooks/use-transactions";
import { CategoryIcon } from "@/components/category-icon";
import { CategoryColor } from "@/components/category-color";
import { PageHeader } from "@/components/page-header";
import { TransactionDialog } from "@/components/transaction-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/format";
import { getErrorMessage } from "@/lib/error";
import { cn } from "@/lib/utils";
import { TransactionType, type Transaction } from "@/graphql/types";

export function TransactionsPage() {
  const { data: transactions = [], isLoading } = useTransactions();
  const deleteTransaction = useDeleteTransaction();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Transaction | null>(null);
  const [toDelete, setToDelete] = React.useState<Transaction | null>(null);

  function handleCreate() {
    setSelected(null);
    setDialogOpen(true);
  }

  function handleEdit(transaction: Transaction) {
    setSelected(transaction);
    setDialogOpen(true);
  }

  async function handleDelete() {
    if (!toDelete) return;
    try {
      await deleteTransaction.mutateAsync(toDelete.id);
      toast.success("Transação excluída");
      setToDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  const sorted = React.useMemo(
    () =>
      [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [transactions],
  );

  return (
    <div>
      <PageHeader
        title="Transações"
        description="Gerencie todas as suas transações financeiras"
        action={
          <Button onClick={handleCreate}>
            <Plus className="size-4" />
            Nova transação
          </Button>
        }
      />

      <Card>
        <CardContent className="px-0">
          {isLoading ? (
            <div className="space-y-3 px-6 py-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Você ainda não tem transações.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((transaction) => {
                  const isIncome = transaction.type === TransactionType.INCOME;
                  const TypeIcon = isIncome ? ArrowUpCircle : ArrowDownCircle;
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <span className="flex items-center gap-3">
                          {transaction.category ? (
                            <CategoryIcon
                              icon={transaction.category.icon}
                              color={transaction.category.color}
                              size="sm"
                            />
                          ) : null}
                          <span className="font-medium">
                            {transaction.title}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(transaction.date)}
                      </TableCell>
                      <TableCell>
                        {transaction.category ? (
                          <CategoryColor
                            color={transaction.category.color}
                            label={transaction.category.name}
                          />
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 font-medium",
                            isIncome ? "text-success" : "text-destructive",
                          )}
                        >
                          <TypeIcon className="size-4" />
                          {isIncome ? "Entrada" : "Saída"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-foreground">
                        {formatCurrency(
                          isIncome ? transaction.amount : -transaction.amount,
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(transaction)}
                          >
                            <Pencil className="size-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setToDelete(transaction)}
                          >
                            <Trash2 className="size-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={selected}
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Excluir transação"
        description={`Tem certeza que deseja excluir "${toDelete?.title}"? Esta ação não pode ser desfeita.`}
        loading={deleteTransaction.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
