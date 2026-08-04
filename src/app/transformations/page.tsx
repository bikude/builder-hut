import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Info, ShieldCheck } from 'lucide-react';

import { PageHero } from '@/components/common/page-hero';
import { Reveal } from '@/components/common/reveal';
import { SectionHeading } from '@/components/common/section-heading';
import { Button } from '@/components/ui/button';
import { branches } from '@/content/branches';
import { programme, resultsPrinciples } from '@/content/programme';
import { goalLabels, hasTransformations, transformations } from '@/content/transformations';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, graph } from '@/lib/structured-data';

export const metadata: Metadata = buildMetadata({
  title: 'Transformations',
  description:
    'How members change at A Builder Hut — the measured twelve-week method behind weight loss, muscle gain and strength, and the results members have consented to share.',
  path: '/transformations',
});

const branchName = (slug: string) => branches.find((branch) => branch.slug === slug)?.shortName ?? slug;

export default function TransformationsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            graph(
              breadcrumbSchema([
                { name: 'Home', path: '/' },
                { name: 'Transformations', path: '/transformations' },
              ]),
            ),
          ),
        }}
      />

      <PageHero
        eyebrow="Transformations"
        title="Measured, not promised"
        lede="Bodies do not work to a quote. What we can show you is the method every member is walked through, and — as members agree to share them — their real numbers."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Transformations' }]}
      />

      {hasTransformations ? (
        <section id="members" className="border-b border-brand-chalk/8 py-24 sm:py-32">
          <div className="container">
            <SectionHeading
              eyebrow="Members"
              title={<>Real people, <span className="text-engraved">real numbers</span></>}
              lede="Published with each member’s written permission. Same light, same pose, same distance — and no rounding up."
            />

            <ul className="mt-16 grid gap-6 lg:grid-cols-2">
              {transformations.map((entry, index) => (
                <Reveal as="li" key={entry.slug} delay={index * 0.08}>
                  <article className="glass flex h-full flex-col overflow-hidden rounded-lg">
                    <div className="grid grid-cols-2">
                      {[
                        { src: entry.beforeImage, label: 'Before' },
                        { src: entry.afterImage, label: 'After' },
                      ].map((shot) => (
                        <div key={shot.label} className="relative aspect-[4/5]">
                          <Image
                            src={shot.src}
                            alt={`${entry.name} — ${shot.label.toLowerCase()}`}
                            fill
                            sizes="(max-width: 1024px) 50vw, 25vw"
                            className="object-cover"
                          />
                          <span className="absolute left-3 top-3 rounded-full bg-brand-ink/80 px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-chalk">
                            {shot.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-4 p-7">
                      <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <h2 className="font-display text-2xl uppercase tracking-tight">{entry.headline}</h2>
                        <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-bullion">
                          {goalLabels[entry.goal]} · {entry.durationWeeks} weeks
                        </span>
                      </div>
                      <blockquote className="leading-relaxed text-brand-chalk/80">“{entry.quote}”</blockquote>
                      <p className="mt-auto font-mono text-[0.625rem] uppercase tracking-[0.18em] text-brand-smoke">
                        {entry.name} · {branchName(entry.branchSlug)}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <section className="border-b border-brand-chalk/8 py-20 sm:py-24">
          <div className="container">
            <div className="glass flex flex-col gap-5 rounded-lg p-8 sm:p-10">
              <ShieldCheck className="size-8 text-brand-bullion" aria-hidden="true" />
              <h2 className="font-display text-2xl uppercase tracking-tight sm:text-3xl">
                No before-and-after photos yet — on purpose
              </h2>
              <div className="flex max-w-3xl flex-col gap-4 leading-relaxed text-brand-chalk/80">
                <p>
                  Photographs of a member’s body are personal data. Publishing them without specific written
                  permission is wrong, and under India’s DPDP Act 2023 it is also unlawful. Buying stock “results”
                  photos would be worse: it is a lie about our own gym, and members recognise it immediately.
                </p>
                <p>
                  So this page shows the method instead. As members agree to share their photos and their real
                  numbers, they will appear here — with their consent on record and nothing rounded up.
                </p>
              </div>
              <p className="flex items-start gap-3 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-brand-bullion">
                <Info className="mt-px size-3.5 shrink-0" aria-hidden="true" />
                Owner: add entries to src/content/transformations.ts and this section switches over automatically.
              </p>
            </div>
          </div>
        </section>
      )}

      <section id="method" className="border-b border-brand-chalk/8 py-24 sm:py-32">
        <div className="container">
          <SectionHeading
            eyebrow="The method"
            title={<>Twelve weeks, <span className="text-engraved">four phases</span></>}
            lede="This is what a member is actually walked through — and the reason results here are repeatable rather than lucky."
          />

          <ol className="mt-16 flex flex-col">
            {programme.map((phase, index) => (
              <Reveal as="li" key={phase.weeks} delay={index * 0.06}>
                <div className="grid gap-6 border-t border-brand-chalk/10 py-10 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-12">
                  <div>
                    <span className="font-display text-5xl leading-none text-brand-chalk/12">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-bullion">
                      {phase.weeks}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl uppercase tracking-tight sm:text-3xl">{phase.title}</h3>
                    <p className="mt-3 max-w-2xl leading-relaxed text-brand-chalk/75">{phase.detail}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container">
          <div className="grid gap-5 md:grid-cols-3">
            {resultsPrinciples.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 0.08}>
                <article className="glass flex h-full flex-col gap-3 rounded-lg p-7">
                  <h2 className="font-display text-xl uppercase tracking-tight">{principle.title}</h2>
                  <p className="leading-relaxed text-brand-smoke">{principle.body}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 flex flex-wrap gap-3">
            <Button asChild variant="bullion" size="lg">
              <Link href="/personal-training">See personal training</Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link href="/contact#free-trial">Book free trial</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
