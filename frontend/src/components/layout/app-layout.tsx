import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Brand } from "@/components/brand";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/transactions", label: "Transações" },
  { to: "/categories", label: "Categorias" },
];

export function AppLayout() {
  const { user } = useAuth();

  return (
    <>
      <nav className="bg-white px-12 py-4 flex items-center justify-between">
        <Brand size="small" />
        <div className="flex items-center gap-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 text-sm text-muted-foreground",
                  isActive && "text-primary font-semibold",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <NavLink to="/profile" className="flex items-center gap-2">
          <Avatar className="size-9">
            <AvatarFallback>{getInitials(user?.name || "")}</AvatarFallback>
          </Avatar>
        </NavLink>
      </nav>
      <main className="flex-1 overflow-y-auto p-4 md:p-12">
        <Outlet />
      </main>
    </>
  );
}

