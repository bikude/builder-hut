'use client';

import { Languages } from 'lucide-react';
import { useState } from 'react';

import { LOCALES, LOCALE_LABEL, LOCALE_SHORT, useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/**
 * English / বাংলা / हिन्दी.
 *
 * A three-item popover rather than a `<select>`: native selects on Android render the
 * options in the system font, which mangles Bengali conjuncts badly enough to be hard to
 * read. Three buttons in our own type do not have that problem.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={t.language}
        className="flex h-9 items-center gap-1.5 rounded-full border border-brand-chalk/15 px-3 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-brand-chalk transition-colors hover:border-brand-bullion hover:text-brand-bullion"
      >
        <Languages className="size-3.5" aria-hidden="true" />
        {LOCALE_SHORT[locale]}
      </button>

      {open && (
        <>
          {/* Click-away layer. Sits under the menu but over the page. */}
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
            aria-hidden="true"
            tabIndex={-1}
          />
          <ul className="glass absolute right-0 top-11 z-50 w-36 overflow-hidden rounded-lg p-1">
            {LOCALES.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => {
                    setLocale(option);
                    setOpen(false);
                  }}
                  aria-current={option === locale}
                  className={cn(
                    'w-full rounded-md px-3 py-2 text-left text-sm transition-colors',
                    option === locale
                      ? 'bg-brand-bullion/15 text-brand-gilt'
                      : 'text-brand-chalk hover:bg-brand-chalk/8',
                  )}
                >
                  {LOCALE_LABEL[option]}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
