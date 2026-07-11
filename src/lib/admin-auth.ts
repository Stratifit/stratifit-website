import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

/* ------------------------------------------------------------------ */
/*  Cookie + session types                                            */
/* ------------------------------------------------------------------ */

export const ADMIN_COOKIE = "stratifit_admin";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

export interface AdminSession {
  /** Email of the signed-in admin. */
  email: string;
  /** Always "admin" today; reserved for future role expansion. */
  role: "admin";
  /** Unix-ms timestamp when the session expires. */
  exp: number;
}

/* ------------------------------------------------------------------ */
/*  Cookie signing                                                    */
/* ------------------------------------------------------------------ */

/**
 * Returns the secret used to sign admin session cookies.
 *
 * Priority:
 *   1. `ADMIN_SESSION_SECRET` (recommended for prod — independent of DB creds)
 *   2. `SUPABASE_SERVICE_ROLE_KEY` (dev convenience if Supabase is wired)
 *   3. A hard-coded dev-only fallback. The fallback is intentionally weak and
 *      will be flagged in the logs the first time it's used. Production MUST
 *      set `ADMIN_SESSION_SECRET`.
 */
function getSecret(): string {
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET;
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
  // eslint-disable-next-line no-console
  console.warn(
    "[admin-auth] No ADMIN_SESSION_SECRET or SUPABASE_SERVICE_ROLE_KEY set. " +
      "Using an insecure dev-only fallback. DO NOT deploy to production like this.",
  );
  return "stratifit-dev-only-insecure-secret";
}

function signPayload(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function verifySignature(payload: string, signature: string): boolean {
  const expected = signPayload(payload);
  // Length check first to avoid timingSafeEqual throwing on mismatch
  if (expected.length !== signature.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export function encodeSession(session: AdminSession): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const sig = signPayload(payload);
  return `${payload}.${sig}`;
}

export function decodeSession(token: string | undefined | null): AdminSession | null {
  if (!token) return null;
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!verifySignature(payload, sig)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")) as AdminSession;
    if (typeof session.exp !== "number" || session.exp < Date.now()) return null;
    if (session.role !== "admin" || typeof session.email !== "string") return null;
    return session;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Cookie helpers (server-only)                                      */
/* ------------------------------------------------------------------ */

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return decodeSession(token);
}

export function setAdminCookie(res: NextResponse, email: string): NextResponse {
  const exp = Date.now() + COOKIE_MAX_AGE_SECONDS * 1000;
  const session: AdminSession = { email, role: "admin", exp };
  const token = encodeSession(session);
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
  return res;
}

export function clearAdminCookie(res: NextResponse): NextResponse {
  res.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return res;
}

/* ------------------------------------------------------------------ */
/*  Credential check                                                  */
/* ------------------------------------------------------------------ */

const DEFAULT_DEV_EMAIL = "admin@stratifit.com";
const DEFAULT_DEV_PASSWORD = "stratifit-admin";

export type AuthFailureReason =
  | "no-password-configured"
  | "missing-credentials"
  | "email-mismatch"
  | "invalid-credentials";

export interface AuthCheckResult {
  ok: boolean;
  email?: string;
  reason?: AuthFailureReason;
}

/**
 * Verify a (email, password) pair against the configured admin credentials.
 *
 * - In **production**: requires `ADMIN_PASSWORD` to be set. If it is not,
 *   authentication is refused with `no-password-configured` (better to fail
 *   closed than allow open access).
 * - In **development**: if `ADMIN_PASSWORD` is not set, falls back to the
 *   hard-coded default credentials (`admin@stratifit.com` / `stratifit-admin`)
 *   so the CMS editor still works locally without env-var setup.
 */
export function authenticateAdmin(email: string, password: string): AuthCheckResult {
  if (!email || !password) {
    return { ok: false, reason: "missing-credentials" };
  }

  const envEmail = process.env.ADMIN_EMAIL || DEFAULT_DEV_EMAIL;
  const envPassword = process.env.ADMIN_PASSWORD;

  if (!envPassword) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, reason: "no-password-configured" };
    }
    // Dev fallback so local dev "just works" without env config.
    if (email === envEmail && password === DEFAULT_DEV_PASSWORD) {
      return { ok: true, email };
    }
    return { ok: false, reason: "no-password-configured" };
  }

  // Constant-time comparison to avoid timing leaks on the password check.
  const a = Buffer.from(password);
  const b = Buffer.from(envPassword);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: "invalid-credentials" };
  }
  if (email !== envEmail) {
    return { ok: false, reason: "email-mismatch" };
  }
  return { ok: true, email };
}

/**
 * True if the server has admin auth fully configured (i.e. an
 * `ADMIN_PASSWORD` is set, OR we're in dev with the default fallback).
 * Exposed for the login page to decide whether to show a "server not
 * configured" error vs. just accepting the default credentials.
 */
export function isAdminAuthConfigured(): boolean {
  if (process.env.ADMIN_PASSWORD) return true;
  if (process.env.NODE_ENV !== "production") return true;
  return false;
}
