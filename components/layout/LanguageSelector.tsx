'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('language');

  const currentLocale = (params.locale as string) || 'en';
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setIsOpen(false);
    
    // Save language preference to localStorage
    localStorage.setItem('preferred-locale', langCode);
    
    // Update the URL with the new locale
    const currentPath = pathname.replace(/^\/(en|es)/, '') || '/';
    const newPath = langCode === 'en' ? currentPath : `/${langCode}${currentPath}`;
    router.push(newPath);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Select language"
      >
        <Globe size={20} />
        <span className="text-sm font-medium">{currentLanguage.code.toUpperCase()}</span>
        <span className="text-xs">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                currentLocale === lang.code ? 'bg-gray-50 font-semibold' : ''
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-sm text-gray-900">{t(lang.code as any)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
