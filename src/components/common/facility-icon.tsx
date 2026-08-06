import {
  Coffee,
  Dumbbell,
  Flame,
  Gamepad2,
  HeartPulse,
  Lock,
  Salad,
  Snowflake,
  Sparkles,
  Swords,
  UserRound,
  Waves,
  type LucideIcon,
} from 'lucide-react';

import type { CSSProperties } from 'react';

import type { FacilityIcon as FacilityIconKey } from '@/content/facilities';
import { cn } from '@/lib/utils';

/**
 * Maps facility keys to Lucide glyphs.
 *
 * The content file stores a key rather than a component so `src/content/*` stays free of
 * imports and safe for a non-developer to edit. Add the key here first, then use it there.
 */
const ICONS: Record<FacilityIconKey, LucideIcon> = {
  strength: Dumbbell,
  cardio: HeartPulse,
  functional: Waves,
  crossfit: Flame,
  mma: Swords,
  gaming: Gamepad2,
  spa: Sparkles,
  cafe: Coffee,
  locker: Lock,
  trainer: UserRound,
  diet: Salad,
  ac: Snowflake,
};

export function FacilityIcon({
  name,
  className,
  style,
}: {
  name: FacilityIconKey;
  className?: string;
  /** Lets a branch tint its own icons with `accentHex`, which no Tailwind class can express. */
  style?: CSSProperties;
}) {
  const Icon = ICONS[name];
  return <Icon className={cn('size-6', className)} style={style} aria-hidden="true" />;
}
