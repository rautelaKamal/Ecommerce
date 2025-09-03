"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname === "/sign-in" || pathname === "/sign-up";

  return (
    <>
      {!isAuth && <Navbar cartCount={2} />}
      {children}
      {!isAuth && <Footer />}
    </>
  );
}
