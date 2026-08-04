/**
 * Frequently asked questions.
 *
 * These feed both the FAQ page and the FAQPage structured data, so the answer a visitor
 * reads and the answer Google may show as a rich result are always the same string.
 *
 * Answers avoid quoting a price, because prices change and a stale number in a search
 * result is worse than no number. Anything price-related routes to a call.
 */

export type FaqCategory = 'joining' | 'training' | 'facilities' | 'branches' | 'health';

export type FaqEntry = {
  question: string;
  answer: string;
  category: FaqCategory;
};

export const faqCategories: Array<{ value: FaqCategory; label: string }> = [
  { value: 'joining', label: 'Joining & membership' },
  { value: 'training', label: 'Training & trainers' },
  { value: 'facilities', label: 'Facilities' },
  { value: 'branches', label: 'Branches & timings' },
  { value: 'health', label: 'Health & safety' },
];

export const faqs: FaqEntry[] = [
  {
    category: 'joining',
    question: 'Can I try the gym before joining?',
    answer:
      'Yes. Book a free trial through the contact form or on WhatsApp, and come in at a time that suits you. A trainer will show you the floor, take you through an induction workout and answer questions before you pay for anything.',
  },
  {
    category: 'joining',
    question: 'What does membership cost?',
    answer:
      'Rates change with the season and with the offers running at each branch, so call +91 82769 03867 or message us on WhatsApp for today’s exact price. Monthly, quarterly, half-yearly and yearly options are available at every branch, and the longer tiers work out cheaper per month.',
  },
  {
    category: 'joining',
    question: 'Do I need to bring anything on my first day?',
    answer:
      'Training shoes, a towel and a water bottle. Bring a photo ID for the membership record. If you have a recent medical report or a doctor’s note about an injury, bring that too — the trainer will programme around it.',
  },
  {
    category: 'joining',
    question: 'Can I freeze or transfer my membership?',
    answer:
      'A freeze of up to 30 days is included with the yearly tier. For other tiers, talk to reception before you travel — freezes and transfers are handled case by case rather than by a blanket rule.',
  },
  {
    category: 'branches',
    question: 'Are you really open 24 hours?',
    answer:
      'Yes. All three branches — Batanagar, Chandannagar and Budge Budge 3.0 — are open every hour of every day, including festival days. If you finish a night shift at 11pm, the floor is open, air-conditioned and staffed.',
  },
  {
    category: 'branches',
    question: 'Does one membership work at all three branches?',
    answer:
      'The branches are interconnected, so members on the quarterly tier and above can train at any of them. If you work near Maheshtala and live near Budge Budge, that means one membership covers both ends of your day. Confirm the current branch access on your tier at reception when you join.',
  },
  {
    category: 'branches',
    question: 'Where exactly are the branches?',
    answer:
      'Branch one is on Budge Budge Trunk Road near Jagtala, Batanagar, Maheshtala 700141. The club is at Chandannagar, near Indian Chain Pvt Ltd and opposite Maheshtala College, Maheshtala 700139. Branch 3.0 is at Halder Para More, Shyampur, Budge Budge 700137. Every branch page has a map and a one-tap directions link.',
  },
  {
    category: 'training',
    question: 'I have never trained before. Will I be out of place?',
    answer:
      'Beginners get the most attention here, deliberately. Your first sessions are spent learning six movements with light weight rather than chasing numbers, and a trainer corrects your form on the floor instead of watching from the desk.',
  },
  {
    category: 'training',
    question: 'What is included in personal training?',
    answer:
      'A movement screen, a programme written for your body and your schedule, coaching on every lift, and a check-in that tracks whether it is working. Longer packages add macro-matched diet guidance, fortnightly measurements and support between sessions.',
  },
  {
    category: 'training',
    question: 'Do you provide a diet plan?',
    answer:
      'Yes — built from food your family already cooks. Rice, dal, fish, eggs and seasonal vegetables, adjusted in portion and timing for your goal. This is general guidance for healthy adults, not clinical nutrition therapy.',
  },
  {
    category: 'facilities',
    question: 'Is the gym air-conditioned?',
    answer:
      'Every training floor is fully air-conditioned, around the clock. Through a Kolkata summer that is the difference between finishing a session and cutting it short.',
  },
  {
    category: 'facilities',
    question: 'What equipment do you have?',
    answer:
      'Racks, benches, a full free-weight room and plate-loaded stations, plus a cardio deck, functional training space and a rig for CrossFit-style work. The Chandannagar club runs Jerai Club Line equipment; 3.0 at Budge Budge runs the Viva Kai Greene series.',
  },
  {
    category: 'facilities',
    question: 'Is there a separate area for MMA?',
    answer:
      'The Chandannagar club has a dedicated combat zone with heavy bags, pads and mat space, kept separate from the main lifting floor. It also houses the gaming lounge, salon and spa, and the healthy cafeteria.',
  },
  {
    category: 'facilities',
    question: 'Is the gym comfortable for women?',
    answer:
      'Yes. The floors are unisex, staffed at every hour, and 3.0 at Budge Budge is specifically set up as a women-friendly space. Members training alone in the early morning is routine here, not unusual.',
  },
  {
    category: 'health',
    question: 'I have a medical condition. Can I still train?',
    answer:
      'Very likely, but check with your doctor first and tell your trainer what they said. Bring any restrictions in writing. Trainers will programme around an injury or a condition — what they will not do is replace medical advice.',
  },
  {
    category: 'health',
    question: 'What if I get injured or feel unwell while training?',
    answer:
      'Stop, and tell whoever is on the floor. Staff are present at every hour, including overnight. If something hurts in a way that is not ordinary training soreness, we would rather you cut the session short and see a doctor.',
  },
];

export function faqsByCategory(category: FaqCategory): FaqEntry[] {
  return faqs.filter((entry) => entry.category === category);
}
