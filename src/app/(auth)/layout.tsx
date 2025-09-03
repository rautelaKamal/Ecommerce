import Image from "next/image";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-light-200 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-light-100 shadow-sm ring-1 ring-light-300">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left brand panel (fixed + centered) */}
          <div className="relative hidden h-full min-h-[640px] md:flex flex-col bg-dark-900 text-light-100">
            {/* top-left logo */}
            <div className="absolute left-6 top-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-light-100/10">
                <Image src="/logo.svg" alt="Brand" width={24} height={24} />
              </div>
            </div>
            {/* centered content */}
            <div className="flex h-full w-full items-center">
              <div className="mx-8">
                <h2 className="mb-3 text-heading-2 font-bold">Just Do It</h2>
                <p className="max-w-md text-body text-light-400">
                  Join millions of athletes and fitness enthusiasts who trust Nike for their performance needs.
                </p>
                <div className="mt-6 flex gap-2" aria-hidden>
                  <span className="inline-block h-2 w-2 rounded-full bg-light-400/70" />
                  <span className="inline-block h-2 w-2 rounded-full bg-light-400/40" />
                  <span className="inline-block h-2 w-2 rounded-full bg-light-400/40" />
                </div>
              </div>
            </div>
            {/* bottom copyright */}
            <p className="absolute bottom-6 left-6 text-xs text-light-400">© 2025 Nike. All rights reserved.</p>
          </div>

          {/* Right content (forms) */}
          <div className="bg-light-100 px-6 py-10 sm:px-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
