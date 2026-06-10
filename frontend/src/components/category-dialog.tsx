import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-categories";
import { categorySchema, type CategoryFormValues } from "@/lib/schemas";
import { getErrorMessage } from "@/lib/error";
import {
  CATEGORY_COLORS,
  CATEGORY_COLOR_MAP,
  CATEGORY_ICONS,
  CATEGORY_ICON_MAP,
  DEFAULT_CATEGORY_COLOR,
  DEFAULT_CATEGORY_ICON,
  type CategoryColor,
  type CategoryIcon,
} from "@/lib/category-options";
import { cn } from "@/lib/utils";
import type { Category } from "@/graphql/types";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
}: CategoryDialogProps) {
  const isEditing = !!category;
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      icon: DEFAULT_CATEGORY_ICON,
      color: DEFAULT_CATEGORY_COLOR,
    },
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset({
      name: category?.name ?? "",
      description: category?.description ?? "",
      icon: (category?.icon as CategoryIcon) ?? DEFAULT_CATEGORY_ICON,
      color: (category?.color as CategoryColor) ?? DEFAULT_CATEGORY_COLOR,
    });
  }, [open, category, form]);

  const isPending = createCategory.isPending || updateCategory.isPending;

  async function onSubmit(values: CategoryFormValues) {
    try {
      if (isEditing && category) {
        await updateCategory.mutateAsync({ id: category.id, data: values });
        toast.success("Categoria atualizada com sucesso");
      } else {
        await createCategory.mutateAsync(values);
        toast.success("Categoria criada com sucesso");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar categoria" : "Nova categoria"}
          </DialogTitle>
          <DialogDescription>
            Organize suas transações com categorias
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex. Alimentação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalhes sobre a categoria..."
                      rows={3}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ícone</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-8 gap-2">
                      {CATEGORY_ICONS.map((iconKey) => {
                        const Icon = CATEGORY_ICON_MAP[iconKey];
                        const isSelected = field.value === iconKey;

                        return (
                          <Button
                            key={iconKey}
                            type="button"
                            title={iconKey}
                            onClick={() => field.onChange(iconKey)}
                            className={cn(
                              "flex size-9 items-center justify-center rounded-md border transition-colors",
                              isSelected
                                ? "border-primary bg-accent text-primary"
                                : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/50",
                            )}
                            variant="outline"
                          >
                            <Icon className="size-4" />
                          </Button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORY_COLORS.map((colorKey) => {
                        const { hex, label } = CATEGORY_COLOR_MAP[colorKey];
                        const isSelected = field.value === colorKey;

                        return (
                          <Button
                            key={colorKey}
                            type="button"
                            title={label}
                            onClick={() => field.onChange(colorKey)}
                            className={cn(
                              "size-8 rounded-full border-2 transition-transform",
                              isSelected
                                ? "scale-110 border-foreground"
                                : "border-transparent hover:scale-105",
                            )}
                            style={{ backgroundColor: hex }}
                          />
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isEditing ? "Salvar alterações" : "Criar categoria"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

