'use client';

import { AlertTriangle, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

/**
 * BMI calculator.
 *
 * BMI is a population screening tool, not a diagnosis, and it is a poor fit for a gym
 * audience: a muscular member is routinely classified "overweight" by it. So this
 * component reports the number, states the WHO band, and then says plainly what BMI
 * cannot tell you — rather than implying a health verdict it is not entitled to make.
 *
 * The Asian-origin thresholds are shown as a second scale because the WHO recommends
 * lower action points for South Asian populations, which is directly relevant here.
 */

type Units = 'metric' | 'imperial';

type Band = { max: number; label: string; tone: string; note: string };

const WHO_BANDS: Band[] = [
  { max: 18.5, label: 'Underweight', tone: 'text-sky-300', note: 'Below the standard healthy range.' },
  { max: 25, label: 'Healthy range', tone: 'text-emerald-300', note: 'Within the standard healthy range.' },
  { max: 30, label: 'Overweight', tone: 'text-brand-gilt', note: 'Above the standard healthy range.' },
  { max: Infinity, label: 'Obese', tone: 'text-brand-blood', note: 'Well above the standard healthy range.' },
];

/** WHO public-health action points for adults of Asian origin. */
const ASIAN_BANDS: Band[] = [
  { max: 18.5, label: 'Underweight', tone: 'text-sky-300', note: '' },
  { max: 23, label: 'Healthy range', tone: 'text-emerald-300', note: '' },
  { max: 27.5, label: 'Increased risk', tone: 'text-brand-gilt', note: '' },
  { max: Infinity, label: 'High risk', tone: 'text-brand-blood', note: '' },
];

function classify(bmi: number, bands: Band[]): Band {
  return bands.find((band) => bmi < band.max) ?? bands[bands.length - 1]!;
}

export function BmiCalculator() {
  const [units, setUnits] = useState<Units>('metric');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [pounds, setPounds] = useState('');

  const result = useMemo(() => {
    let metres = 0;
    let kilograms = 0;

    if (units === 'metric') {
      metres = Number(heightCm) / 100;
      kilograms = Number(weightKg);
    } else {
      const totalInches = Number(feet) * 12 + Number(inches || '0');
      metres = totalInches * 0.0254;
      kilograms = Number(pounds) * 0.45359237;
    }

    if (!Number.isFinite(metres) || !Number.isFinite(kilograms) || metres <= 0 || kilograms <= 0) return null;
    // Guard against typos that produce absurd values (e.g. height entered in metres).
    if (metres < 0.6 || metres > 2.6 || kilograms < 15 || kilograms > 400) return null;

    const bmi = kilograms / (metres * metres);
    const healthyLow = 18.5 * metres * metres;
    const healthyHigh = 24.9 * metres * metres;

    return {
      bmi,
      who: classify(bmi, WHO_BANDS),
      asian: classify(bmi, ASIAN_BANDS),
      healthyLow,
      healthyHigh,
    };
  }, [units, heightCm, weightKg, feet, inches, pounds]);

  const reset = () => {
    setHeightCm('');
    setWeightKg('');
    setFeet('');
    setInches('');
    setPounds('');
  };

  // Position on the 15–40 scale used by the gauge.
  const markerPercent = result ? Math.min(100, Math.max(0, ((result.bmi - 15) / 25) * 100)) : 0;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
      <div className="glass rounded-lg p-6 sm:p-8">
        <Tabs value={units} onValueChange={(value) => setUnits(value as Units)}>
          <TabsList aria-label="Choose units">
            <TabsTrigger value="metric">Metric</TabsTrigger>
            <TabsTrigger value="imperial">Imperial</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-8 flex flex-col gap-5">
          {units === 'metric' ? (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="height-cm">Height (cm)</Label>
                <Input
                  id="height-cm"
                  inputMode="decimal"
                  placeholder="170"
                  value={heightCm}
                  onChange={(event) => setHeightCm(event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="weight-kg">Weight (kg)</Label>
                <Input
                  id="weight-kg"
                  inputMode="decimal"
                  placeholder="70"
                  value={weightKg}
                  onChange={(event) => setWeightKg(event.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="height-ft">Height (ft)</Label>
                  <Input
                    id="height-ft"
                    inputMode="numeric"
                    placeholder="5"
                    value={feet}
                    onChange={(event) => setFeet(event.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="height-in">Height (in)</Label>
                  <Input
                    id="height-in"
                    inputMode="numeric"
                    placeholder="7"
                    value={inches}
                    onChange={(event) => setInches(event.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="weight-lb">Weight (lb)</Label>
                <Input
                  id="weight-lb"
                  inputMode="decimal"
                  placeholder="154"
                  value={pounds}
                  onChange={(event) => setPounds(event.target.value)}
                />
              </div>
            </>
          )}

          <Button type="button" variant="ghost" size="sm" onClick={reset} className="self-start">
            <RotateCcw aria-hidden="true" />
            Clear
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="glass rounded-lg p-6 sm:p-8" aria-live="polite">
          {result ? (
            <>
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.24em] text-brand-smoke">Your BMI</p>
              <p className="mt-2 flex items-baseline gap-4">
                <span className="font-display text-6xl leading-none tabular-nums text-brand-chalk sm:text-7xl">
                  {result.bmi.toFixed(1)}
                </span>
                <span className={cn('font-display text-xl uppercase tracking-tight', result.who.tone)}>
                  {result.who.label}
                </span>
              </p>

              <div className="mt-8">
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 via-45% to-brand-blood">
                  <span
                    className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-ink bg-brand-chalk shadow-plate"
                    style={{ left: `${markerPercent}%` }}
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-2 flex justify-between font-mono text-[0.625rem] tabular-nums text-brand-smoke">
                  <span>15</span>
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                  <span>40</span>
                </div>
              </div>

              <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-md border border-brand-chalk/10 p-4">
                  <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">
                    Healthy weight for your height
                  </dt>
                  <dd className="mt-2 font-display text-xl tabular-nums text-brand-chalk">
                    {result.healthyLow.toFixed(1)}–{result.healthyHigh.toFixed(1)} kg
                  </dd>
                </div>
                <div className="rounded-md border border-brand-chalk/10 p-4">
                  <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">
                    On the Asian-origin scale
                  </dt>
                  <dd className={cn('mt-2 font-display text-xl uppercase tracking-tight', result.asian.tone)}>
                    {result.asian.label}
                  </dd>
                </div>
              </dl>
            </>
          ) : (
            <div className="flex min-h-[12rem] flex-col justify-center">
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.24em] text-brand-smoke">Your BMI</p>
              <p className="mt-3 max-w-sm leading-relaxed text-brand-smoke">
                Enter your height and weight and the number appears here, along with the healthy weight range for
                your height.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-brand-bullion/25 bg-brand-bullion/5 p-6">
          <p className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-gilt">
            <AlertTriangle className="size-3.5" aria-hidden="true" />
            What BMI cannot tell you
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-sm leading-relaxed text-brand-chalk/75">
            <li>
              It does not distinguish muscle from fat. Members who lift regularly are often classed “overweight”
              while carrying very little fat.
            </li>
            <li>It says nothing about where fat sits, and waist measurement predicts health risk better.</li>
            <li>
              It is not valid for children, pregnant women, or athletes, and it is a screening number rather than a
              diagnosis.
            </li>
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-brand-smoke">
            Use it as a starting point, then get a body composition check at reception — and speak to a doctor
            before starting a new programme if you have any medical condition.
          </p>
        </div>
      </div>
    </div>
  );
}
