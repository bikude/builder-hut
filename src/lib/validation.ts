import { z } from 'zod';

import { branches } from '@/content/branches';

const branchSlugs = branches.map((branch) => branch.slug) as [string, ...string[]];

/**
 * One schema, used by the browser form and by the API route.
 *
 * Client-side validation is a convenience; the route re-validates because anything can
 * POST to it. Keeping a single definition means the two can never drift apart.
 */
export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your name.')
    .max(80, 'That name is longer than we can store.'),
  phone: z
    .string()
    .trim()
    // Accepts 9876543210, +91 98765 43210, 098765-43210.
    .regex(/^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/, 'Enter a 10-digit Indian mobile number.'),
  email: z.string().trim().email('Enter a valid email address.').max(120).optional().or(z.literal('')),
  branch: z.enum(branchSlugs, { errorMap: () => ({ message: 'Choose the branch you want to train at.' }) }),
  goal: z.enum(['weight-loss', 'muscle-gain', 'general-fitness', 'mma', 'personal-training'], {
    errorMap: () => ({ message: 'Choose what you want to work on.' }),
  }),
  intent: z.enum(['free-trial', 'membership', 'personal-training', 'general']),
  message: z.string().trim().max(1000, 'Please keep this under 1000 characters.').optional().or(z.literal('')),
  /** Hidden field. Real people leave it empty; most bots fill everything. */
  website: z.string().max(0, 'Submission rejected.').optional().or(z.literal('')),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'We need your permission to contact you back.' }),
  }),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const goalOptions: Array<{ value: EnquiryInput['goal']; label: string }> = [
  { value: 'weight-loss', label: 'Weight loss' },
  { value: 'muscle-gain', label: 'Muscle gain' },
  { value: 'general-fitness', label: 'General fitness' },
  { value: 'mma', label: 'MMA & combat' },
  { value: 'personal-training', label: 'Personal training' },
];

export const intentOptions: Array<{ value: EnquiryInput['intent']; label: string }> = [
  { value: 'free-trial', label: 'Book a free trial' },
  { value: 'membership', label: 'Membership & pricing' },
  { value: 'personal-training', label: 'Personal training' },
  { value: 'general', label: 'Something else' },
];

/** Human-readable summary used for the WhatsApp fallback and the forwarded payload. */
export function enquiryToText(input: EnquiryInput): string {
  const branchName = branches.find((branch) => branch.slug === input.branch)?.name ?? input.branch;
  const goal = goalOptions.find((option) => option.value === input.goal)?.label ?? input.goal;
  const intent = intentOptions.find((option) => option.value === input.intent)?.label ?? input.intent;

  return [
    `New enquiry from the website`,
    ``,
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    input.email ? `Email: ${input.email}` : null,
    `Branch: ${branchName}`,
    `Goal: ${goal}`,
    `Enquiry: ${intent}`,
    input.message ? `` : null,
    input.message ? `Message: ${input.message}` : null,
  ]
    .filter((line) => line !== null)
    .join('\n');
}
