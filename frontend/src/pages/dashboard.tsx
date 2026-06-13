import * as React from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronRight,
  Plus,
  Wallet,
} from "lucide-react";
import { useOverview, useRecentTransactions } from "@/hooks/use-transactions";
import { useCategories } from "@/hooks/use-categories";
import { CategoryIcon } from "@/components/category-icon";
import { CategoryColor } from "@/components/category-color";
import { TransactionDialog } from "@/components/transaction-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TransactionType } from "@/graphql/types";

export function DashboardPage() {
  const { data: overview, isLoading: isOverviewLoading } = useOverview();
  const { data: recent = [], isLoading: isRecentLoading } =
    useRecentTransactions(5);
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useCategories();

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const stats = [
    {
      label: "Saldo total",
      value: overview?.balance ?? 0,
      icon: Wallet,
      tone: "text-chart-3",
    },
    {
      label: "Receitas do mês",
      value: overview?.monthlyIncome ?? 0,
      icon: ArrowUpCircle,
      tone: "text-success",
    },
    {
      label: "Despesas do mês",
      value: overview?.monthlyExpenses ?? 0,
      icon: ArrowDownCircle,
      tone: "text-destructive",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex-row items-center gap-3">
              <stat.icon className={cn("size-5", stat.tone)} />
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label.toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isOverviewLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <p className="text-2xl font-semibold">
                  {formatCurrency(stat.value)}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <Card className="gap-0">
          <CardHeader className="flex-row items-center justify-between gap-3 border-b pb-4">
            <CardTitle>Transações recentes</CardTitle>
            <Link
              to="/transactions"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Ver todas
              <ChevronRight className="size-4" />
            </Link>
          </CardHeader>
          <CardContent className="divide-y">
            {isRecentLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="py-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))
            ) : recent.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                Nenhuma transação recente.
              </p>
            ) : (
              recent.map((transaction) => {
                const isIncome = transaction.type === TransactionType.INCOME;
                const TypeIcon = isIncome ? ArrowUpCircle : ArrowDownCircle;
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between gap-3 py-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {transaction.category ? (
                        <CategoryIcon
                          icon={transaction.category.icon}
                          color={transaction.category.color}
                        />
                      ) : null}
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {transaction.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {transaction.category ? (
                        <CategoryColor
                          color={transaction.category.color}
                          label={transaction.category.name}
                        />
                      ) : null}
                      <span className="font-semibold">
                        {isIncome ? "+ " : "- "}
                        {formatCurrency(
                          isIncome ? transaction.amount : transaction.amount,
                        )}
                      </span>
                      <TypeIcon
                        className={cn(
                          "size-4",
                          isIncome ? "text-success" : "text-destructive",
                        )}
                      />
                    </div>
                  </div>
                );
              })
            )}

            {!isRecentLoading ? (
              <div className="pt-4">
                <Button
                  variant="ghost"
                  className="w-full text-success hover:text-success"
                  onClick={() => setDialogOpen(true)}
                >
                  <Plus className="size-4" />
                  Nova transação
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="gap-0">
          <CardHeader className="flex-row items-center justify-between gap-3 border-b pb-4">
            <CardTitle>Categorias</CardTitle>
            <Link
              to="/categories"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Gerenciar
              <ChevronRight className="size-4" />
            </Link>
          </CardHeader>
          <CardContent className="divide-y">
            {isCategoriesLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="py-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))
            ) : categories.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                Nenhuma categoria cadastrada.
              </p>
            ) : (
              categories.map((category) => {
                const count = category.transactionsCount ?? 0;
                const total = category.transactionsTotal ?? 0;
                return (
                  <div
                    key={category.id}
                    className="flex items-center justify-between gap-3 py-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <CategoryIcon
                        icon={category.icon}
                        color={category.color}
                      />
                      <p className="truncate font-medium">{category.name}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-semibold">{formatCurrency(total)}</p>
                      <p className="text-sm text-muted-foreground">
                        {count} {count === 1 ? "item" : "itens"}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={null}
      />
    </div>
  );
}

