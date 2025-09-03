import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootGroupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-light-100 text-dark-900">
      <Navbar cartCount={2} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
