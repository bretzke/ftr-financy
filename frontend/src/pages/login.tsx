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
import { loginSchema, type LoginFormValues } from "@/lib/schemas";
import { getErrorMessage } from "@/lib/error";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthFooter } from "@/components/auth-footer";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      await login(values);
      toast.success("Bem-vindo de volta!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível fazer login"));
    }
  }

  return (
    <Card className="min-w-[448px] p-8 flex flex-col gap-6">
      <CardHeader className="text-center flex flex-col gap-1 mb-2">
        <CardTitle className="font-bold text-xl">Fazer login</CardTitle>
        <CardDescription className="text-md">
          Entre na sua conta para continuar
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
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center gap-4">
            <div className="flex gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="font-normal">
                Lembrar-me
              </Label>
            </div>

            <a href="#" className="text-sm text-primary">
              Recuperar senha
            </a>
          </div>

          <Button
            type="submit"
            className="mt-2 w-full"
            disabled={form.formState.isSubmitting}
          >
            Entrar
          </Button>
        </form>
      </Form>

      <AuthFooter action="login" />
    </Card>
  );
}

