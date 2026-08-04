import Link from 'next/link';

import { Reveal } from '@/components/common/reveal';
import { SectionHeading } from '@/components/common/section-heading';
import { Button } from '@/components/ui/button';
import { programme, resultsPrinciples } from '@/content/programme';
import { ordinal } from '@/lib/utils';

/**
 * The 12-week arc.
 *
 * Numbered markers are used here because the content genuinely is a sequence — week 1
 * has to happen before week 7. They are not decoration, and they are not repeated on
 * sections where the order carries no meaning.
 */
export function ProgrammeTimeline() {
  return (
    <section id="results" className="relative py-20 lg:py-28">
      <div className="container flex flex-col gap-14">
        <SectionHeading
          eyebrow="Twelve weeks"
          title={
            <>
              What actually happens after you <span className="text-gold">walk in</span>
            </>
          }
          lede="No promises about someone else's body. This is the programme every new member is taken through, and the points where progress gets measured instead of assumed."
        />

        <ol className="grid gap-px overflow-hidden rounded-lg border border-brand-chalk/8 md:grid-cols-2 xl:grid-cols-4">
          {programme.map((phase, index) => (
            <Reveal as="li" key={phase.weeks} delay={0.06 * index}>
              <article className="flex h-full flex-col gap-4 border-b border-r border-brand-chalk/8 bg-brand-forge/40 p-7 transition-colors duration-500 hover:bg-brand-forge">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-5xl leading-none text-brand-chalk/12">{ordinal(index + 1)}</span>
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-bullion">
                    {phase.weeks}
                  </span>
                </div>
                <h3 className="font-display text-xl uppercase tracking-wide text-brand-chalk">{phase.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-brand-chalk/80">{phase.focus}</p>
                <p className="text-sm leading-relaxed text-brand-smoke">{phase.detail}</p>
                <ul className="mt-auto flex flex-col gap-1.5 pt-2">
                  {phase.markers.map((marker) => (
                    <li key={marker} className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-brand-smoke">
                      <span className="size-1 rounded-full bg-brand-blood" aria-hidden="true" />
                      {marker}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </ol>

        <div className="grid gap-8 md:grid-cols-3">
          {resultsPrinciples.map((principle, index) => (
            <Reveal key={principle.title} delay={0.06 * index} className="flex flex-col gap-2">
              <h3 className="font-display text-lg uppercase tracking-wide text-brand-bullion">{principle.title}</h3>
              <p className="text-sm leading-relaxed text-brand-smoke">{principle.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="flex flex-wrap gap-3">
          <Button asChild variant="forge" size="md">
            <Link href="/personal-training">See personal training</Link>
          </Button>
          <Button asChild variant="ghost" size="md">
            <Link href="/bmi-calculator">Check your BMI first</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
