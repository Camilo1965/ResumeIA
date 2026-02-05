import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Supported locales
export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale: locale as string,
    messages: {
      ...(await import(`./locales/${locale}/common.json`)).default,
      resume: (await import(`./locales/${locale}/resume.json`)).default,
      profiles: (await import(`./locales/${locale}/profiles.json`)).default,
      history: (await import(`./locales/${locale}/history.json`)).default,
    },
  };
});
