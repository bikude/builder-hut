import { Info } from 'lucide-react';

import type { Block } from '@/content/blog';

/**
 * Renders a post's typed blocks.
 *
 * Keeping the body as data rather than MDX means no content pipeline, no runtime
 * compilation, and no way for an editor to accidentally ship arbitrary JSX into a page.
 */
export function PostBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, index) => {
        switch (block.kind) {
          case 'h2':
            return (
              <h2 key={index} className="mt-6 font-display text-2xl uppercase tracking-tight text-brand-chalk sm:text-3xl">
                {block.text}
              </h2>
            );
          case 'p':
            return (
              <p key={index} className="text-lg leading-relaxed text-brand-chalk/80">
                {block.text}
              </p>
            );
          case 'ul':
            return (
              <ul key={index} className="flex flex-col gap-3">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed text-brand-chalk/80">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-blood" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={index} className="flex flex-col gap-3">
                {block.items.map((item, itemIndex) => (
                  <li key={item} className="flex gap-4 leading-relaxed text-brand-chalk/80">
                    <span className="font-mono text-sm tabular-nums text-brand-bullion">
                      {String(itemIndex + 1).padStart(2, '0')}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            );
          case 'quote':
            return (
              <blockquote
                key={index}
                className="border-l-2 border-brand-bullion pl-6 font-display text-xl uppercase leading-tight tracking-tight text-brand-gilt sm:text-2xl"
              >
                {block.text}
              </blockquote>
            );
          case 'note':
            return (
              <p
                key={index}
                className="flex gap-3 rounded-lg border border-brand-bullion/25 bg-brand-bullion/5 p-5 text-sm leading-relaxed text-brand-chalk/75"
              >
                <Info className="mt-0.5 size-4 shrink-0 text-brand-gilt" aria-hidden="true" />
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
