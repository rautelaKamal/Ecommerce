import Link from "next/link";
import SocialProviders from "./SocialProviders";

export interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

export default function AuthForm({ type }: AuthFormProps) {
  const isSignIn = type === "sign-in";
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-6 text-center text-sm text-dark-700">
        {isSignIn ? (
          <span>
            New here? {""}
            <Link href="/sign-up" className="underline hover:text-dark-900">
              Create an account
            </Link>
          </span>
        ) : (
          <span>
            Already have an account? {""}
            <Link href="/sign-in" className="underline hover:text-dark-900">
              Sign In
            </Link>
          </span>
        )}
      </div>

      <h1 className="mb-1 text-center text-heading-2 text-dark-900 font-bold">
        {isSignIn ? "Welcome Back" : "Join Nike Today!"}
      </h1>
      <p className="mb-6 text-center text-body text-dark-700">
        {isSignIn
          ? "Sign in to continue your journey"
          : "Create your account to start your fitness journey"}
      </p>

      <SocialProviders action={isSignIn ? "sign in" : "sign up"} />

      <div className="my-6 flex items-center gap-4">
        <hr className="h-px flex-1 border-0 bg-light-300" />
        <span className="text-xs text-dark-700">Or {isSignIn ? "sign in" : "sign up"} with</span>
        <hr className="h-px flex-1 border-0 bg-light-300" />
      </div>

      <form className="space-y-4" noValidate>
        {!isSignIn && (
          <div>
            <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-dark-900">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-light-300 bg-light-100 px-3 py-2 text-sm text-dark-900 placeholder-dark-500 outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
            />
          </div>
        )}
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-dark-900">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="johndoe@gmail.com"
            className="w-full rounded-lg border border-light-300 bg-light-100 px-3 py-2 text-sm text-dark-900 placeholder-dark-500 outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-dark-900">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="minimum 8 characters"
            className="w-full rounded-lg border border-light-300 bg-light-100 px-3 py-2 text-sm text-dark-900 placeholder-dark-500 outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-full bg-dark-900 px-5 py-3 text-center text-sm font-semibold text-light-100 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
          aria-label={isSignIn ? "Sign In" : "Sign Up"}
        >
          {isSignIn ? "Sign In" : "Sign Up"}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-dark-700">
        By {isSignIn ? "signing in" : "signing up"}, you agree to our {""}
        <a href="#" className="underline">Terms of Service</a> and {""}
        <a href="#" className="underline">Privacy Policy</a>.
      </p>

      <p className="mt-6 text-center text-xs text-dark-700">© 2025 Nike. All rights reserved.</p>
    </div>
  );
}
