import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  userName?: string;
  role?: "customer" | "staff" | "admin";
}

export function Layout({
  children,
  title,
  userName,
  role = "customer",
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role={role} />
      <Header title={title} userName={userName} role={role} />
      <main className="ml-64 pt-16">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
