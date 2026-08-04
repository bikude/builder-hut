import { CountUp } from '@/components/common/count-up';
import { Reveal } from '@/components/common/reveal';
import { stats } from '@/content/membership';
import { stagger } from '@/lib/motion';

/**
 * The numbers that answer "is this place any good?" before a visitor scrolls further.
 * Every figure is sourced — see the comment above `stats` in src/content/membership.ts.
 */
export function StatsBand() {
  return (
    <section aria-label="A Builder Hut in numbers" className="hairline-top relative bg-brand-forge/40">
      <Reveal variants={stagger(0, 0.06)} className="container grid grid-cols-2 gap-px py-0 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1 border-b border-r border-brand-chalk/8 px-4 py-8 last:border-r-0 sm:px-6"
          >
            <p className="font-display text-3xl leading-none text-brand-chalk sm:text-4xl">
              <CountUp to={stat.value} decimals={stat.decimals ?? 0} plain={stat.plain} />
              <span className="text-gold">{stat.suffix}</span>
            </p>
            <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-bullion">{stat.label}</p>
            <p className="text-xs leading-relaxed text-brand-smoke">{stat.sub}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
