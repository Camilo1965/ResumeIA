import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        const publicRoutes = ['/login', '/register'];
        const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
        
        if (isPublicRoute) {
          return true;
        }

        const isShareRoute = pathname.startsWith('/share/');
        if (isShareRoute) {
          return true;
        }

        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    '/',
    '/profiles/:path*',
    '/history/:path*',
    '/login',
    '/register',
  ],
};
