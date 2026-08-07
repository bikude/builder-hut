'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const SESSION_KEY = 'abh:promo-seen';
/** Long enough that the popup never competes with the preloader curtain for attention. */
const SHOW_DELAY_MS = 1800;

const POSTER = {
  src: '/media/promo/puja-offer-club.jpg',
  width: 1086,
  height: 1357,
};

/**
 * Promotional pop-up — the Club's Puja offer flyer.
 *
 * OWNER ACTION: this is a time-limited campaign image ("Limited period Puja offer",
 * yearly membership at ₹9,999). Swap `public/media/promo/puja-offer-club.jpg` and the
 * alt text below for the next campaign's poster, or delete `<PromoPopup />` out of
 * layout.tsx entirely once this offer ends — nothing else on the site reads from it.
 *
 * Plays once per browser session, after a short delay so it never opens on top of the
 * preloader curtain. The close button, click-outside and Escape all come from the same
 * Dialog primitive the gallery lightbox uses, so the dismiss behaviour is identical.
 */
export function PromoPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem(SESSION_KEY) === '1') return;

    // Warm the browser cache while the delay runs, so the image is already there —
    // not mid-decode — the moment the dialog opens.
    const preload = new window.Image();
    preload.src = POSTER.src;

    const timeout = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timeout);
  }, []);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) window.sessionStorage.setItem(SESSION_KEY, '1');
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent closeLabel="Close offer" className="w-[min(92vw,420px)] p-0">
        <DialogTitle className="sr-only">A Builder Hut Club — exclusive Puja offer</DialogTitle>
        <Image
          src={POSTER.src}
          alt="A Builder Hut Club exclusive Puja offer: yearly membership now ₹9,999 (was ₹15,000), one month free MMA training, a free premium gym bag, and 20% off the salon and spa. Call 82769 03869."
          width={POSTER.width}
          height={POSTER.height}
          sizes="(max-width: 640px) 92vw, 420px"
          className="h-auto w-full rounded-lg border border-brand-chalk/15"
        />
      </DialogContent>
    </Dialog>
  );
}
