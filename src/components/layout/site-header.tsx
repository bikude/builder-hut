'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Logo } from '@/components/common/logo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { branches, directionsUrl } from '@/content/branches';
import { useScrolled } from '@/hooks/use-scrolled';
import { mainNav, primaryNav, siteConfig, telLink, whatsappLink } from '@/lib/site';
import { cn, ordinal } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useScrolled(24);
  const [menuOpen, setMenuOpen] = useState(false);

  // Route changes should always leave the menu closed, including on browser back.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 h-[var(--header-h)] transition-all duration-500 ease-hut',
        scrolled ? 'glass-dark' : 'bg-transparent',
      )}
    >
      <div className="container flex h-full items-center justify-between gap-6">
        <Link href="/" aria-label={`${siteConfig.name} — home`} className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'relative font-mono text-[0.6875rem] uppercase tracking-[0.2em] transition-colors duration-300',
                isActive(item.href) ? 'text-brand-chalk' : 'text-brand-smoke hover:text-brand-chalk',
              )}
            >
              {item.label}
              <span
                className={cn(
                  'absolute -bottom-2 left-0 h-px bg-brand-blood transition-all duration-300 ease-hut',
                  isActive(item.href) ? 'w-full' : 'w-0',
                )}
                aria-hidden="true"
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={telLink()}
            className="hidden items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-brand-smoke transition-colors hover:text-brand-chalk xl:flex"
          >
            <Phone className="size-3.5" aria-hidden="true" />
            {siteConfig.contact.phoneDisplay}
          </a>

          <Button asChild variant="bullion" size="sm" className="hidden sm:inline-flex">
            <Link href="/membership">Join now</Link>
          </Button>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="glass" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent title="Site menu" className="overflow-y-auto">
              <Logo />

              <nav aria-label="All pages" className="flex flex-col">
                {mainNav.map((item, index) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                      className={cn(
                        'group flex items-baseline gap-4 border-b border-brand-chalk/8 py-3 transition-colors',
                        isActive(item.href) ? 'text-brand-bullion' : 'text-brand-chalk hover:text-brand-bullion',
                      )}
                    >
                      <span className="font-mono text-[0.625rem] text-brand-smoke">{ordinal(index + 1)}</span>
                      <span className="font-display text-xl uppercase tracking-wide">{item.label}</span>
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-4">
                <Badge variant="open">Open 24 × 7</Badge>
                <ul className="flex flex-col gap-3">
                  {branches.map((branch) => (
                    <li key={branch.slug} className="text-sm">
                      <p className="font-display text-base uppercase text-brand-chalk">{branch.shortName}</p>
                      <a
                        href={directionsUrl(branch)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-brand-smoke hover:text-brand-bullion"
                      >
                        Get directions →
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3">
                  <Button asChild variant="forge" size="sm" className="flex-1">
                    <a href={telLink()}>Call</a>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
