'use client';

import { ThemeProvider } from 'next-themes';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { LOCALES, LocaleContext, type Locale } from '@/lib/i18n';

/**
 * Theme and language, held together.
 *
 * `next-themes` writes the theme class before first paint, which is what stops the
 * white-flash-then-dark that a hand-rolled toggle always produces.
 *
 * Language is remembered in localStorage and, on a first visit, guessed once from the
 * browser's own `navigator.language`. Guessed rather than forced: someone in Kolkata with
 * a Bengali phone gets Bengali, and one tap moves them back to English, which is the
 * default whenever there is any doubt.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const stored = window.localStorage.getItem('abh-locale');
    if (stored && (LOCALES as readonly string[]).includes(stored)) {
      setLocaleState(stored as Locale);
      return;
    }
    const preferred = navigator.language.toLowerCase();
    if (preferred.startsWith('bn')) setLocaleState('bn');
    else if (preferred.startsWith('hi')) setLocaleState('hi');
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem('abh-locale', next);
    // Keep the document in step so screen readers switch pronunciation, and so
    // `:lang()` styling can pick the right font stack for Bengali and Devanagari.
    document.documentElement.lang = next === 'en' ? 'en-IN' : next;
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
    </ThemeProvider>
  );
}
