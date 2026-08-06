import Link from 'next/link';
import { Quote } from 'lucide-react';

import { RatingStars } from '@/components/common/rating-stars';
import { Reveal } from '@/components/common/reveal';
import { SectionHeading } from '@/components/common/section-heading';
import { Button } from '@/components/ui/button';
import { averageRating, branches, totalReviews } from '@/content/branches';
import { testimonials } from '@/content/testimonials';

const branchNames = new Map(branches.map((branch) => [branch.slug, branch.shortName]));

/**
 * Member voices.
 *
 * Entries flagged `isExample` render with a visible marker — the site never passes a
 * written-for-the-page quote off as a real member review. The aggregate rating beside
 * the heading is factual and comes from the three Google listings.
 * See src/content/testimonials.ts for how to publish real ones.
 */
export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative bg-brand-forge/40 py-20 lg:py-28">
      <div className="container flex flex-col gap-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Member voices"
            title={
              <>
                Rated <span className="text-gold">{averageRating.toFixed(1)}</span> across {totalReviews} Google reviews
              </>
            }
          />
          <Reveal delay={0.1} className="flex flex-col items-start gap-3 md:items-end">
            <RatingStars rating={averageRating} reviewCount={totalReviews} />
            <Button asChild variant="outline" size="sm">
              <Link href="/testimonials">Read more</Link>
            </Button>
          </Reveal>
        </div>

        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal as="li" key={testimonial.id} delay={0.05 * (index % 3)}>
              <figure className="glass flex h-full flex-col gap-5 rounded-lg p-7">
                <Quote className="size-7 text-brand-blood" aria-hidden="true" />
                <blockquote className="flex-1 text-sm leading-relaxed text-brand-chalk/85">
                  {testimonial.quote}
                </blockquote>
                <figcaption className="flex flex-col gap-2 border-t border-brand-chalk/8 pt-4">
                  <RatingStars rating={testimonial.rating} glyphsOnly />
                  <p className="font-display text-base uppercase tracking-wide text-brand-chalk">{testimonial.name}</p>
                  <p className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-brand-smoke">
                    {testimonial.role} · {branchNames.get(testimonial.branchSlug) ?? 'A Builder Hut'}
                    {testimonial.isExample && <span className="text-brand-bullion"> · Example</span>}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
