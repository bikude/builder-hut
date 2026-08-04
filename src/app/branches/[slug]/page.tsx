import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Navigation, Phone, Star } from 'lucide-react';

import { BranchMapLoader } from '@/components/branches/branch-map-loader';
import { FacilityIcon } from '@/components/common/facility-icon';
import { PageHero } from '@/components/common/page-hero';
import { Reveal } from '@/components/common/reveal';
import { SectionHeading } from '@/components/common/section-heading';
import { EnquiryForm } from '@/components/forms/enquiry-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { branches, directionsUrl, formatAddress, getBranch, listingUrl } from '@/content/branches';
import { facilitiesForBranch } from '@/content/facilities';
import { trainersForBranch } from '@/content/trainers';
import { buildMetadata } from '@/lib/seo';
import { telLink } from '@/lib/site';
import { branchSchema, breadcrumbSchema, graph } from '@/lib/structured-data';

/** Three branches, known at build time — pre-render all of them. */
export function generateStaticParams() {
  return branches.map((branch) => ({ slug: branch.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const branch = getBranch(slug);
  if (!branch) return buildMetadata({ title: 'Branch not found', description: 'This branch does not exist.', path: '/branches' });

  return buildMetadata({
    title: `${branch.name} — ${branch.shortName}`,
    description: `${branch.name} at ${formatAddress(branch)}. Open 24 hours, fully air-conditioned, certified trainers. ${branch.tagline}`,
    path: `/branches/${branch.slug}`,
    image: branch.image,
    keywords: [`gym in ${branch.shortName}`, `${branch.name}`, `24 hour gym ${branch.locality}`],
  });
}

export default async function BranchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const branch = getBranch(slug);
  if (!branch) notFound();

  const branchFacilities = facilitiesForBranch(branch.slug);
  const branchTrainers = trainersForBranch(branch.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            graph(
              branchSchema(branch),
              breadcrumbSchema([
                { name: 'Home', path: '/' },
                { name: 'Branches', path: '/branches' },
                { name: branch.shortName, path: `/branches/${branch.slug}` },
              ]),
            ),
          ),
        }}
      />

      <PageHero
        eyebrow={`Branch ${String(branch.index).padStart(2, '0')}`}
        title={branch.name}
        lede={branch.tagline}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Branches', href: '/branches' },
          { label: branch.shortName },
        ]}
        aside={
          <div className="glass flex flex-col gap-4 rounded-lg p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="open">
                <Clock className="size-3" aria-hidden="true" />
                Open 24 hours
              </Badge>
              {branch.rating !== null && (
                <Badge variant="bullion">
                  <Star className="size-3 fill-current" aria-hidden="true" />
                  {branch.rating.toFixed(1)} · {branch.reviewCount}+ reviews
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="forge">
                <a href={telLink(branch.phone)}>
                  <Phone aria-hidden="true" />
                  {branch.phoneDisplay}
                </a>
              </Button>
              <Button asChild size="sm" variant="glass">
                <a href={directionsUrl(branch)} target="_blank" rel="noopener noreferrer">
                  <Navigation aria-hidden="true" />
                  Directions
                </a>
              </Button>
            </div>
          </div>
        }
      />

      <section className="border-b border-brand-chalk/8 py-20 sm:py-28">
        <div className="container grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-brand-chalk/10">
              <Image
                src={branch.image}
                alt={branch.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="flex flex-col gap-8">
            <div>
              <h2 className="font-mono text-[0.625rem] uppercase tracking-[0.24em] text-brand-bullion">Address</h2>
              <address className="mt-3 not-italic text-lg leading-relaxed text-brand-chalk/85">
                {branch.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <span className="block">
                  {branch.locality} — {branch.postalCode}
                </span>
                <span className="block">{branch.region}</span>
              </address>
            </div>

            <dl className="grid grid-cols-2 gap-6 border-t border-brand-chalk/10 pt-8">
              <div>
                <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">Hours</dt>
                <dd className="mt-1 font-display text-xl text-brand-chalk">24 × 7</dd>
              </div>
              {branch.areaSqft !== null && (
                <div>
                  <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">Floor area</dt>
                  <dd className="mt-1 font-display text-xl tabular-nums text-brand-chalk">
                    {branch.areaSqft.toLocaleString('en-IN')} sq ft
                  </dd>
                </div>
              )}
              {branch.stations && (
                <div>
                  <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">Stations</dt>
                  <dd className="mt-1 font-display text-xl text-brand-chalk">{branch.stations}</dd>
                </div>
              )}
              {branch.openedYear !== null && (
                <div>
                  <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">Opened</dt>
                  <dd className="mt-1 font-display text-xl tabular-nums text-brand-chalk">{branch.openedYear}</dd>
                </div>
              )}
            </dl>

            {branch.equipment.length > 0 && (
              <div className="border-t border-brand-chalk/10 pt-8">
                <h2 className="font-mono text-[0.625rem] uppercase tracking-[0.24em] text-brand-bullion">Equipment</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {branch.equipment.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-brand-chalk/12 px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-brand-smoke"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {branch.rating !== null && (
              <p className="border-t border-brand-chalk/10 pt-8 text-sm leading-relaxed text-brand-smoke">
                Rated {branch.rating.toFixed(1)} from {branch.reviewCount}+ Google reviews, verified{' '}
                {new Date(branch.verifiedOn).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}.{' '}
                <a
                  href={listingUrl(branch)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-bullion underline-offset-4 hover:underline"
                >
                  Read the reviews on Google
                </a>
                .
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-brand-chalk/8 py-24 sm:py-32">
        <div className="container">
          <SectionHeading
            eyebrow="At this branch"
            title={<>What is <span className="text-engraved">on the floor</span></>}
          />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {branchFacilities.map((facility, index) => (
              <Reveal as="li" key={facility.slug} delay={index * 0.05}>
                <div className="glass flex h-full flex-col gap-3 rounded-lg p-6">
                  <FacilityIcon name={facility.icon} className="size-6 text-brand-blood" />
                  <h3 className="font-display text-lg uppercase tracking-tight">{facility.title}</h3>
                  <p className="text-sm leading-relaxed text-brand-smoke">{facility.summary}</p>
                  {facility.spec && (
                    <span className="mt-auto font-mono text-[0.625rem] uppercase tracking-[0.18em] text-brand-bullion">
                      {facility.spec}
                    </span>
                  )}
                </div>
              </Reveal>
            ))}
          </ul>

          {branchTrainers.length > 0 && (
            <p className="mt-10 text-sm leading-relaxed text-brand-smoke">
              {branchTrainers.length} coaching {branchTrainers.length === 1 ? 'role is' : 'roles are'} available at
              this branch.{' '}
              <Link href="/personal-training" className="text-brand-bullion underline-offset-4 hover:underline">
                See personal training
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      <section id="visit" className="py-24 sm:py-32">
        <div className="container grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Find us"
              title={<>Get here <span className="text-engraved">tonight</span></>}
              lede="The floor is open now. Tap the marker for a route, or send an enquiry and a trainer will call you back."
            />
            <Reveal className="mt-10">
              <BranchMapLoader branch={branch} className="h-[24rem]" />
            </Reveal>
          </div>

          <div>
            <h2 className="font-mono text-[0.625rem] uppercase tracking-[0.24em] text-brand-bullion">
              Enquire about {branch.shortName}
            </h2>
            <EnquiryForm className="mt-6" defaultIntent="free-trial" />
          </div>
        </div>
      </section>
    </>
  );
}
