'use client';

import Image from 'next/image';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, MapPin } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { RatingStars } from '@/components/common/rating-stars';
import { Button } from '@/components/ui/button';
import { averageRating, branches, totalReviews } from '@/content/branches';
import { useBranchClock } from '@/hooks/use-branch-clock';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { EASE, maskUp } from '@/lib/motion';
import { cn } from '@/lib/utils';

const HEADLINE = ['Build your', 'strongest', 'self'];

/**
 * Opening frame.
 *
 * The thesis is the thing no competitor in Maheshtala can match: the floor is open
 * right now, whatever time "now" is. So the hero states the live Kolkata clock and the
 * doors-open status before it says anything about equipment or price.
 *
 * Slides run on Embla with an autoplay plugin that is not attached at all when the
 * visitor prefers reduced motion. To use footage instead of stills, drop an mp4 at
 * `public/videos/hero.mp4` and follow README → "Swapping the hero for video".
 */
export function Hero() {
  const prefersReduced = usePrefersReducedMotion();
  const clock = useBranchClock();
  const containerRef = useRef<HTMLElement>(null);

  const plugins = useMemo(
    () => (prefersReduced ? [] : [Autoplay({ delay: 5500, stopOnInteraction: false, stopOnMouseEnter: false })]),
    [prefersReduced],
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 34, align: 'start' }, plugins);
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect).on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect).off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const layerY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '38%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden" aria-label="A Builder Hut — premium 24x7 gym in Maheshtala">
      {/* Slider layer */}
      <motion.div className="absolute inset-0" style={prefersReduced ? undefined : { y: layerY }}>
        <div className="h-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {branches.map((branch, index) => (
              <div className="relative h-full min-w-0 flex-[0_0_100%]" key={branch.slug}>
                <Image
                  src={branch.image}
                  alt={branch.imageAlt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className={cn(
                    'object-cover',
                    !prefersReduced && selected === index && 'origin-center scale-105 transition-transform [transition-duration:7000ms] ease-linear',
                  )}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-brand-ink/55" aria-hidden="true" />
        <div className="absolute inset-0 bg-plate-fade" aria-hidden="true" />
        <div className="grain absolute inset-0" aria-hidden="true" />
      </motion.div>

      {/* Copy layer */}
      <motion.div
        className="container relative flex h-full flex-col justify-end pb-32 pt-24 sm:pb-36"
        style={prefersReduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          className="mb-6 flex flex-wrap items-center gap-3 font-mono text-[0.625rem] uppercase tracking-[0.28em] text-brand-smoke"
        >
          <span className="flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-emerald-300">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
            </span>
            Open now
          </span>
          <span className="tabular-nums text-brand-chalk" suppressHydrationWarning>
            {clock.ready ? `${clock.time} IST` : '24 × 7'}
          </span>
          <span aria-hidden="true">·</span>
          <span>{clock.ready ? `Someone is training right now, ${clock.period}` : 'Doors never close'}</span>
        </motion.p>

        <h1 className="max-w-5xl text-display-lg">
          {HEADLINE.map((line, index) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                custom={index}
                variants={prefersReduced ? undefined : maskUp}
                initial={prefersReduced ? undefined : 'hidden'}
                animate={prefersReduced ? undefined : 'show'}
              >
                {index === 1 ? <span className="text-engraved">{line}</span> : line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
          className="mt-7 max-w-xl text-lg leading-relaxed text-brand-chalk/80"
        >
          Premium fitness experience in Maheshtala. Three air-conditioned floors, 65+ stations, certified
          trainers — open every hour of every day.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.62 }}
          className="mt-9 flex flex-wrap gap-3"
        >
          <Button asChild variant="bullion" size="lg">
            <Link href="/membership">Join now</Link>
          </Button>
          <Button asChild variant="forge" size="lg">
            <Link href="/contact#free-trial">Book free trial</Link>
          </Button>
          <Button asChild variant="glass" size="lg">
            <Link href="/branches">View branches</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Status rail */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="container">
          <div className="glass flex flex-col gap-4 rounded-t-lg px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="size-4 shrink-0 text-brand-blood" aria-hidden="true" />
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-brand-smoke">
                Now showing:{' '}
                <span className="text-brand-chalk">{branches[selected]?.name ?? branches[0]?.name}</span>
                {' · '}
                {branches[selected]?.locality ?? branches[0]?.locality}
              </p>
            </div>

            <div className="flex items-center justify-between gap-6">
              <RatingStars rating={averageRating} reviewCount={totalReviews} />
              <div className="flex gap-2" role="tablist" aria-label="Choose a branch to preview">
                {branches.map((branch, index) => (
                  <button
                    key={branch.slug}
                    type="button"
                    role="tab"
                    aria-selected={selected === index}
                    aria-label={`Show ${branch.name}`}
                    onClick={() => emblaApi?.scrollTo(index)}
                    className={cn(
                      'h-1 rounded-full transition-all duration-500 ease-hut',
                      selected === index ? 'w-10 bg-brand-bullion' : 'w-4 bg-brand-chalk/25 hover:bg-brand-chalk/50',
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#why-abh"
        aria-label="Scroll to content"
        className="absolute bottom-28 left-1/2 hidden -translate-x-1/2 text-brand-smoke transition-colors hover:text-brand-bullion lg:block"
      >
        <ArrowDown className="size-5 animate-float" aria-hidden="true" />
      </a>
    </section>
  );
}
