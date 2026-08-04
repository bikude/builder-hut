import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, Phone } from 'lucide-react';

import { FaqList } from '@/components/common/faq-list';
import { PageHero } from '@/components/common/page-hero';
import { SectionHeading } from '@/components/common/section-heading';
import { Button } from '@/components/ui/button';
import { faqs } from '@/content/faq';
import { buildMetadata } from '@/lib/seo';
import { siteConfig, telLink, whatsappLink } from '@/lib/site';
import { breadcrumbSchema, faqSchema, graph } from '@/lib/structured-data';

export const metadata: Metadata = buildMetadata({
  title: 'FAQ',
  description:
    'Answers about joining, membership, timings, trainers, facilities and safety at A Builder Hut — the 24×7 gyms in Maheshtala and Budge Budge.',
  path: '/faq',
});

export default function FaqPage() {
  return (
    <>
      {/* The FAQPage graph is built from the same array the page renders, so a rich
          result can never quote an answer that is no longer on the page. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            graph(
              faqSchema(faqs.map((entry) => ({ question: entry.question, answer: entry.answer }))),
              breadcrumbSchema([
                { name: 'Home', path: '/' },
                { name: 'FAQ', path: '/faq' },
              ]),
            ),
          ),
        }}
      />

      <PageHero
        eyebrow="FAQ"
        title="Asked and answered"
        lede="Sixteen questions we get most weeks, grouped by what you are trying to find out. If yours is not here, call — the floor is staffed at every hour."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]}
      />

      <section id="questions" className="border-b border-brand-chalk/8 py-20 sm:py-28">
        <div className="container">
          <FaqList />
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container">
          <div className="glass clip-slant relative overflow-hidden rounded-lg px-8 py-14 sm:px-14 sm:py-20">
            <div className="max-w-2xl">
              <SectionHeading
                eyebrow="Still unsure"
                title={<>Ask a <span className="text-engraved">person</span></>}
                lede="Reception answers at any hour, including overnight. Most questions take under a minute."
              />
              <div className="mt-10 flex flex-wrap gap-3">
                <Button asChild variant="forge" size="lg">
                  <a href={telLink()}>
                    <Phone aria-hidden="true" />
                    {siteConfig.contact.phoneDisplay}
                  </a>
                </Button>
                <Button asChild variant="glass" size="lg">
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                    <MessageCircle aria-hidden="true" />
                    WhatsApp
                  </a>
                </Button>
                <Button asChild variant="ghost" size="lg">
                  <Link href="/contact">Send an enquiry</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
