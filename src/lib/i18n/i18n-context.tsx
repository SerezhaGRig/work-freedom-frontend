'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation, Locale } from './translations';
import { LOCALE_KEY } from '@/config/constants';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);


export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem(LOCALE_KEY);
    if (savedLocale && ['en', 'ru', 'hy'].includes(savedLocale)) {
      setLocaleState(savedLocale as Locale);
    } else {
      // Detect browser language
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang === 'hy') setLocaleState('hy');
      else if (browserLang === 'ru') setLocaleState('ru');
      else setLocaleState('en');
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_KEY, newLocale);
  };

  const t = (key: string, params?: Record<string, any>) => {
    return getTranslation(locale, key, params);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}