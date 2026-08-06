import Link from 'next/link';
import { Instagram, MapPin, MessageCircle, Phone } from 'lucide-react';

import { Parallax } from '@/components/common/parallax';
import { Reveal } from '@/components/common/reveal';
import { Button } from '@/components/ui/button';
import { siteConfig, telLink, whatsappLink } from '@/lib/site';

/**
 * General contact.
 *
 * The one section at the bottom of the homepage that is not a branch — call, WhatsApp,
 * a map of all three huts, and the brand's Instagram. Anything branch-specific (its own
 * number, its own Instagram, its own address) lives on that branch's own page instead.
 */
export function CtaBand() {
  return (
    <section className="relative isolate overflow-hidden">
      <Parallax className="absolute inset-0 -z-10" distance={60}>
        <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(225,27,34,0.35),transparent_55%),radial-gradient(circle_at_75%_75%,rgba(201,162,39,0.28),transparent_50%)] bg-brand-ink" />
      </Parallax>
      <div className="grain absolute inset-0 -z-10" aria-hidden="true" />

      <div className="container flex flex-col items-center gap-8 py-24 text-center lg:py-32">
        <Reveal>
          <p className="font-mono text-eyebrow uppercase text-brand-bullion">First session is free</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="max-w-4xl text-display-md text-balance">
            The floor is open <span className="text-engraved">right now</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12} className="flex flex-wrap justify-center gap-3">
          <Button asChild variant="bullion" size="lg">
            <a href={telLink()}>
              <Phone aria-hidden="true" />
              Call {siteConfig.contact.phoneDisplay}
            </a>
          </Button>
          <Button asChild variant="forge" size="lg">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <MessageCircle aria-hidden="true" />
              WhatsApp
            </a>
          </Button>
          <Button asChild variant="glass" size="lg">
            <Link href="/branches">
              <MapPin aria-hidden="true" />
              Google Maps
            </Link>
          </Button>
          <Button asChild variant="glass" size="lg">
            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer">
              <Instagram aria-hidden="true" />
              Instagram
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
