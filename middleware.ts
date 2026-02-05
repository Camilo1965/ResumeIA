import { withAuth } from "next-auth/middleware"
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales, defaultLocale } from './src/i18n';

// Create the intl middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // Don't show /en in URL for default locale
});

export default withAuth(
  function middleware(req) {
    // Apply intl middleware
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Extract locale from pathname
        const pathname = req.nextUrl.pathname;
        const pathnameWithoutLocale = pathname.replace(/^\/(en|es)/, '') || '/';
        
        // Rutas públicas
        const publicPaths = ['/login', '/register', '/share'];
        const isPublicPath = publicPaths.some(path => 
          pathnameWithoutLocale.startsWith(path)
        );
        
        if (isPublicPath) return true;
        return !!token;
      },
    },
  }
)

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
