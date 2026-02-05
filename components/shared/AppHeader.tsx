'use client';

import Link from 'next/link';
import { FileText, Users, History as HistoryIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { AuthenticatedUserMenu } from '@/components/auth-ui/AuthenticatedUserMenu';
import { SignInPromptButton } from '@/components/auth-ui/SignInPromptButton';
import { LanguageSelector } from '@/components/layout/LanguageSelector';

export function AppHeader() {
  const { data: sessionData } = useSession();
  const t = useTranslations('nav');

  return (
    <header className="bg-primary-dark text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <FileText size={28} />
            <span className="text-xl font-bold">Resume AI</span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link 
              href="/profiles" 
              className="flex items-center space-x-2 hover:text-accent-gold transition-colors"
            >
              <Users size={20} />
              <span>{t('profiles')}</span>
            </Link>
            <Link 
              href="/history" 
              className="flex items-center space-x-2 hover:text-accent-gold transition-colors"
            >
              <HistoryIcon size={20} />
              <span>{t('history')}</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <LanguageSelector />
            {sessionData?.user ? <AuthenticatedUserMenu /> : <SignInPromptButton />}
          </div>
        </div>
      </div>
    </header>
  );
}
