import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Clock } from 'lucide-react';

import { PageHero } from '@/components/common/page-hero';
import { Reveal } from '@/components/common/reveal';
import { sortedPosts } from '@/content/blog';
import { buildMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';
import { breadcrumbSchema, graph } from '@/lib/structured-data';

export const metadata: Metadata = buildMetadata({
  title: 'Blog',
  description:
    'Training, nutrition and recovery written for people who actually train in Maheshtala and Budge Budge — shift-work schedules, Bengali-kitchen protein, and surviving a Kolkata summer.',
  path: '/blog',
});

export default function BlogPage() {
  const [lead, ...rest] = sortedPosts;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            graph(
              breadcrumbSchema([
                { name: 'Home', path: '/' },
                { name: 'Blog', path: '/blog' },
              ]),
            ),
          ),
        }}
      />

      <PageHero
        eyebrow="Blog"
        title="Written for this floor"
        lede="No listicles and no promised outcomes. Every post has to be useful to someone who trains here — which usually means it is about shift work, a Bengali kitchen, or the weather."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Blog' }]}
      />

      {lead && (
        <section className="border-b border-brand-chalk/8 py-20 sm:py-24">
          <div className="container">
            <Reveal>
              <Link
                href={`/blog/${lead.slug}`}
                className="glass clip-slant group block overflow-hidden rounded-lg p-8 transition-colors hover:border-brand-bullion/40 sm:p-14"
              >
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.24em] text-brand-bullion">
                  Latest · {lead.category}
                </span>
                <h2 className="mt-5 max-w-3xl text-display-sm text-balance transition-colors group-hover:text-brand-gilt">
                  {lead.title}
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-chalk/75">{lead.excerpt}</p>
                <p className="mt-8 flex flex-wrap items-center gap-4 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">
                  <span>{formatDate(lead.publishedOn)}</span>
                  <span className="flex items-center gap-2">
                    <Clock className="size-3" aria-hidden="true" />
                    {lead.readingMinutes} min read
                  </span>
                  <span className="flex items-center gap-1 text-brand-bullion">
                    Read
                    <ArrowUpRight className="size-3 transition-transform duration-300 ease-hut group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </span>
                </p>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      <section className="py-24 sm:py-32">
        <div className="container">
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {rest.map((post, index) => (
              <Reveal as="li" key={post.slug} delay={(index % 3) * 0.07}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="glass group flex h-full flex-col gap-4 rounded-lg p-7 transition-colors hover:border-brand-bullion/40"
                >
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.24em] text-brand-bullion">
                    {post.category}
                  </span>
                  <h2 className="font-display text-xl uppercase leading-tight tracking-tight transition-colors group-hover:text-brand-gilt">
                    {post.title}
                  </h2>
                  <p className="leading-relaxed text-brand-smoke">{post.excerpt}</p>
                  <p className="mt-auto flex items-center gap-4 pt-3 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-brand-smoke">
                    <span>{formatDate(post.publishedOn)}</span>
                    <span>{post.readingMinutes} min</span>
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
