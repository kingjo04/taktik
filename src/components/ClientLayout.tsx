"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isRegisterPage = pathname === "/register";
  const isLoginPage = pathname === "/login";

  return (
    <main className="flex min-h-screen h-screen">
      {!isRegisterPage && !isLoginPage && <Sidebar />}
      <div className="flex-grow min-h-screen overflow-auto">
        {!isRegisterPage && !isLoginPage && <Header />}
        {children}
      </div>
    </main>
  );
}