import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    title: "Featured",
    links: ["Air Force 1", "Huarache", "Air Max 90", "Air Max 95"],
  },
  {
    title: "Shoes",
    links: ["All Shoes", "Custom Shoes", "Jordan Shoes", "Running Shoes"],
  },
  {
    title: "Clothing",
    links: ["All Clothing", "Modest Wear", "Hoodies & Pullovers", "Shirts & Tops"],
  },
  {
    title: "Kids'",
    links: [
      "Infant & Toddler Shoes",
      "Kids' Shoes",
      "Kids' Jordan Shoes",
      "Kids' Basketball Shoes",
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 w-full bg-[var(--color-dark-900)] text-[var(--color-light-100)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Image src="/logo.svg" alt="Brand" width={40} height={40} />
          </div>

          {/* Columns */}
          <div className="md:col-span-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title} className="space-y-3">
                <h4 className="text-[var(--color-light-300)] font-semibold">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <Link href="#" className="text-sm text-[var(--color-light-400)] transition-colors hover:text-[var(--color-light-100)]">
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm text-[var(--color-light-400)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"/>
            </svg>
            <span>Delhi, India</span>
            <span className="mx-2">•</span>
            <span>© {new Date().getFullYear()} Nike, Inc. All Rights Reserved</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="#" aria-label="X">
              <Image src="/x.svg" alt="X" width={28} height={28} />
            </Link>
            <Link href="#" aria-label="Facebook">
              <Image src="/facebook.svg" alt="Facebook" width={28} height={28} />
            </Link>
            <Link href="#" aria-label="Instagram">
              <Image src="/instagram.svg" alt="Instagram" width={28} height={28} />
            </Link>
          </div>
        </div>

        {/* Legal links */}
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[var(--color-light-400)]">
          {[
            "Guides",
            "Terms of Sale",
            "Terms of Use",
            "Privacy Policy",
          ].map((l) => (
            <Link key={l} href="#" className="hover:text-[var(--color-light-100)]">
              {l}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
