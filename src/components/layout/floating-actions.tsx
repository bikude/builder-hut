'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';

import { useScrolled } from '@/hooks/use-scrolled';
import { EASE } from '@/lib/motion';
import { siteConfig, telLink, whatsappLink } from '@/lib/site';

/**
 * Persistent call and WhatsApp buttons.
 *
 * Most enquiries for a neighbourhood gym arrive by phone, so the two actions that
 * convert stay reachable with one thumb. They appear after the hero rather than sitting
 * on top of it, so the opening frame is never obstructed.
 */
export function FloatingActions() {
  const visible = useScrolled(520);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="fixed bottom-5 right-5 z-40 flex flex-col gap-3 sm:bottom-8 sm:right-8"
        >
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with A Builder Hut on WhatsApp"
            className="group flex size-13 items-center justify-center rounded-full bg-[#25D366] text-brand-ink shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] transition-transform duration-300 ease-hut hover:scale-105"
            style={{ width: '3.25rem', height: '3.25rem' }}
          >
            <MessageCircle className="size-6" aria-hidden="true" />
          </a>
          <a
            href={telLink()}
            aria-label={`Call A Builder Hut on ${siteConfig.contact.phoneDisplay}`}
            className="group flex items-center justify-center rounded-full bg-red-forge text-brand-chalk shadow-glow-red transition-transform duration-300 ease-hut hover:scale-105"
            style={{ width: '3.25rem', height: '3.25rem' }}
          >
            <Phone className="size-5" aria-hidden="true" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
