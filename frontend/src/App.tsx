import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PublicOnlyRoute } from "@/components/protected-route";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { AuthLayout } from "./components/layout/auth-layout";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

