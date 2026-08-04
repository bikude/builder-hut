import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { branches, directionsUrl } from '@/content/branches';

export default function NotFound() {
  return (
    <section className="container flex min-h-[80svh] flex-col items-center justify-center gap-8 py-32 text-center">
      <p className="font-mono text-eyebrow uppercase text-brand-bullion">Error 404</p>
      <h1 className="text-display-md">
        This rep <span className="text-engraved">does not exist</span>
      </h1>
      <p className="max-w-md text-base leading-relaxed text-brand-smoke">
        The page you were looking for has moved or never existed. The floors, however, are still open.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild variant="bullion" size="lg">
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/branches">Find a branch</Link>
        </Button>
      </div>
      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-4">
        {branches.map((branch) => (
          <li key={branch.slug}>
            <a
              href={directionsUrl(branch)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-brand-smoke hover:text-brand-bullion"
            >
              {branch.shortName} →
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
