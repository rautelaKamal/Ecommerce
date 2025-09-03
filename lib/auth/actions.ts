"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { getDb } from "../db/client";
import { accounts, guests, sessions, users } from "../db/schema";
import crypto from "crypto";

// Cookie names (aligning with Better Auth semantics)
export const AUTH_COOKIE = "auth_session"; // user session
export const GUEST_COOKIE = "guest_session"; // guest session

// 7 days in ms
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

const secureCookieOpts = {
  httpOnly: true as const,
  secure: true as const,
  sameSite: "strict" as const,
  path: "/",
};

// Password hashing helpers (PBKDF2)
function hashPassword(password: string, salt?: string) {
  const usedSalt = salt ?? crypto.randomBytes(16).toString("hex");
  const derived = crypto.pbkdf2Sync(password, usedSalt, 310000, 32, "sha256");
  return `${usedSalt}:${derived.toString("hex")}`;
}
function verifyPassword(password: string, stored: string) {
  const [salt, hex] = stored.split(":");
  const verify = hashPassword(password, salt);
  return verify === `${salt}:${hex}`;
}

// Zod schemas for inputs
const signUpSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email(),
  password: z.string().min(8),
});
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;

// Guest session helpers
export async function createGuestSession() {
  const cookieStore = await cookies();
  const existing = cookieStore.get(GUEST_COOKIE)?.value;
  const db = getDb();

  if (existing) {
    // Ensure record exists; if not, create it again
    const now = new Date();
    const found = await db.query.guests.findFirst({
      where: eq(guests.sessionToken, existing),
    });
    if (!found) {
      await db.insert(guests).values({
        sessionToken: existing,
        expiresAt: new Date(Date.now() + SEVEN_DAYS),
      });
    }
    return { sessionToken: existing };
  }

  const token = crypto.randomUUID();
  await db.insert(guests).values({
    sessionToken: token,
    expiresAt: new Date(Date.now() + SEVEN_DAYS),
  });

  cookieStore.set(GUEST_COOKIE, token, {
    ...secureCookieOpts,
    expires: new Date(Date.now() + SEVEN_DAYS),
  });
  return { sessionToken: token };
}

export async function guestSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(GUEST_COOKIE)?.value;
  if (!token) return null;
  const db = getDb();
  const session = await db.query.guests.findFirst({ where: eq(guests.sessionToken, token) });
  return session ?? null;
}

// Create a persistent auth session cookie and DB record
async function createAuthSession(userId: string) {
  const db = getDb();
  const token = crypto.randomUUID();
  const now = Date.now();
  const expires = new Date(now + SEVEN_DAYS);
  await db.insert(sessions).values({ userId, token, expiresAt: expires });
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, { ...secureCookieOpts, expires });
  return { token, userId };
}

export async function signUp(input: SignUpInput) {
  const { email, password, name } = signUpSchema.parse(input);
  const db = getDb();

  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) {
    throw new Error("Email already in use");
  }

  const userId = crypto.randomUUID();
  await db.insert(users).values({ id: userId, email, name });
  const pwd = hashPassword(password);
  await db.insert(accounts).values({
    userId,
    accountId: email,
    providerId: "credentials",
    password: pwd,
  });

  await migrateGuestIntoUser(userId);
  const session = await createAuthSession(userId);
  return { userId, sessionToken: session.token };
}

export async function signIn(input: SignInInput) {
  const { email, password } = signInSchema.parse(input);
  const db = getDb();

  const account = await db.query.accounts.findFirst({
    where: and(eq(accounts.providerId, "credentials"), eq(accounts.accountId, email)),
  });
  if (!account?.userId || !account.password) {
    throw new Error("Invalid credentials");
  }
  const ok = verifyPassword(password, account.password);
  if (!ok) throw new Error("Invalid credentials");

  await migrateGuestIntoUser(account.userId);
  const session = await createAuthSession(account.userId);
  return { userId: account.userId, sessionToken: session.token };
}

export async function signOut() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return { ok: true };
  const db = getDb();
  await db.delete(sessions).where(eq(sessions.token, token));
  cookieStore.delete(AUTH_COOKIE);
  return { ok: true };
}

// Merge guest data and clear guest cookie and record
export async function mergeGuestCartWithUserCart(_userId: string, _guestToken: string) {
  // Placeholder for MVP: hook cart/order transfer here.
  return { merged: true };
}

async function migrateGuestIntoUser(userId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(GUEST_COOKIE)?.value;
  if (!token) return;
  await mergeGuestCartWithUserCart(userId, token);
  const db = getDb();
  await db.delete(guests).where(eq(guests.sessionToken, token));
  cookieStore.delete(GUEST_COOKIE);
}
