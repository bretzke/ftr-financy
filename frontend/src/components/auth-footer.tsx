import { LogInIcon, UserPlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { CardFooter } from "./ui/card";
import { Button } from "./ui/button";

interface AuthFooterProps {
  action: "login" | "register";
}

export function AuthFooter({ action }: AuthFooterProps) {
  const text =
    action === "register" ? "Ainda não tem uma conta?" : "Já tem uma conta?";
  const linkText = action === "register" ? "Criar conta" : "Fazer login";
  const linkTo = action === "register" ? "/register" : "/login";
  const linkIcon = action === "register" ? <UserPlusIcon /> : <LogInIcon />;

  return (
    <CardFooter className="flex flex-col justify-center items-center gap-4 p-0">
      <div className="flex items-center gap-3 mb-2 w-full">
        <hr className="w-full" />
        <span className="text-sm text-muted-foreground">ou</span>
        <hr className="w-full" />
      </div>

      <p className="text-sm text-muted-foreground">{text}</p>
      <Link to={linkTo} className="font-medium hover:underline w-full">
        <Button variant="outline" className="w-full">
          {linkIcon} {linkText}
        </Button>
      </Link>
    </CardFooter>
  );
}

