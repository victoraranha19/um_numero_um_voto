import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/', '/login'];

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/login';

export function proxy(request: NextRequest) {
  console.log('proxy funcionando');
  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
