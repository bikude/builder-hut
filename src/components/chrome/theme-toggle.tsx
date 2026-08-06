'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/**
 * Dark / bright switch.
 *
 * Renders a fixed-size placeholder until mounted. The server cannot know which theme is
 * active, so drawing the icon before hydration would either flash the wrong one or shift
 * the header layout when it corrects itself.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme !== 'light';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`${t.theme}: ${isDark ? 'dark' : 'bright'}`}
      className={cn(
        'flex size-9 items-center justify-center rounded-full border border-brand-chalk/15 text-brand-chalk transition-colors hover:border-brand-bullion hover:text-brand-bullion',
        className,
      )}
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-4" aria-hidden="true" />
        ) : (
          <Moon className="size-4" aria-hidden="true" />
        )
      ) : (
        <span className="size-4" />
      )}
    </button>
  );
}
