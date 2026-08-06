'use client';

import { createContext, useContext } from 'react';

/**
 * Language.
 *
 * English is primary; Bengali and Hindi are offered because this gym is in Maheshtala,
 * where a large share of members read Bengali more comfortably than English.
 *
 * This is a dictionary rather than a full i18n framework, and that is a deliberate fit to
 * the site rather than a shortcut: the homepage carries about ten words of prose, so the
 * translatable surface is UI chrome and calls to action. A routing-based i18n setup would
 * add three URL trees and a build step to translate roughly forty strings.
 *
 * OWNER ACTION: the Bengali and Hindi below should be read by a native speaker before
 * launch. Gym vocabulary in particular ("strength", "reps") is often left in English in
 * everyday Bengali speech, and a literal translation can read stiffer than what people
 * actually say. Correct anything that sounds wrong — it is one file.
 */

export const LOCALES = ['en', 'bn', 'hi'] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABEL: Record<Locale, string> = {
  en: 'English',
  bn: 'বাংলা',
  hi: 'हिन्दी',
};

/** Short code shown in the header where there is no room for the full name. */
export const LOCALE_SHORT: Record<Locale, string> = { en: 'EN', bn: 'বাং', hi: 'हि' };

type Dictionary = {
  joinNow: string;
  exploreBranches: string;
  explore: string;
  call: string;
  whatsapp: string;
  directions: string;
  instagram: string;
  nearestToMe: string;
  nearest: string;
  visitToday: string;
  openNow: string;
  open247: string;
  heroLine1: string;
  heroLine2: string;
  hookA: string;
  hookB: string;
  since: string;
  theme: string;
  language: string;
  allBranches: string;
  whatsHere: string;
  onTheFloor: string;
  theRooms: string;
  findIt: string;
};

export const DICTIONARY: Record<Locale, Dictionary> = {
  en: {
    joinNow: 'Join now',
    exploreBranches: 'Explore branches',
    explore: 'Explore',
    call: 'Call',
    whatsapp: 'WhatsApp',
    directions: 'Directions',
    instagram: 'Instagram',
    nearestToMe: 'Nearest to me',
    nearest: 'nearest',
    visitToday: 'Visit today',
    openNow: 'Open now',
    open247: 'Open 24×7',
    heroLine1: 'Build your',
    heroLine2: 'strongest self',
    hookA: 'Not just a gym.',
    hookB: 'A lifestyle.',
    since: 'Maheshtala & Budge Budge · Since 2022',
    theme: 'Theme',
    language: 'Language',
    allBranches: 'All branches',
    whatsHere: "What's here",
    onTheFloor: 'On the floor',
    theRooms: 'The rooms',
    findIt: 'Find it',
  },
  bn: {
    joinNow: 'যোগ দিন',
    exploreBranches: 'শাখা দেখুন',
    explore: 'দেখুন',
    call: 'ফোন',
    whatsapp: 'হোয়াটসঅ্যাপ',
    directions: 'পথ',
    instagram: 'ইনস্টাগ্রাম',
    nearestToMe: 'নিকটতম শাখা',
    nearest: 'নিকটতম',
    visitToday: 'আজই আসুন',
    openNow: 'এখন খোলা',
    open247: '২৪ ঘণ্টা খোলা',
    heroLine1: 'গড়ে তুলুন',
    heroLine2: 'নিজের সেরা রূপ',
    hookA: 'শুধু জিম নয়।',
    hookB: 'একটা জীবনধারা।',
    since: 'মহেশতলা ও বজবজ · ২০২২ থেকে',
    theme: 'থিম',
    language: 'ভাষা',
    allBranches: 'সব শাখা',
    whatsHere: 'কী কী আছে',
    onTheFloor: 'ফ্লোরে',
    theRooms: 'ভিতরে',
    findIt: 'ঠিকানা',
  },
  hi: {
    joinNow: 'अभी जुड़ें',
    exploreBranches: 'शाखाएँ देखें',
    explore: 'देखें',
    call: 'कॉल',
    whatsapp: 'व्हाट्सएप',
    directions: 'रास्ता',
    instagram: 'इंस्टाग्राम',
    nearestToMe: 'सबसे नज़दीकी',
    nearest: 'सबसे नज़दीक',
    visitToday: 'आज ही आइए',
    openNow: 'अभी खुला',
    open247: '24×7 खुला',
    heroLine1: 'बनाइए अपना',
    heroLine2: 'सबसे मज़बूत रूप',
    hookA: 'सिर्फ़ जिम नहीं।',
    hookB: 'एक जीवनशैली।',
    since: 'महेशतला और बजबज · 2022 से',
    theme: 'थीम',
    language: 'भाषा',
    allBranches: 'सभी शाखाएँ',
    whatsHere: 'यहाँ क्या है',
    onTheFloor: 'फ़्लोर पर',
    theRooms: 'अंदर',
    findIt: 'पता',
  },
};

export const LocaleContext = createContext<{ locale: Locale; setLocale: (next: Locale) => void }>({
  locale: 'en',
  setLocale: () => undefined,
});

/** `t` for copy, `locale` when a component needs to branch on the language itself. */
export function useI18n() {
  const { locale, setLocale } = useContext(LocaleContext);
  return { locale, setLocale, t: DICTIONARY[locale] };
}
