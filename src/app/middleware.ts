import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas que exigem autenticação
const protectedRoutes = ['/checkout', '/pedidos', '/perfil', '/api'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Verifica se a rota atual é protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute) {
    // Se estiver autenticado, prossegue e injeta headers de proteção contra robôs
    const response = NextResponse.next();

    // Garante que mesmo se o robô burlar o robots.txt, a página não será indexada
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');

    return response;
  }

  return NextResponse.next();
}

// Configuração do Matcher: Define em quais rotas o middleware deve executar
export const config = {
  matcher: [
    /*
     * Executa em todas as rotas, exceto:
     * - api/ (tratado pelo backend ou rotas dedicadas)
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
