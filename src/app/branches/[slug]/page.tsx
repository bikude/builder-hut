import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Instagram, MapPin, MessageCircle, Navigation, Phone, Star } from 'lucide-react';

import { BranchMapLoader } from '@/components/branches/branch-map-loader';
import { BranchShowcase } from '@/components/branch/branch-showcase';
import { FacilityIcon } from '@/components/common/facility-icon';
import { AutoVideo } from '@/components/media/auto-video';
import { Button } from '@/components/ui/button';
import { branches, directionsUrl, formatAddress, getBranch, kidsProgramme } from '@/content/branches';
import { facilitiesForBranch } from '@/content/facilities';
import { heroPhoto, heroVideo } from '@/content/media';
import { trainersForBranch } from '@/content/trainers';
import { buildMetadata } from '@/lib/seo';
import { telLink, whatsappLink } from '@/lib/site';
import { branchSchema, breadcrumbSchema, graph } from '@/lib/structured-data';

export function generateStaticParams() {
  return branches.map((branch) => ({ slug: branch.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const branch = getBranch(slug);
  if (!branch) {
    return buildMetadata({ title: 'Branch not found', description: 'This branch does not exist.', path: '/branches' });
  }
  return buildMetadata({
    title: `${branch.name} — ${branch.shortName}`,
    description: `${branch.tagline} Open 24 hours at ${formatAddress(branch)}.`,
    path: `/branches/${branch.slug}`,
    image: branch.image,
    keywords: [`gym in ${branch.shortName}`, branch.name, `24 hour gym ${branch.locality}`],
  });
}

/**
 * A branch, as a trailer.
 *
 * Film first, then the floor in motion, then the rooms, then the few facts that decide
 * whether someone comes tonight: what is here, who coaches, where it is, how to reach it.
 * Everything detailed about a branch lives here rather than on the homepage — that page's
 * whole job is getting a visitor to this one.
 */
export default async function BranchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const branch = getBranch(slug);
  if (!branch) notFound();

  const film = heroVideo(branch.slug);
  const still = heroPhoto(branch.slug);
  const facilities = facilitiesForBranch(branch.slug);
  const roles = trainersForBranch(branch.slug);
  const kids = kidsProgramme.branchSlug === branch.slug ? kidsProgramme : null;

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

      {/* ── 1 · Trailer ─────────────────────────────────────────────────── */}
      <header className="cinematic relative flex min-h-[88svh] flex-col justify-end overflow-hidden bg-brand-ink pb-12 pt-[var(--header-h)]">
        <div className="absolute inset-0 -z-20">
          {film ? (
            <AutoVideo
              src={film.src}
              poster={film.poster}
              preload="auto"
              allowManualStart={false}
              baseImage={
                still ? { src: still.src, alt: still.alt, width: still.nativeWidth, height: still.nativeHeight } : undefined
              }
            />
          ) : still ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={still.src} alt="" className="size-full object-cover" aria-hidden="true" />
          ) : null}
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-ink via-brand-ink/70 to-brand-ink/30" aria-hidden="true" />

        <div className="container">
          <span
            className="font-mono text-eyebrow uppercase tracking-[0.28em]"
            style={{ color: branch.accentHex }}
          >
            {String(branch.index).padStart(2, '0')} · {branch.character}
          </span>

          <h1 className="mt-4 max-w-[14ch] text-display-md">{branch.name}</h1>
          <p className="mt-4 max-w-lg text-lg text-brand-chalk/75">{branch.tagline}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild variant="bullion" size="lg">
              <a href={telLink(branch.phone)}>
                <Phone aria-hidden="true" />
                Call this hut
              </a>
            </Button>
            <Button asChild variant="glass" size="lg">
              <a href={directionsUrl(branch)} target="_blank" rel="noopener noreferrer">
                <Navigation aria-hidden="true" />
                Navigate
              </a>
            </Button>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-brand-chalk/10 pt-5 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">
            <span className="flex items-center gap-2 text-emerald-300">
              <Clock className="size-3" aria-hidden="true" />
              Open 24×7
            </span>
            {branch.rating !== null && (
              <span className="flex items-center gap-2 text-brand-gilt">
                <Star className="size-3 fill-current" aria-hidden="true" />
                {branch.rating.toFixed(1)} · {branch.reviewCount}+
              </span>
            )}
            <span>{branch.locality}</span>
          </div>
        </div>
      </header>

      {/* ── 2 · The floor, moving · 3 · The rooms ───────────────────────── */}
      <BranchShowcase branchSlug={branch.slug} accentHex={branch.accentHex} />

      {/* ── 4 · What's here. Icons and names, no descriptions. ──────────── */}
      <section className="border-b border-brand-chalk/8 py-12 sm:py-16">
        <div className="container">
          <h2 className="font-mono text-[0.625rem] uppercase tracking-[0.26em]" style={{ color: branch.accentHex }}>
            What&apos;s here
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {facilities.map((facility) => (
              <li
                key={facility.slug}
                className="flex items-center gap-3 rounded-lg border border-brand-chalk/10 bg-brand-forge/50 p-4"
              >
                <FacilityIcon name={facility.icon} className="size-5 shrink-0" style={{ color: branch.accentHex }} />
                <span className="font-display text-sm uppercase leading-tight tracking-tight">{facility.title}</span>
              </li>
            ))}
          </ul>

          {branch.equipment.length > 0 && (
            <>
              <h2
                className="mt-12 font-mono text-[0.625rem] uppercase tracking-[0.26em]"
                style={{ color: branch.accentHex }}
              >
                Equipment
              </h2>
              <ul className="mt-6 flex flex-wrap gap-2">
                {branch.equipment.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-brand-chalk/12 px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-brand-smoke"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      {/* ── 4b · Trainer highlights. Roles, not paragraphs. ─────────────── */}
      {roles.length > 0 && (
        <section className="border-b border-brand-chalk/8 py-12 sm:py-16">
          <div className="container">
            <h2 className="font-mono text-[0.625rem] uppercase tracking-[0.26em]" style={{ color: branch.accentHex }}>
              Who coaches here
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {roles.map((trainer) => (
                <li
                  key={trainer.slug}
                  className="rounded-lg border border-brand-chalk/10 bg-brand-forge/50 p-5"
                >
                  <p className="font-display text-base uppercase tracking-tight text-brand-chalk">
                    {trainer.name}
                    {trainer.isRole && (
                      <span className="ml-2 align-middle font-mono text-[0.5625rem] normal-case tracking-normal text-brand-bullion">
                        · Role, not yet a named trainer
                      </span>
                    )}
                  </p>
                  <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-brand-smoke">
                    {trainer.specialisms.slice(0, 2).join(' · ')}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── 4c · Kids programme. 3.0 only, and it is a poster, not an essay. */}
      {kids && (
        <section className="border-b border-brand-chalk/8 py-12 sm:py-16">
          <div className="container grid items-center gap-8 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={kids.poster}
              alt="A Builder Hut 3.0 kids fitness programme"
              loading="lazy"
              className="w-full rounded-xl border border-brand-chalk/12"
            />
            <div>
              <h2 className="text-display-sm">{kids.headline}</h2>
              <p className="mt-4 font-mono text-[0.625rem] uppercase tracking-[0.22em] text-brand-gilt">
                {kids.audience}
              </p>
              <Button asChild variant="bullion" size="lg" className="mt-6">
                <a
                  href={whatsappLink(`Hi! I'd like to ask about the kids programme at ${branch.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle aria-hidden="true" />
                  Ask about kids &amp; family
                </a>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ── 5 · Where, and how to reach it ──────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="container grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <h2 className="font-mono text-[0.625rem] uppercase tracking-[0.26em]" style={{ color: branch.accentHex }}>
              Find it
            </h2>
            <address className="mt-5 flex items-start gap-3 not-italic text-lg leading-relaxed text-brand-chalk/85">
              <MapPin className="mt-1.5 size-4 shrink-0" style={{ color: branch.accentHex }} aria-hidden="true" />
              {formatAddress(branch)}
            </address>

            <p className="mt-4 flex items-center gap-3 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-emerald-300">
              <Clock className="size-3.5" aria-hidden="true" />
              Open 24 hours · every day of the year
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="forge">
                <a href={telLink(branch.phone)}>
                  <Phone aria-hidden="true" />
                  {branch.phoneDisplay}
                </a>
              </Button>
              <Button asChild size="sm" variant="glass">
                <a
                  href={whatsappLink(`Hi! I'd like to visit ${branch.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle aria-hidden="true" />
                  WhatsApp
                </a>
              </Button>
              {branch.social.instagram && (
                <Button asChild size="sm" variant="glass">
                  <a href={branch.social.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram aria-hidden="true" />
                    Instagram
                  </a>
                </Button>
              )}
              <Button asChild size="sm" variant="ghost">
                <Link href="/branches">All branches</Link>
              </Button>
            </div>
          </div>

          <BranchMapLoader branch={branch} className="h-[22rem]" />
        </div>
      </section>
    </>
  );
}
