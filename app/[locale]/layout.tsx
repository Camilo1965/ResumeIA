import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { AppHeader } from '@/components/shared/AppHeader';
import { AuthSessionProvider } from '@/components/providers/AuthSessionProvider';
import { notFound } from 'next/navigation';
import { locales } from '@/src/i18n';

export const metadata = {
  title: 'Resume AI - AI-Powered CV Generator',
  description: 'Generate personalized resumes with artificial intelligence',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <AuthSessionProvider>
            <AppHeader />
            <main className="min-h-screen bg-gray-50">
              {children}
            </main>
          </AuthSessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
