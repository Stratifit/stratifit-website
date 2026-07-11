import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";

/* ------------------------------------------------------------------ */
/*  GET /api/admin/session                                            */
/*  Returns the current admin session (or 401 if not signed in).      */
/*  Used by the client-side AdminGuard on mount.                       */
/* ------------------------------------------------------------------ */
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    email: session.email,
    exp: session.exp,
  });
}
