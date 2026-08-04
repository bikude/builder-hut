import Link from 'next/link';
import { Check } from 'lucide-react';

import { Reveal } from '@/components/common/reveal';
import { SectionHeading } from '@/components/common/section-heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatInr, plans, pricePerMonth, PRICING_CONFIRMED, savingsPercent } from '@/content/membership';
import { cn } from '@/lib/utils';

/**
 * Plan grid.
 *
 * While `PRICING_CONFIRMED` is false in src/content/membership.ts, a single line under
 * the grid tells visitors to confirm the current rate by phone. Flip the flag once the
 * real numbers are in and the line disappears — no component edit needed.
 */
export function MembershipPreview() {
  return (
    <section id="membership" className="relative py-20 lg:py-28">
      <div className="container flex flex-col gap-12">
        <SectionHeading
          align="center"
          eyebrow="Membership"
          title={
            <>
              One card. <span className="text-gold">Three floors.</span> Every hour.
            </>
          }
          lede="Quarterly and longer memberships work at all three branches. No joining fee, no lock-in beyond the term you choose."
        />

        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan, index) => {
            const savings = savingsPercent(plan);
            return (
              <Reveal as="li" key={plan.slug} delay={0.06 * index} className="h-full">
                <article
                  id={plan.slug}
                  className={cn(
                    'relative flex h-full flex-col gap-6 rounded-lg p-7 transition-transform duration-500 ease-hut hover:-translate-y-1',
                    plan.featured
                      ? 'border border-brand-bullion/45 bg-brand-forge shadow-glow-gold'
                      : 'glass',
                  )}
                >
                  {plan.featured && (
                    <span className="absolute -top-3 left-7">
                      <Badge variant="bullion">Most renewed</Badge>
                    </span>
                  )}

                  <div className="flex flex-col gap-1">
                    <h3 className="font-display text-2xl uppercase tracking-tight text-brand-chalk">{plan.name}</h3>
                    <p className="text-sm leading-relaxed text-brand-smoke">{plan.positioning}</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="flex items-baseline gap-2">
                      <span className="font-display text-4xl leading-none text-brand-chalk">{formatInr(plan.price)}</span>
                      {plan.strikePrice && (
                        <span className="font-mono text-xs text-brand-smoke line-through">
                          {formatInr(plan.strikePrice)}
                        </span>
                      )}
                    </p>
                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-brand-bullion">
                      {formatInr(pricePerMonth(plan))} / month
                      {savings ? ` · save ${savings}%` : ''}
                    </p>
                  </div>

                  <ul className="flex flex-1 flex-col gap-2.5">
                    {plan.perks.map((perk) => (
                      <li key={perk} className="flex gap-2.5 text-sm leading-relaxed text-brand-smoke">
                        <Check className="mt-0.5 size-4 shrink-0 text-brand-blood" aria-hidden="true" />
                        {perk}
                      </li>
                    ))}
                  </ul>

                  <Button asChild variant={plan.featured ? 'bullion' : 'outline'} size="md" className="w-full">
                    <Link href={`/membership#${plan.slug}`}>Choose {plan.name.toLowerCase()}</Link>
                  </Button>
                </article>
              </Reveal>
            );
          })}
        </ul>

        {!PRICING_CONFIRMED && (
          <Reveal>
            <p className="text-center font-mono text-[0.625rem] uppercase tracking-[0.16em] text-brand-smoke">
              Offers change through the year — call the branch to confirm today's rate.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
