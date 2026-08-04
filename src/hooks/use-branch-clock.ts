'use client';

import { useEffect, useState } from 'react';

import { siteConfig } from '@/lib/site';
import { formatTimeIn } from '@/lib/utils';

type BranchClock = {
  /** HH:MM:SS in the gym's own time zone, regardless of where the visitor is. */
  time: string;
  /** Every branch runs 24x7, so this is true — it exists so a future exception is one edit. */
  isOpen: boolean;
  /** Human phrase for the current stretch of the day, used in the hero line. */
  period: 'late night' | 'early morning' | 'morning' | 'afternoon' | 'evening';
  ready: boolean;
};

function periodFor(hour: number): BranchClock['period'] {
  if (hour < 4) return 'late night';
  if (hour < 8) return 'early morning';
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

/**
 * Live clock for the gym's time zone.
 *
 * The 24x7 floor is this brand's single biggest differentiator, so the site states the
 * current Kolkata time and asserts the doors are open right now. Starts after mount to
 * keep server and client markup identical.
 */
export function useBranchClock(): BranchClock {
  const [state, setState] = useState<BranchClock>({
    time: '--:--:--',
    isOpen: true,
    period: 'evening',
    ready: false,
  });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hour = Number(
        new Intl.DateTimeFormat('en-GB', {
          timeZone: siteConfig.timeZone,
          hour: '2-digit',
          hour12: false,
        }).format(now),
      );
      setState({
        time: formatTimeIn(siteConfig.timeZone, now),
        isOpen: true,
        period: periodFor(hour),
        ready: true,
      });
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return state;
}
