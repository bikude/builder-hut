'use client';

import { RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { siteConfig, telLink } from '@/lib/site';

/**
 * Route-level error boundary.
 *
 * The message states what happened and what to do about it, and — because this is a gym
 * whose whole promise is being reachable — it hands over a phone number rather than
 * leaving someone stuck on a broken page.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Digest is the only safe identifier to surface; the message may contain internals.
    console.error('Route error', error.digest ?? error.message);
  }, [error]);

  return (
    <div className="container flex min-h-[70vh] flex-col justify-center py-24">
      <span className="font-mono text-[0.625rem] uppercase tracking-[0.28em] text-brand-bullion">Error</span>
      <h1 className="mt-5 max-w-2xl text-display-sm">This page did not load</h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-chalk/75">
        Something broke on our side, not yours. Try again — and if it keeps happening, call the branch directly. The
        floor is staffed at every hour.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button type="button" variant="forge" size="lg" onClick={reset}>
          <RotateCcw aria-hidden="true" />
          Try again
        </Button>
        <Button asChild variant="glass" size="lg">
          <a href={telLink()}>Call {siteConfig.contact.phoneDisplay}</a>
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
      {error.digest && (
        <p className="mt-10 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">
          Reference {error.digest}
        </p>
      )}
    </div>
  );
}
