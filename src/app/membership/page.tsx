import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Phone } from 'lucide-react';

import { PageHero } from '@/components/common/page-hero';
import { Reveal } from '@/components/common/reveal';
import { SectionHeading } from '@/components/common/section-heading';
import { FaqList } from '@/components/common/faq-list';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { branches } from '@/content/branches';
import { plans } from '@/content/membership';
import { buildMetadata } from '@/lib/seo';
import { siteConfig, telLink, whatsappLink } from '@/lib/site';
import { breadcrumbSchema, graph, membershipServiceSchema } from '@/lib/structured-data';
import { cn } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'Membership',
  description:
    'Monthly, quarterly, half-yearly and yearly membership at A Builder Hut. One membership, three branches across Maheshtala and Budge Budge, open 24 hours.',
  path: '/membership',
  keywords: ['gym membership Maheshtala', 'gym fees Budge Budge', 'gym price Batanagar'],
});

export default function MembershipPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            graph(
              membershipServiceSchema(),
              breadcrumbSchema([
                { name: 'Home', path: '/' },
                { name: 'Membership', path: '/membership' },
              ]),
            ),
          ),
        }}
      />

      <PageHero
        eyebrow="Membership"
        title="One membership, three huts"
        lede="Quarterly and above train at any branch. Work near Maheshtala, live near Budge Budge — that is one membership covering both ends of your day."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Membership' }]}
        aside={
          <div className="glass flex flex-col gap-3 rounded-lg p-6">
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">
              Prefer to ask a person?
            </span>
            <Button asChild variant="forge" size="sm">
              <a href={telLink()}>
                <Phone aria-hidden="true" />
                {siteConfig.contact.phoneDisplay}
              </a>
            </Button>
          </div>
        }
      />


      <section id="plans" className="border-b border-brand-chalk/8 py-24 sm:py-32">
        <div className="container">
          <SectionHeading
            eyebrow="Plans"
            title={<>Pay by the month, <span className="text-engraved">or by the season</span></>}
            lede="The longer tiers are cheaper per month and add branch access, diet guidance and PT time. Nothing is locked behind an upgrade that should be standard."
          />

          <ul className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan, index) => (
                <Reveal as="li" key={plan.slug} delay={index * 0.07}>
                  <article
                    className={cn(
                      'glass relative flex h-full flex-col gap-6 rounded-lg p-7',
                      plan.featured && 'border-brand-bullion/45 shadow-glow-gold',
                    )}
                  >
                    {plan.featured && (
                      <Badge variant="bullion" className="absolute -top-3 left-7">
                        Most renewed
                      </Badge>
                    )}

                    <div>
                      <h2 className="font-display text-xl uppercase tracking-tight">{plan.name}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-brand-smoke">{plan.positioning}</p>
                    </div>

                    <div>
                      <p className="font-display text-4xl leading-none text-brand-chalk">
                        {plan.months} <span className="text-xl text-brand-smoke">{plan.months === 1 ? 'month' : 'months'}</span>
                      </p>
                      <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-brand-gilt">
                        Call for today's rate
                      </p>
                    </div>

                    <ul className="flex flex-col gap-3">
                      {plan.perks.map((perk) => (
                        <li key={perk} className="flex gap-3 text-sm leading-relaxed text-brand-chalk/80">
                          <Check className="mt-0.5 size-4 shrink-0 text-brand-bullion" aria-hidden="true" />
                          {perk}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-2">
                      <Button
                        asChild
                        variant={plan.featured ? 'bullion' : 'outline'}
                        size="sm"
                        className="w-full"
                      >
                        <a
                          href={whatsappLink(plan.enquiry)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Join on {plan.name}
                        </a>
                      </Button>
                    </div>
                  </article>
                </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-brand-chalk/8 py-24 sm:py-32">
        <div className="container grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Included at every tier"
              title={<>What you get <span className="text-engraved">on day one</span></>}
            />
            <ul className="mt-10 flex flex-col gap-4">
              {[
                'A fitness assessment before you are sold anything',
                'A trainer-led induction so you are not left staring at a machine',
                'Access at every hour, including festival days',
                'Air-conditioned floors, maintained equipment, staffed overnight',
                'Lockers, changing rooms and washrooms',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-lg leading-relaxed text-brand-chalk/80">
                  <Check className="mt-1.5 size-4 shrink-0 text-brand-blood" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading eyebrow="Where it works" title={<>Branch <span className="text-engraved">access</span></>} />
            <ul className="mt-10 flex flex-col gap-4">
              {branches.map((branch) => (
                <li key={branch.slug} className="glass flex items-center justify-between gap-4 rounded-lg p-5">
                  <div className="min-w-0">
                    <p className="font-display text-lg uppercase tracking-tight">{branch.name}</p>
                    <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-brand-smoke">
                      {branch.locality}
                    </p>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/branches/${branch.slug}`}>Details</Link>
                  </Button>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-brand-smoke">
              Monthly members train at their home branch. Quarterly and above are interconnected across all three —
              confirm your tier’s access at reception when you join.
            </p>
          </div>
        </div>
      </section>

      <section id="membership-faq" className="py-24 sm:py-32">
        <div className="container">
          <SectionHeading
            eyebrow="Before you join"
            title={<>Questions we get <span className="text-engraved">every week</span></>}
          />
          <div className="mt-14">
            <FaqList limit={8} />
          </div>
          <p className="mt-8 text-sm text-brand-smoke">
            <Link href="/faq" className="text-brand-bullion underline-offset-4 hover:underline">
              Read every question
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
