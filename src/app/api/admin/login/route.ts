import { NextRequest, NextResponse } from "next/server";
import {
  authenticateAdmin,
  clearAdminCookie,
  setAdminCookie,
} from "@/lib/admin-auth";

/* ------------------------------------------------------------------ */
/*  POST /api/admin/login                                             */
/*  Verifies (email, password), sets a signed httpOnly cookie.         */
/* ------------------------------------------------------------------ */
export async function POST(req: NextRequest) {
  let body: { email?: unknown; password?: unknown };
  try {
    body = (await req.json()) as { email?: unknown; password?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  const result = authenticateAdmin(email, password);
  if (!result.ok) {
    switch (result.reason) {
      case "no-password-configured":
        return NextResponse.json(
          {
            error:
              "Admin auth is not configured on this server. Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET as environment variables in your hosting platform's dashboard (e.g. Vercel \u2192 Project \u2192 Settings \u2192 Environment Variables), then redeploy. Note: .env.local is only loaded in local development \u2014 it is ignored in production deployments.",
          },
          { status: 503 },
        );
      case "missing-credentials":
        return NextResponse.json(
          { error: "Email and password are required" },
          { status: 400 },
        );
      case "email-mismatch":
      case "invalid-credentials":
      default:
        // Single generic message to avoid email-enumeration leaks.
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 },
        );
    }
  }

  const res = NextResponse.json({ ok: true, email: result.email });
  setAdminCookie(res, result.email!);
  return res;
}

/* ------------------------------------------------------------------ */
/*  DELETE /api/admin/login                                           */
/*  Clears the admin session cookie.                                  */
/* ------------------------------------------------------------------ */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  clearAdminCookie(res);
  return res;
}
