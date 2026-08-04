import type { Metadata } from 'next';
import Link from 'next/link';

import { Marquee } from '@/components/common/marquee';
import { PageHero } from '@/components/common/page-hero';
import { Parallax } from '@/components/common/parallax';
import { Reveal } from '@/components/common/reveal';
import { SectionHeading } from '@/components/common/section-heading';
import { Button } from '@/components/ui/button';
import { branches, totalReviews } from '@/content/branches';
import { resultsPrinciples } from '@/content/programme';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { breadcrumbSchema, graph } from '@/lib/structured-data';

export const metadata: Metadata = buildMetadata({
  title: 'About A Builder Hut',
  description:
    'How a single 24-hour gym in Batanagar became three branches across Maheshtala and Budge Budge — and what A Builder Hut trains for.',
  path: '/about',
});

/** Real chronology, so a numbered sequence carries information rather than decorating. */
const TIMELINE = branches
  .slice()
  .sort((a, b) => a.index - b.index)
  .map((branch) => ({
    step: String(branch.index).padStart(2, '0'),
    year: branch.openedYear,
    name: branch.name,
    place: branch.locality,
    line: branch.tagline,
    highlights: branch.highlights.slice(0, 3),
    href: `/branches/${branch.slug}`,
  }));

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            graph(
              breadcrumbSchema([
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
              ]),
            ),
          ),
        }}
      />

      <PageHero
        eyebrow="About"
        title="Building strength, crafting wellness"
        lede={`${siteConfig.promise} What started as one air-conditioned floor on the Budge Budge Trunk Road is now three branches, open every hour of every day, across Maheshtala and Budge Budge.`}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
        aside={
          <dl className="glass grid grid-cols-2 gap-6 rounded-lg p-6">
            <div>
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">Training since</dt>
              <dd className="mt-1 font-display text-3xl tabular-nums text-brand-chalk">{siteConfig.founded}</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">Google reviews</dt>
              <dd className="mt-1 font-display text-3xl tabular-nums text-brand-chalk">{totalReviews}+</dd>
            </div>
          </dl>
        }
      />

      <section id="story" className="border-b border-brand-chalk/8 py-24 sm:py-32">
        <div className="container grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <SectionHeading eyebrow="The idea" title={<>A gym that <span className="text-engraved">never closes</span></>} />
            <div className="mt-8 flex flex-col gap-5 text-lg leading-relaxed text-brand-chalk/80">
              <p>
                Maheshtala and Budge Budge run on shift work. People finish at ten, at midnight, at four in the
                morning. Every gym in the area closed before most of them got home, and the ones that did not were
                across the river.
              </p>
              <p>
                So the first hut opened on the Budge Budge Trunk Road near Jagtala and simply did not close. Air
                conditioning through the summer, staff on the floor at every hour, and equipment maintained rather
                than merely present. That single decision — the doors stay open — is still what the whole business
                is built on.
              </p>
              <p>
                Two more branches followed. The club at Chandannagar added a combat zone, a spa, a cafeteria and a
                lounge. 3.0 at Shyampur opened the format up for Budge Budge, deliberately set up as a space where
                members training alone in the early morning are comfortable.
              </p>
            </div>
          </div>

          <Parallax className="lg:pt-10">
            <div className="flex flex-col gap-4">
              {resultsPrinciples.map((principle, index) => (
                <Reveal key={principle.title} delay={index * 0.08}>
                  <article className="glass rounded-lg p-7">
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.24em] text-brand-bullion">
                      Principle {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-3 font-display text-xl uppercase tracking-tight">{principle.title}</h3>
                    <p className="mt-3 leading-relaxed text-brand-smoke">{principle.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </Parallax>
        </div>
      </section>

      <Marquee items={['Est. 2022', 'Three branches', 'Open 24 × 7', 'Fully air-conditioned', 'Certified trainers', 'Interconnected membership']} />

      <section id="timeline" className="border-y border-brand-chalk/8 py-24 sm:py-32">
        <div className="container">
          <SectionHeading
            eyebrow="How it grew"
            title={<>Three huts, <span className="text-engraved">in order</span></>}
            lede="Each branch was built to solve something the last one could not."
          />

          <ol className="mt-16 flex flex-col">
            {TIMELINE.map((entry, index) => (
              <Reveal as="li" key={entry.name} delay={index * 0.08}>
                <div className="grid gap-6 border-t border-brand-chalk/10 py-10 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-10">
                  <div className="flex items-baseline gap-4 sm:flex-col sm:gap-1">
                    <span className="font-display text-5xl leading-none text-brand-chalk/12">{entry.step}</span>
                    {entry.year !== null && (
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-bullion">
                        {entry.year}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display text-2xl uppercase tracking-tight sm:text-3xl">{entry.name}</h3>
                    <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">
                      {entry.place}
                    </p>
                    <p className="mt-4 max-w-xl leading-relaxed text-brand-chalk/75">{entry.line}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {entry.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="rounded-full border border-brand-chalk/12 px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-brand-smoke"
                        >
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="sm:self-center">
                    <Button asChild variant="outline" size="sm">
                      <Link href={entry.href}>Visit branch</Link>
                    </Button>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container">
          <div className="glass clip-slant grain relative overflow-hidden rounded-lg px-8 py-14 sm:px-14 sm:py-20">
            <div className="relative max-w-2xl">
              <SectionHeading
                eyebrow="What we will not do"
                title={<>Honest, <span className="text-engraved">or nothing</span></>}
              />
              <ul className="mt-8 flex flex-col gap-4 text-lg leading-relaxed text-brand-chalk/80">
                <li>We do not publish before-and-after photos we do not have written permission to use.</li>
                <li>We do not promise a number of kilograms in a number of weeks. Bodies do not work to a quote.</li>
                <li>We do not sell supplements you do not need, and diet guidance is never a reason to buy one.</li>
                <li>We do not replace your doctor. If you have a condition, we programme around what they tell you.</li>
              </ul>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button asChild variant="bullion" size="lg">
                  <Link href="/contact#free-trial">Book a free trial</Link>
                </Button>
                <Button asChild variant="glass" size="lg">
                  <Link href="/branches">See the branches</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
