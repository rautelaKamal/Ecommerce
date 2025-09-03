import Image from "next/image";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100dvh-0px)] bg-light-200 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-2xl bg-light-100 shadow-sm ring-1 ring-light-300 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left brand panel */}
          <div className="relative hidden md:block bg-dark-900 p-8 text-light-100">
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Brand" width={28} height={28} />
            </div>
            <div className="absolute inset-x-8 bottom-8">
              <h2 className="mb-2 text-heading-2 font-bold">Just Do It</h2>
              <p className="text-body text-light-400">
                Join millions of athletes and fitness enthusiasts who trust Nike for their performance needs.
              </p>
              <div className="mt-4 flex gap-2" aria-hidden>
                <span className="inline-block h-2 w-2 rounded-full bg-light-400/70"/>
                <span className="inline-block h-2 w-2 rounded-full bg-light-400/40"/>
                <span className="inline-block h-2 w-2 rounded-full bg-light-400/40"/>
              </div>
              <p className="mt-10 text-xs text-light-400">© 2025 Nike. All rights reserved.</p>
            </div>
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
