import Link from 'next/link';

import { Parallax } from '@/components/common/parallax';
import { Reveal } from '@/components/common/reveal';
import { Button } from '@/components/ui/button';
import { siteConfig, telLink, whatsappLink } from '@/lib/site';

/** Closing call to action. The trial is the offer that converts, so it leads. */
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
        <Reveal delay={0.12}>
          <p className="max-w-xl text-base leading-relaxed text-brand-chalk/75">
            Book a free trial, walk in for a tour, or just call. {siteConfig.contact.hours} — someone will pick up.
          </p>
        </Reveal>
        <Reveal delay={0.18} className="flex flex-wrap justify-center gap-3">
          <Button asChild variant="bullion" size="lg">
            <Link href="/contact#free-trial">Book free trial</Link>
          </Button>
          <Button asChild variant="forge" size="lg">
            <a href={telLink()}>Call {siteConfig.contact.phoneDisplay}</a>
          </Button>
          <Button asChild variant="glass" size="lg">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
