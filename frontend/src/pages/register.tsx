import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerSchema, type RegisterFormValues } from "@/lib/schemas";
import { getErrorMessage } from "@/lib/error";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthFooter } from "@/components/auth-footer";
import { FieldDescription } from "@/components/ui/field";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      await register(values);
      toast.success("Conta criada com sucesso!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível criar a conta"));
    }
  }

  return (
    <Card className="min-w-[448px] p-8 flex flex-col gap-6">
      <CardHeader className="text-center flex flex-col gap-1 mb-2">
        <CardTitle className="font-bold text-xl">Criar conta</CardTitle>
        <CardDescription className="text-md">
          Comece a controlar suas finanças ainda hoje
        </CardDescription>
      </CardHeader>

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
                  <Input
                    placeholder="Seu nome completo"
                    autoComplete="name"
                    {...field}
                  />
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
                    placeholder="mail@exemplo.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Digite sua senha"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FieldDescription>
                  A senha deve ter no mínimo 8 caracteres
                </FieldDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mt-2 w-full"
            disabled={form.formState.isSubmitting}
          >
            Criar conta
          </Button>
        </form>
      </Form>

      <AuthFooter action="login" />
    </Card>
  );
}

