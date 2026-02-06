import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n';

// Create the intl middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always', // Always show locale in URL for simplicity
});

export default intlMiddleware;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
