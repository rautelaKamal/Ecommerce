"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface NavbarProps {
  cartCount?: number;
}

const navItems = [
  { label: "Men", href: "/products?gender=men" },
  { label: "Women", href: "/products?gender=women" },
  { label: "Kids", href: "/products?gender=unisex" },
  { label: "Collections", href: "/products" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar({ cartCount = 0 }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--color-light-100)] text-[var(--color-dark-900)] shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8" aria-label="Primary">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <Image src="/logo-black.svg" alt="Brand" width={32} height={32} priority />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6 font-medium text-sm">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="transition-colors hover:text-[var(--color-dark-700)]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-6">
          <button className="text-sm transition-colors hover:text-[var(--color-dark-700)]" aria-label="Search">
            Search
          </button>
          <button className="text-sm transition-colors hover:text-[var(--color-dark-700)]" aria-label={`Cart with ${cartCount} items`}>
            My Cart ({cartCount})
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-[var(--color-dark-900)] hover:bg-[var(--color-light-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-dark-900)]"
          aria-label="Toggle navigation"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {open ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      <div id="mobile-menu" className={`md:hidden ${open ? "block" : "hidden"} border-t border-[var(--color-light-300)] bg-[var(--color-light-100)]`}> 
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="block py-1 text-[var(--color-dark-900)] hover:text-[var(--color-dark-700)]"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 mt-2 border-t border-[var(--color-light-300)] flex items-center justify-between">
              <button className="text-sm" aria-label="Search">Search</button>
              <button className="text-sm" aria-label={`Cart with ${cartCount} items`}>
                Cart ({cartCount})
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
