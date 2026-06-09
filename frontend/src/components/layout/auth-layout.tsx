import { Outlet } from "react-router-dom";
import { Brand } from "../brand";

export function AuthLayout() {
  return (
    <div className="my-12 flex flex-col items-center">
      <header>
        <Brand size="medium" />
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}

