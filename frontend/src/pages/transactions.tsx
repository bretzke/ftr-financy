import * as React from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useDeleteTransaction,
  useTransactionPeriods,
  useTransactions,
} from "@/hooks/use-transactions";
import { useCategories } from "@/hooks/use-categories";
import { CategoryIcon } from "@/components/category-icon";
import { CategoryColor } from "@/components/category-color";
import { PageHeader } from "@/components/page-header";
import { TransactionDialog } from "@/components/transaction-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate, formatPeriodLabel } from "@/lib/format";
import { getErrorMessage } from "@/lib/error";
import { cn } from "@/lib/utils";
import { TransactionType, type Transaction } from "@/graphql/types";

const PAGE_SIZE = 10;

const ALL_VALUE = "ALL";

function toPeriodValue(month: number, year: number) {
  return `${year}-${month}`;
}

function fromPeriodValue(value: string) {
  const [year, month] = value.split("-").map(Number);
  return { month, year };
}

function getPageItems(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }
  const items: (number | "ellipsis")[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  if (left > 2) items.push("ellipsis");
  for (let page = left; page <= right; page += 1) items.push(page);
  if (right < total - 1) items.push("ellipsis");
  items.push(total);
  return items;
}

export function TransactionsPage() {
  const now = new Date();
  const [page, setPage] = React.useState(1);
  const [searchInput, setSearchInput] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState<TransactionType | typeof ALL_VALUE>(
    ALL_VALUE,
  );
  const [categoryId, setCategoryId] = React.useState<string>(ALL_VALUE);
  const [period, setPeriod] = React.useState(
    toPeriodValue(now.getMonth() + 1, now.getFullYear()),
  );

  const { data: categories = [] } = useCategories();
  const { data: periods = [] } = useTransactionPeriods();

  const { month, year } = fromPeriodValue(period);

  const { data, isLoading } = useTransactions({
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
    type: type === ALL_VALUE ? undefined : type,
    categoryId: categoryId === ALL_VALUE ? undefined : categoryId,
    month,
    year,
  });
  const deleteTransaction = useDeleteTransaction();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Transaction | null>(null);
  const [toDelete, setToDelete] = React.useState<Transaction | null>(null);

  const transactions = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const periodOptions = React.useMemo(() => {
    const current = toPeriodValue(now.getMonth() + 1, now.getFullYear());
    const values = periods.map((item) => toPeriodValue(item.month, item.year));
    const merged = values.includes(current) ? values : [current, ...values];
    return merged.map((value) => {
      const parsed = fromPeriodValue(value);
      return { value, label: formatPeriodLabel(parsed.month, parsed.year) };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periods]);

  React.useEffect(() => {
    if (data && page > data.totalPages) {
      setPage(data.totalPages);
    }
  }, [data, page]);

  function applySearch() {
    setPage(1);
    setSearch(searchInput.trim());
  }

  function handleTypeChange(value: string) {
    setPage(1);
    setType(value as TransactionType | typeof ALL_VALUE);
  }

  function handleCategoryChange(value: string) {
    setPage(1);
    setCategoryId(value);
  }

  function handlePeriodChange(value: string) {
    setPage(1);
    setPeriod(value);
  }

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);
  const pageItems = getPageItems(page, totalPages);

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

      <Card className="mb-6">
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Descrição da transação"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    applySearch();
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>Todos</SelectItem>
                  <SelectItem value={TransactionType.INCOME}>Entrada</SelectItem>
                  <SelectItem value={TransactionType.EXPENSE}>Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={categoryId} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>Todas</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={period} onValueChange={handlePeriodChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-0">
          {isLoading && !data ? (
            <div className="space-y-3 px-6 py-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : total === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                {periods.length === 0
                  ? "Você ainda não tem transações."
                  : "Nenhuma transação encontrada para os filtros selecionados."}
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
                {transactions.map((transaction) => {
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

          {total > 0 ? (
            <div className="flex flex-col items-center justify-between gap-4 border-t px-6 py-4 sm:flex-row">
              <p className="text-sm text-muted-foreground">
                {rangeStart} a {rangeEnd}
                <span className="mx-2 text-border">|</span>
                {total} resultados
              </p>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  <ChevronLeft className="size-4" />
                  <span className="sr-only">Página anterior</span>
                </Button>

                {pageItems.map((item, index) =>
                  item === "ellipsis" ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-sm text-muted-foreground"
                    >
                      …
                    </span>
                  ) : (
                    <Button
                      key={item}
                      variant={item === page ? "default" : "outline"}
                      size="icon"
                      onClick={() => setPage(item)}
                    >
                      {item}
                    </Button>
                  ),
                )}

                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === totalPages}
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                >
                  <ChevronRight className="size-4" />
                  <span className="sr-only">Próxima página</span>
                </Button>
              </div>
            </div>
          ) : null}
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
