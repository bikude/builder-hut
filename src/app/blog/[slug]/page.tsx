import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';

import { PageHero } from '@/components/common/page-hero';
import { PostBody } from '@/components/blog/post-body';
import { Reveal } from '@/components/common/reveal';
import { Button } from '@/components/ui/button';
import { getPost, posts, sortedPosts } from '@/content/blog';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { breadcrumbSchema, graph } from '@/lib/structured-data';
import { formatDate } from '@/lib/utils';

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return buildMetadata({ title: 'Post not found', description: 'This article does not exist.', path: '/blog' });

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.publishedOn,
    keywords: [post.category.toLowerCase()],
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = sortedPosts.filter((entry) => entry.slug !== post.slug).slice(0, 3);

  const articleSchema = {
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedOn,
    dateModified: post.updatedOn ?? post.publishedOn,
    author: { '@type': 'Organization', name: siteConfig.name },
    publisher: { '@type': 'Organization', name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
    articleSection: post.category,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            graph(
              articleSchema,
              breadcrumbSchema([
                { name: 'Home', path: '/' },
                { name: 'Blog', path: '/blog' },
                { name: post.title, path: `/blog/${post.slug}` },
              ]),
            ),
          ),
        }}
      />

      <PageHero
        eyebrow={post.category}
        title={post.title}
        lede={post.excerpt}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.category }]}
        aside={
          <dl className="glass flex flex-col gap-3 rounded-lg p-6">
            <div>
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">Published</dt>
              <dd className="mt-1 text-brand-chalk">{formatDate(post.publishedOn)}</dd>
            </div>
            {post.updatedOn && (
              <div>
                <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">Updated</dt>
                <dd className="mt-1 text-brand-chalk">{formatDate(post.updatedOn)}</dd>
              </div>
            )}
            <div>
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">Reading time</dt>
              <dd className="mt-1 flex items-center gap-2 text-brand-chalk">
                <Clock className="size-3.5" aria-hidden="true" />
                {post.readingMinutes} minutes
              </dd>
            </div>
          </dl>
        }
      />

      <article className="border-b border-brand-chalk/8 py-20 sm:py-28">
        <div className="container max-w-3xl">
          <PostBody blocks={post.body} />

          <div className="mt-16 flex flex-wrap gap-3 border-t border-brand-chalk/10 pt-10">
            <Button asChild variant="bullion" size="lg">
              <Link href="/contact#free-trial">Book a free trial</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/blog">
                <ArrowLeft aria-hidden="true" />
                All posts
              </Link>
            </Button>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="py-24 sm:py-32">
          <div className="container">
            <h2 className="font-mono text-[0.625rem] uppercase tracking-[0.24em] text-brand-bullion">Read next</h2>
            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {related.map((entry, index) => (
                <Reveal as="li" key={entry.slug} delay={index * 0.07}>
                  <Link
                    href={`/blog/${entry.slug}`}
                    className="glass group flex h-full flex-col gap-3 rounded-lg p-6 transition-colors hover:border-brand-bullion/40"
                  >
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-bullion">
                      {entry.category}
                    </span>
                    <h3 className="font-display text-lg uppercase leading-tight tracking-tight transition-colors group-hover:text-brand-gilt">
                      {entry.title}
                    </h3>
                    <p className="mt-auto pt-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-brand-smoke">
                      {entry.readingMinutes} min read
                    </p>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
