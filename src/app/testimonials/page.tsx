import type { Metadata } from 'next';
import Link from 'next/link';
import { Info, Quote, Star } from 'lucide-react';

import { PageHero } from '@/components/common/page-hero';
import { Reveal } from '@/components/common/reveal';
import { SectionHeading } from '@/components/common/section-heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { averageRating, branches, listingUrl, totalReviews } from '@/content/branches';
import { hasRealTestimonials, testimonials } from '@/content/testimonials';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, graph } from '@/lib/structured-data';

export const metadata: Metadata = buildMetadata({
  title: 'Testimonials',
  description: `A Builder Hut is rated ${averageRating.toFixed(1)} across ${totalReviews}+ Google reviews at three branches in Maheshtala and Budge Budge. Read what members say.`,
  path: '/testimonials',
});

const branchName = (slug: string) => branches.find((branch) => branch.slug === slug)?.shortName ?? slug;

export default function TestimonialsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            graph(
              breadcrumbSchema([
                { name: 'Home', path: '/' },
                { name: 'Testimonials', path: '/testimonials' },
              ]),
            ),
          ),
        }}
      />

      <PageHero
        eyebrow="Testimonials"
        title={`${averageRating.toFixed(1)} across ${totalReviews}+ reviews`}
        lede="The aggregate rating is real and comes straight from the three Google Business Profiles. The quotes below are illustrative until members send us their own words."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Testimonials' }]}
        aside={
          <div className="glass flex flex-col gap-3 rounded-lg p-6">
            <div className="flex items-center gap-1 text-brand-bullion" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-4 fill-current" />
              ))}
            </div>
            <p className="font-display text-4xl tabular-nums text-brand-chalk">{averageRating.toFixed(1)}</p>
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">
              {totalReviews}+ Google reviews
            </p>
          </div>
        }
      />

      {!hasRealTestimonials && (
        <div className="border-b border-brand-bullion/25 bg-brand-bullion/8">
          <div className="container flex items-start gap-3 py-4">
            <Info className="mt-0.5 size-4 shrink-0 text-brand-gilt" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-brand-chalk/85">
              Google reviews are the reviewers’ own words and Google’s terms do not permit republishing them here, so
              each quote below is an illustrative example. Read the genuine reviews on the branch listings, linked at
              the bottom of this page.
            </p>
          </div>
        </div>
      )}

      <section id="quotes" className="border-b border-brand-chalk/8 py-24 sm:py-32">
        <div className="container">
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Reveal as="li" key={testimonial.id} delay={(index % 3) * 0.07}>
                <figure className="glass flex h-full flex-col gap-5 rounded-lg p-7">
                  <div className="flex items-start justify-between gap-4">
                    <Quote className="size-7 text-brand-blood" aria-hidden="true" />
                    {testimonial.isExample && <Badge>Example</Badge>}
                  </div>

                  <div className="flex items-center gap-1 text-brand-bullion" aria-label={`${testimonial.rating} out of 5`}>
                    {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                      <Star key={starIndex} className="size-3.5 fill-current" aria-hidden="true" />
                    ))}
                  </div>

                  <blockquote className="leading-relaxed text-brand-chalk/85">“{testimonial.quote}”</blockquote>

                  <figcaption className="mt-auto border-t border-brand-chalk/10 pt-5">
                    <p className="font-display text-base uppercase tracking-tight text-brand-chalk">
                      {testimonial.name}
                    </p>
                    <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-brand-smoke">
                      {testimonial.role} · {branchName(testimonial.branchSlug)}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container">
          <SectionHeading
            eyebrow="Read the real thing"
            title={<>Straight from <span className="text-engraved">Google</span></>}
            lede="Every branch listing carries its own reviews, unedited and unfiltered by us."
          />

          <ul className="mt-14 grid gap-4 md:grid-cols-3">
            {branches.map((branch) => (
              <li key={branch.slug} className="glass flex flex-col gap-3 rounded-lg p-6">
                <p className="font-display text-lg uppercase tracking-tight">{branch.name}</p>
                {branch.rating !== null && (
                  <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-brand-bullion">
                    {branch.rating.toFixed(1)} ★ · {branch.reviewCount}+ reviews
                  </p>
                )}
                <Button asChild variant="outline" size="sm" className="mt-auto">
                  <a href={listingUrl(branch)} target="_blank" rel="noopener noreferrer">
                    Open on Google
                  </a>
                </Button>
              </li>
            ))}
          </ul>

          <div className="mt-14">
            <Button asChild variant="bullion" size="lg">
              <Link href="/contact">Leave your own feedback</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
