'use client';

import { useMemo, useState } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { faqCategories, faqs, type FaqCategory } from '@/content/faq';
import { cn } from '@/lib/utils';

/**
 * Filterable FAQ.
 *
 * Every question stays mounted in the DOM regardless of filter state — Radix keeps
 * collapsed panels in the accessibility tree, and search engines index the answers that
 * the FAQPage structured data also declares. Filtering hides, it does not unmount.
 */
export function FaqList({ limit }: { limit?: number }) {
  const [category, setCategory] = useState<FaqCategory | 'all'>('all');

  const visible = useMemo(() => {
    const filtered = category === 'all' ? faqs : faqs.filter((entry) => entry.category === category);
    return limit ? filtered.slice(0, limit) : filtered;
  }, [category, limit]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter questions by topic">
        <button
          type="button"
          onClick={() => setCategory('all')}
          aria-pressed={category === 'all'}
          className={cn(
            'rounded-full border px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] transition-all duration-300 ease-hut',
            category === 'all'
              ? 'border-brand-bullion bg-brand-bullion/15 text-brand-gilt'
              : 'border-brand-chalk/12 text-brand-smoke hover:border-brand-chalk/30 hover:text-brand-chalk',
          )}
        >
          All questions
        </button>
        {faqCategories.map((entry) => (
          <button
            key={entry.value}
            type="button"
            onClick={() => setCategory(entry.value)}
            aria-pressed={category === entry.value}
            className={cn(
              'rounded-full border px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] transition-all duration-300 ease-hut',
              category === entry.value
                ? 'border-brand-bullion bg-brand-bullion/15 text-brand-gilt'
                : 'border-brand-chalk/12 text-brand-smoke hover:border-brand-chalk/30 hover:text-brand-chalk',
            )}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <Accordion type="single" collapsible className="glass rounded-lg px-6 sm:px-8">
        {visible.map((entry) => (
          <AccordionItem key={entry.question} value={entry.question}>
            <AccordionTrigger>{entry.question}</AccordionTrigger>
            <AccordionContent>{entry.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
