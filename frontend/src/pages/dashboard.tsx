import * as React from "react";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import { useTransactions } from "@/hooks/use-transactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TransactionType } from "@/graphql/types";

export function DashboardPage() {
  const { data, isLoading } = useTransactions({
    pageSize: 1000,
  });
  const transactions = data?.items ?? [];

  const totals = React.useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === TransactionType.INCOME) {
          acc.income += transaction.amount;
        } else {
          acc.expense += transaction.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 },
    );
  }, [transactions]);

  const balance = totals.income - totals.expense;

  const stats = [
    {
      label: "Saldo total",
      value: balance,
      icon: Wallet,
      tone: "text-chart-3",
    },
    {
      label: "Receitas do mês",
      value: totals.income,
      icon: ArrowUpCircle,
      tone: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Despesas do mês",
      value: totals.expense,
      icon: ArrowDownCircle,
      tone: "text-destructive",
    },
  ];

  return (
    <div>
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
              {isLoading ? (
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
    </div>
  );
}

