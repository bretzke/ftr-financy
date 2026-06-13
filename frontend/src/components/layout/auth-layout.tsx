import { Outlet } from "react-router-dom";
import { Brand } from "../brand";

export function AuthLayout() {
  return (
    <div className="mt-12 flex flex-col items-center gap-8">
      <header>
        <Brand size="medium" />
      </header>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

