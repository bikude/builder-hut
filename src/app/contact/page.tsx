import type { Metadata } from 'next';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

import { BranchMapLoader } from '@/components/branches/branch-map-loader';
import { PageHero } from '@/components/common/page-hero';
import { Reveal } from '@/components/common/reveal';
import { SectionHeading } from '@/components/common/section-heading';
import { EnquiryForm } from '@/components/forms/enquiry-form';
import { Button } from '@/components/ui/button';
import { branches, directionsUrl, formatAddress } from '@/content/branches';
import { buildMetadata } from '@/lib/seo';
import { siteConfig, telLink, whatsappLink } from '@/lib/site';
import { breadcrumbSchema, graph } from '@/lib/structured-data';

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description:
    'Call, WhatsApp or send an enquiry to A Builder Hut. Three branches across Maheshtala and Budge Budge, open 24 hours a day, every day.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            graph(
              breadcrumbSchema([
                { name: 'Home', path: '/' },
                { name: 'Contact', path: '/contact' },
              ]),
            ),
          ),
        }}
      />

      <PageHero
        eyebrow="Contact"
        title="Come in tonight"
        lede="Every branch is open right now. Call, message, or send the form below and a trainer will call you back."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
        aside={
          <div className="glass flex flex-col gap-3 rounded-lg p-6">
            <span className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-emerald-300">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
              </span>
              Open now
            </span>
            <p className="font-display text-2xl uppercase tracking-tight">24 × 7</p>
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-brand-smoke">
              Every day of the year
            </p>
          </div>
        }
      />

      <section className="border-b border-brand-chalk/8 py-16 sm:py-20">
        <div className="container grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              icon: Phone,
              label: 'Call',
              value: siteConfig.contact.phoneDisplay,
              href: telLink(),
              external: false,
            },
            {
              icon: MessageCircle,
              label: 'WhatsApp',
              value: siteConfig.contact.phoneDisplay,
              href: whatsappLink(),
              external: true,
            },
            {
              icon: Mail,
              label: 'Email',
              value: siteConfig.contact.email,
              href: `mailto:${siteConfig.contact.email}`,
              external: false,
            },
            {
              icon: Clock,
              label: 'Hours',
              value: 'Open 24 hours',
              href: null,
              external: false,
            },
          ].map((entry, index) => (
            <Reveal key={entry.label} delay={index * 0.06}>
              <div className="glass flex h-full flex-col gap-3 rounded-lg p-6">
                <entry.icon className="size-5 text-brand-blood" aria-hidden="true" />
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">{entry.label}</p>
                {entry.href ? (
                  <a
                    href={entry.href}
                    {...(entry.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="break-words font-display text-lg uppercase tracking-tight text-brand-chalk transition-colors hover:text-brand-gilt"
                  >
                    {entry.value}
                  </a>
                ) : (
                  <p className="font-display text-lg uppercase tracking-tight text-brand-chalk">{entry.value}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="free-trial" className="border-b border-brand-chalk/8 py-24 sm:py-32">
        <div className="container grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Free trial"
              title={<>Send it, and <span className="text-engraved">we will call</span></>}
              lede="Tell us the branch, the hours that suit you and what you want to work on. No card, no commitment, and nothing sold to you before you have seen the floor."
            />

            <ul className="mt-10 flex flex-col gap-4 text-brand-chalk/75">
              <li className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-bullion" aria-hidden="true" />
                A trainer walks you through the floor and the equipment.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-bullion" aria-hidden="true" />
                You get a fitness assessment and an induction workout.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-bullion" aria-hidden="true" />
                Then you decide. Prices are discussed after, not before.
              </li>
            </ul>
          </div>

          <EnquiryForm defaultIntent="free-trial" />
        </div>
      </section>

      <section id="where" className="py-24 sm:py-32">
        <div className="container">
          <SectionHeading
            eyebrow="Where we are"
            title={<>Three addresses, <span className="text-engraved">one number</span></>}
          />

          <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
            <ul className="flex flex-col gap-4">
              {branches.map((branch) => (
                <li key={branch.slug} className="glass flex flex-col gap-4 rounded-lg p-6">
                  <div>
                    <p className="font-display text-xl uppercase tracking-tight">{branch.name}</p>
                    <address className="mt-2 flex items-start gap-3 not-italic text-sm leading-relaxed text-brand-chalk/75">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-brand-blood" aria-hidden="true" />
                      {formatAddress(branch)}
                    </address>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="forge">
                      <a href={telLink(branch.phone)}>
                        <Phone aria-hidden="true" />
                        {branch.phoneDisplay}
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="glass">
                      <a href={directionsUrl(branch)} target="_blank" rel="noopener noreferrer">
                        Directions
                      </a>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <BranchMapLoader className="h-full min-h-[26rem]" />
          </div>
        </div>
      </section>
    </>
  );
}
