import { auth } from "@/auth/server";
import { headers } from "next/headers";

export async function checkVolunteerAuth() {
  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (!session || !session.user) {
      return { authenticated: false, session: null };
    }

    return { authenticated: true, session };
  } catch (error) {
    console.error("🔒 [Security Guard] Falha ao verificar sessão Better-Auth:", error);
    return { authenticated: false, session: null };
  }
}
