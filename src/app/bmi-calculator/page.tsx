import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHero } from '@/components/common/page-hero';
import { SectionHeading } from '@/components/common/section-heading';
import { BmiCalculator } from '@/components/tools/bmi-calculator';
import { Button } from '@/components/ui/button';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, graph } from '@/lib/structured-data';

export const metadata: Metadata = buildMetadata({
  title: 'BMI Calculator',
  description:
    'Work out your BMI in metric or imperial units, see the healthy weight range for your height, and understand what BMI does and does not tell you.',
  path: '/bmi-calculator',
  keywords: ['BMI calculator India', 'healthy weight for height', 'body mass index Asian scale'],
});

export default function BmiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            graph(
              breadcrumbSchema([
                { name: 'Home', path: '/' },
                { name: 'BMI Calculator', path: '/bmi-calculator' },
              ]),
            ),
          ),
        }}
      />

      <PageHero
        eyebrow="Tool"
        title="BMI calculator"
        lede="A starting number, not a verdict. It takes ten seconds, and the notes underneath explain exactly how much weight to put on the result."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'BMI Calculator' }]}
      />

      <section id="calculator" className="border-b border-brand-chalk/8 py-20 sm:py-28">
        <div className="container">
          <BmiCalculator />
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Better numbers"
              title={<>What to measure <span className="text-engraved">instead</span></>}
            />
            <ul className="mt-10 flex flex-col gap-5 text-lg leading-relaxed text-brand-chalk/80">
              <li>
                <strong className="font-display uppercase tracking-tight text-brand-chalk">Waist circumference.</strong>{' '}
                A better predictor of health risk than BMI, and it costs one tape measure.
              </li>
              <li>
                <strong className="font-display uppercase tracking-tight text-brand-chalk">Body composition.</strong>{' '}
                Fat mass versus lean mass. Reception can run this at any branch.
              </li>
              <li>
                <strong className="font-display uppercase tracking-tight text-brand-chalk">Working weights.</strong>{' '}
                What you can lift for a set of five tells you more about progress than the scale does.
              </li>
              <li>
                <strong className="font-display uppercase tracking-tight text-brand-chalk">How you feel at week eight.</strong>{' '}
                Sleep, energy and whether stairs are still a problem — all of it counts.
              </li>
            </ul>
          </div>

          <div className="glass flex flex-col gap-5 rounded-lg p-8">
            <h2 className="font-display text-2xl uppercase tracking-tight">Bring the number in</h2>
            <p className="leading-relaxed text-brand-chalk/75">
              Whatever it says, the next step is the same: a fitness assessment, a movement screen and a programme
              built around where you actually are. Free trial, no card.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button asChild variant="bullion" size="lg">
                <Link href="/contact#free-trial">Book free trial</Link>
              </Button>
              <Button asChild variant="glass" size="lg">
                <Link href="/personal-training">Personal training</Link>
              </Button>
            </div>
            <p className="mt-4 border-t border-brand-chalk/10 pt-5 text-sm leading-relaxed text-brand-smoke">
              This calculator is general information for healthy adults. It is not medical advice and it is not
              suitable for children, pregnant women or people with a diagnosed condition. Speak to your doctor before
              starting a new programme.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
