'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { Locale } from '@/lib/i18n/translations';
import { useI18n } from '@/lib/i18n/i18n-context';

const languages = [
  { code: 'en' as Locale, name: 'English', flag: '🇺🇸' },
  { code: 'ru' as Locale, name: 'Русский', flag: '🇷🇺' },
  { code: 'hy' as Locale, name: 'Հայերեն', flag: '🇦🇲' },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{currentLanguage.flag}</span>
        <span className="text-sm text-gray-600 hidden sm:block">{currentLanguage.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                locale === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}