import type { MetadataRoute } from 'next';

import { posts } from '@/content/blog';
import { branches } from '@/content/branches';
import { mainNav, siteConfig } from '@/lib/site';

/**
 * Generated at build time and served at /sitemap.xml.
 * Routes come from the same nav array the header renders, so a new page is listed the
 * moment it is added to `mainNav` — no second list to keep in sync.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = mainNav.map((item) => ({
    url: `${siteConfig.url}${item.href === '/' ? '' : item.href}`,
    lastModified: now,
    changeFrequency: (item.href === '/' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
    priority: item.href === '/' ? 1 : item.href === '/membership' || item.href === '/branches' ? 0.9 : 0.7,
  }));

  const branchPages = branches.map((branch) => ({
    url: `${siteConfig.url}/branches/${branch.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const postPages = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.updatedOn ?? post.publishedOn),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  return [...pages, ...branchPages, ...postPages];
}
