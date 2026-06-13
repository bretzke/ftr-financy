import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { profileSchema, type ProfileFormValues } from "@/lib/schemas";
import { getInitials } from "@/lib/format";
import { getErrorMessage } from "@/lib/error";

export function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = React.useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });

  React.useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, form]);

  async function onSubmit(values: ProfileFormValues) {
    try {
      setIsSaving(true);
      await updateProfile(values.name);
      toast.success("Perfil atualizado com sucesso");
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível atualizar o perfil"));
    } finally {
      setIsSaving(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  if (!user) return null;

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-[448px] gap-0">
        <CardContent className="flex flex-col items-center px-6 pt-8 pb-6">
          <Avatar className="size-16">
            <AvatarFallback className="bg-muted text-lg text-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <h1 className="mt-4 text-xl font-semibold">{user.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>

          <div className="my-6 h-px w-full bg-border" />

          <div className="w-full">
            <h2 className="text-base font-semibold">Informações pessoais</h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-4"
                noValidate
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          disabled
                          className="opacity-50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSaving}>
                  Salvar alterações
                </Button>
              </form>
            </Form>

            <Button
              type="button"
              variant="outline"
              className="mt-3 w-full"
              onClick={handleLogout}
            >
              <LogOut className="size-4 text-destructive" />
              Sair da conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
