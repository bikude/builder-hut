import type { Metadata } from 'next';
import { Check, Info } from 'lucide-react';

import { PageHero } from '@/components/common/page-hero';
import { Reveal } from '@/components/common/reveal';
import { SectionHeading } from '@/components/common/section-heading';
import { EnquiryForm } from '@/components/forms/enquiry-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { branches } from '@/content/branches';
import { PRICING_CONFIRMED, formatInr, ptPackages } from '@/content/membership';
import { programme } from '@/content/programme';
import { trainers, trainersAreRolesOnly } from '@/content/trainers';
import { buildMetadata } from '@/lib/seo';
import { whatsappLink } from '@/lib/site';
import { breadcrumbSchema, graph } from '@/lib/structured-data';

export const metadata: Metadata = buildMetadata({
  title: 'Personal Training',
  description:
    'One-to-one coaching at A Builder Hut: movement screen, a programme written for your body and schedule, macro-matched diet guidance and measured progress. Available at all three branches.',
  path: '/personal-training',
  keywords: ['personal trainer Maheshtala', 'personal training Budge Budge', 'fitness coach Batanagar'],
});

const branchName = (slug: string) => branches.find((branch) => branch.slug === slug)?.shortName ?? slug;

export default function PersonalTrainingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            graph(
              breadcrumbSchema([
                { name: 'Home', path: '/' },
                { name: 'Personal Training', path: '/personal-training' },
              ]),
            ),
          ),
        }}
      />

      <PageHero
        eyebrow="Personal training"
        title="Coached, not supervised"
        lede="A trainer who corrects your technique on the floor, writes the programme around your week, and re-tests whether it worked. Beginners get the most attention here — deliberately."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Personal Training' }]}
      />

      <section id="method" className="border-b border-brand-chalk/8 py-24 sm:py-32">
        <div className="container">
          <SectionHeading
            eyebrow="The twelve-week arc"
            title={<>What actually <span className="text-engraved">happens</span></>}
            lede="Four phases. Each one has a job, and each one ends with something measured rather than something felt."
          />

          <ol className="mt-16 grid gap-5 md:grid-cols-2">
            {programme.map((phase, index) => (
              <Reveal as="li" key={phase.weeks} delay={index * 0.07}>
                <article className="glass flex h-full flex-col gap-4 rounded-lg p-7">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.24em] text-brand-bullion">
                      {phase.weeks}
                    </span>
                    <span className="font-display text-4xl leading-none text-brand-chalk/12">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl uppercase tracking-tight">{phase.title}</h2>
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-brand-blood">{phase.focus}</p>
                  <p className="leading-relaxed text-brand-chalk/75">{phase.detail}</p>
                  <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                    {phase.markers.map((marker) => (
                      <li
                        key={marker}
                        className="rounded-full border border-brand-chalk/12 px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-brand-smoke"
                      >
                        {marker}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section id="packages" className="border-b border-brand-chalk/8 py-24 sm:py-32">
        <div className="container">
          <SectionHeading
            eyebrow="Packages"
            title={<>Three lengths, <span className="text-engraved">three jobs</span></>}
            lede="Pick by what you are trying to change, not by budget alone. The starter block exists to make you safe under load; the longer blocks exist to make the change stick."
          />

          {!PRICING_CONFIRMED && (
            <p className="mt-8 flex items-start gap-3 rounded-lg border border-brand-bullion/25 bg-brand-bullion/5 p-5 text-sm leading-relaxed text-brand-chalk/80">
              <Info className="mt-0.5 size-4 shrink-0 text-brand-gilt" aria-hidden="true" />
              Package rates are indicative and vary with trainer availability. Confirm the current price at reception
              or on WhatsApp before you plan around it.
            </p>
          )}

          <ul className="mt-14 grid gap-5 lg:grid-cols-3">
            {ptPackages.map((pack, index) => (
              <Reveal as="li" key={pack.slug} delay={index * 0.08}>
                <article className="glass flex h-full flex-col gap-5 rounded-lg p-7">
                  <div>
                    <h2 className="font-display text-2xl uppercase tracking-tight">{pack.name}</h2>
                    <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-brand-bullion">
                      {pack.sessions}
                    </p>
                  </div>
                  <p className="font-display text-3xl tabular-nums text-brand-chalk">{formatInr(pack.price)}</p>
                  <p className="leading-relaxed text-brand-smoke">{pack.summary}</p>
                  <ul className="flex flex-col gap-3">
                    {pack.includes.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-brand-chalk/80">
                        <Check className="mt-0.5 size-4 shrink-0 text-brand-bullion" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-2">
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <a
                        href={whatsappLink(`Hi! I'd like to ask about the ${pack.name} personal training package.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ask about {pack.name}
                      </a>
                    </Button>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="team" className="border-b border-brand-chalk/8 py-24 sm:py-32">
        <div className="container">
          <SectionHeading
            eyebrow="The team"
            title={<>Who you will <span className="text-engraved">work with</span></>}
            lede="Certified trainers across all three branches, with combat coaching at the Chandannagar club."
          />

          {trainersAreRolesOnly && (
            <p className="mt-8 flex items-start gap-3 rounded-lg border border-brand-bullion/25 bg-brand-bullion/5 p-5 text-sm leading-relaxed text-brand-chalk/80">
              <Info className="mt-0.5 size-4 shrink-0 text-brand-gilt" aria-hidden="true" />
              These are coaching roles rather than named individuals. No trainer’s name or photograph is published on
              A Builder Hut’s public pages, and inventing one here would be dishonest — the owner can add the real
              team once each trainer has agreed to appear.
            </p>
          )}

          <ul className="mt-14 grid gap-5 md:grid-cols-2">
            {trainers.map((trainer, index) => (
              <Reveal as="li" key={trainer.slug} delay={index * 0.06}>
                <article className="glass flex h-full flex-col gap-4 rounded-lg p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl uppercase tracking-tight">{trainer.name}</h3>
                      <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-brand-bullion">
                        {trainer.credential}
                      </p>
                    </div>
                    {trainer.isRole && <Badge>Role</Badge>}
                  </div>
                  <p className="leading-relaxed text-brand-chalk/75">{trainer.bio}</p>
                  <ul className="flex flex-wrap gap-2">
                    {trainer.specialisms.map((specialism) => (
                      <li
                        key={specialism}
                        className="rounded-full border border-brand-chalk/12 px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-brand-smoke"
                      >
                        {specialism}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-auto pt-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-brand-smoke">
                    {trainer.branchSlugs.length === branches.length
                      ? 'All three branches'
                      : trainer.branchSlugs.map(branchName).join(', ')}
                  </p>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="enquire" className="py-24 sm:py-32">
        <div className="container grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Start"
              title={<>Book a <span className="text-engraved">free assessment</span></>}
              lede="Tell us your goal and which branch suits your week. A trainer will call you back and book you in — no card, no commitment."
            />
          </div>
          <EnquiryForm defaultIntent="personal-training" />
        </div>
      </section>
    </>
  );
}
