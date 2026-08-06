import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas públicas que nunca precisam de autenticação
const PUBLIC_ROUTES = ["/", "/api/auth"];

function isPublicRoute(pathname: string): boolean {
  return pathname === "/" || pathname.startsWith("/api/auth");
}

/**
 * Valida a sessão chamando o endpoint do Better-Auth.
 * Retorna true apenas se o servidor confirmar que a sessão é válida e ativa no banco.
 */
async function isSessionValid(request: NextRequest): Promise<boolean> {
  // Verifica primeiro se existe algum cookie — evita chamada desnecessária ao banco
  const hasCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token") ||
    request.cookies.get("better-auth.session");

  console.log(`[PROXY] Validando sessão para ${request.nextUrl.pathname}. Tem cookie?`, !!hasCookie);

  if (!hasCookie) return false;

  try {
    // Chama o endpoint do Better-Auth passando os cookies da requisição original
    // Isso valida a sessão REALMENTE no banco PostgreSQL (não apenas checa o cookie)
    const baseUrl = request.nextUrl.origin;
    const sessionRes = await fetch(`${baseUrl}/api/auth/get-session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    if (!sessionRes.ok) return false;

    const data = await sessionRes.json();
    // Better-Auth retorna { session: {...}, user: {...} } quando válido, ou null
    return !!(data?.session && data?.user);
  } catch {
    // Em caso de falha na chamada (ex: startup do servidor), nega o acesso por segurança
    return false;
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas passam direto — sem validação de sessão
  if (isPublicRoute(pathname)) {
    // Se o usuário acessar "/" já autenticado, valida a sessão e redireciona ao dashboard
    if (pathname === "/") {
      const valid = await isSessionValid(request);
      if (valid) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  // Rota privada: valida a sessão no banco via Better-Auth
  const valid = await isSessionValid(request);

  if (!valid) {
    // Sessão inexistente, expirada ou inválida — redireciona ao Login
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Intercepta todas as rotas exceto recursos estáticos internos do Next.js
     * e arquivos de mídia (imagens, fontes, ícones)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?)$).*)",
  ],
};
