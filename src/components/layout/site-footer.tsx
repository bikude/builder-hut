import Link from 'next/link';
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

import { Logo } from '@/components/common/logo';
import { RatingStars } from '@/components/common/rating-stars';
import { branches, directionsUrl, formatAddress } from '@/content/branches';
import { footerNav, siteConfig, telLink, whatsappLink } from '@/lib/site';

const socialLinks = [
  { href: siteConfig.social.instagram, label: 'Instagram — A Builder Hut', Icon: Instagram },
  { href: siteConfig.social.instagramAlt, label: 'Instagram — A Builder Hut Club', Icon: Instagram },
  { href: siteConfig.social.facebook, label: 'Facebook — A Builder Hut', Icon: Facebook },
  { href: siteConfig.social.facebookAlt, label: 'Facebook — A Builder Hut 3.0', Icon: Facebook },
].filter((link) => Boolean(link.href));

export function SiteFooter() {
  return (
    <footer className="hairline-top relative bg-brand-forge">
      <div className="container grid gap-12 py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="flex flex-col gap-6 lg:col-span-4">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-brand-smoke">{siteConfig.description}</p>
          <RatingStars rating={siteConfig.reviews.rating} reviewCount={siteConfig.reviews.count} />
          <div className="flex flex-col gap-2 text-sm">
            <a href={telLink()} className="flex items-center gap-3 text-brand-smoke transition-colors hover:text-brand-chalk">
              <Phone className="size-4 text-brand-blood" aria-hidden="true" />
              {siteConfig.contact.phoneDisplay}
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-brand-smoke transition-colors hover:text-brand-chalk"
            >
              <MessageCircle className="size-4 text-brand-blood" aria-hidden="true" />
              WhatsApp us
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="flex items-center gap-3 text-brand-smoke transition-colors hover:text-brand-chalk"
            >
              <Mail className="size-4 text-brand-blood" aria-hidden="true" />
              {siteConfig.contact.email}
            </a>
          </div>
          <div className="flex gap-3">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="glass flex size-10 items-center justify-center rounded-md text-brand-smoke transition-all duration-300 hover:-translate-y-0.5 hover:text-brand-bullion"
              >
                <Icon className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-3 lg:col-span-4">
          <FooterColumn title="Train" items={footerNav.train} />
          <FooterColumn title="Explore" items={footerNav.explore} />
          <FooterColumn title="Help" items={footerNav.help} />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-4">
          <h2 className="font-mono text-eyebrow uppercase text-brand-bullion">Three floors, one membership</h2>
          <ul className="flex flex-col gap-5">
            {branches.map((branch) => (
              <li key={branch.slug} className="flex gap-3">
                <MapPin className="mt-1 size-4 shrink-0 text-brand-blood" aria-hidden="true" />
                <div className="text-sm">
                  <p className="font-display text-base uppercase tracking-wide text-brand-chalk">{branch.name}</p>
                  <p className="mt-1 leading-relaxed text-brand-smoke">{formatAddress(branch)}</p>
                  <a
                    href={directionsUrl(branch)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block font-mono text-[0.625rem] uppercase tracking-[0.16em] text-brand-bullion hover:underline"
                  >
                    Directions →
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="hairline-top">
        <div className="container flex flex-col gap-3 py-6 text-center font-mono text-[0.625rem] uppercase tracking-[0.18em] text-brand-smoke sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
          <p>Open 24 hours · Maheshtala · Budge Budge · Kolkata</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: Array<{ href: string; label: string }> }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-mono text-eyebrow uppercase text-brand-bullion">{title}</h2>
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-sm text-brand-smoke transition-colors hover:text-brand-chalk">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
