import * as React from "react";
import { MoreHorizontal, Pencil, Plus, Tags, Trash2 } from "lucide-react";
import { CategoryIcon } from "@/components/category-icon";
import { toast } from "sonner";
import { useCategories, useDeleteCategory } from "@/hooks/use-categories";
import { useTransactions } from "@/hooks/use-transactions";
import { PageHeader } from "@/components/page-header";
import { CategoryDialog } from "@/components/category-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getErrorMessage } from "@/lib/error";
import type { Category } from "@/graphql/types";
import { CategoryColor } from "@/components/category-color";

export function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const { data: transactions = [] } = useTransactions();
  const deleteCategory = useDeleteCategory();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Category | null>(null);
  const [toDelete, setToDelete] = React.useState<Category | null>(null);

  const countByCategory = React.useMemo(() => {
    return transactions.reduce<Record<string, number>>((acc, transaction) => {
      acc[transaction.categoryId] = (acc[transaction.categoryId] ?? 0) + 1;
      return acc;
    }, {});
  }, [transactions]);

  function handleCreate() {
    setSelected(null);
    setDialogOpen(true);
  }

  function handleEdit(category: Category) {
    setSelected(category);
    setDialogOpen(true);
  }

  async function handleDelete() {
    if (!toDelete) return;
    try {
      await deleteCategory.mutateAsync(toDelete.id);
      toast.success("Categoria excluída");
      setToDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div>
      <PageHeader
        title="Categorias"
        description="Organize suas transações em categorias."
        action={
          <Button onClick={handleCreate}>
            <Plus className="size-4" />
            Nova categoria
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-accent">
              <Tags className="size-6 text-primary" />
            </span>
            <p className="text-sm text-muted-foreground">
              Nenhuma categoria criada ainda.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card className="p-6 gap-5" key={category.id}>
              <CardContent className="flex items-start justify-between gap-2 p-0">
                <CategoryIcon icon={category.icon} color={category.color} />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">Ações</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(category)}>
                      <Pencil className="size-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setToDelete(category)}
                    >
                      <Trash2 className="size-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
              <div className="flex flex-col gap-1">
                <p className="font-bold">{category.name}</p>
                {category.description ? (
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                ) : null}
              </div>
              <CardFooter className="p-0">
                <div className="w-full flex justify-between items-center">
                  <CategoryColor color={category.color} label={category.name} />
                  <p className="text-sm text-muted-foreground">
                    {countByCategory[category.id] ?? 0}{" "}
                    {(countByCategory[category.id] ?? 0) === 1
                      ? "item"
                      : "itens"}
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={selected}
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Excluir categoria"
        description={`Tem certeza que deseja excluir "${toDelete?.name}"? Transações vinculadas podem impedir a exclusão.`}
        loading={deleteCategory.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}

