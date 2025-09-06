import Image from "next/image";

export interface SocialProvidersProps {
  action?: "sign in" | "sign up";
  variant?: "sign-in" | "sign-up";
}

export default function SocialProviders({ action, variant }: SocialProvidersProps) {
  const resolvedAction = action ?? (variant === "sign-up" ? "sign up" : "sign in");
  return (
    <div className="space-y-3">
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-light-300 bg-light-100 px-4 py-2.5 text-sm font-medium text-dark-900 transition-colors hover:bg-light-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
        aria-label={`Continue with Google to ${resolvedAction}`}
      >
        <Image src="/google.svg" width={18} height={18} alt="Google" />
        Continue with Google
      </button>
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-light-300 bg-light-100 px-4 py-2.5 text-sm font-medium text-dark-900 transition-colors hover:bg-light-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
        aria-label={`Continue with Apple to ${resolvedAction}`}
      >
        <Image src="/apple.svg" width={18} height={18} alt="Apple" />
        Continue with Apple
      </button>
    </div>
  );
}
