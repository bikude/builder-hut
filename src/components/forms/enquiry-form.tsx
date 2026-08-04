'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { branches } from '@/content/branches';
import { siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';
import { enquirySchema, goalOptions, intentOptions, type EnquiryInput } from '@/lib/validation';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/** Field-level error text. Rendered once, referenced by aria-describedby. */
function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-brand-blood">
      {message}
    </p>
  );
}

/**
 * Enquiry form.
 *
 * Submits to /api/contact. If no forwarding endpoint is configured on the server the
 * route replies with a WhatsApp fallback and the visitor is handed a pre-filled chat
 * instead of an error — so a freshly deployed site still captures every enquiry.
 */
export function EnquiryForm({
  defaultIntent = 'free-trial',
  className,
}: {
  defaultIntent?: EnquiryInput['intent'];
  className?: string;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      branch: branches[0]!.slug,
      goal: 'general-fitness',
      intent: defaultIntent,
      message: '',
      website: '',
    },
  });

  const onSubmit = async (values: EnquiryInput) => {
    setStatus('sending');
    setServerMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data: { ok?: boolean; fallback?: string; text?: string; error?: string } = await response.json();

      if (data.ok) {
        setStatus('sent');
        reset();
        return;
      }

      if (data.fallback === 'whatsapp' && data.text) {
        window.open(
          `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(data.text)}`,
          '_blank',
          'noopener,noreferrer',
        );
        setStatus('sent');
        setServerMessage('We opened WhatsApp with your details. Send the message and we will reply shortly.');
        reset();
        return;
      }

      setStatus('error');
      setServerMessage(data.error ?? 'Something went wrong. Please call us instead.');
    } catch {
      setStatus('error');
      setServerMessage('We could not reach the server. Please call or message us on WhatsApp.');
    }
  };

  if (status === 'sent') {
    return (
      <div className={cn('glass flex flex-col items-start gap-4 rounded-lg p-8', className)}>
        <CheckCircle2 className="size-8 text-emerald-400" aria-hidden="true" />
        <h3 className="font-display text-2xl uppercase tracking-tight">Enquiry received</h3>
        <p className="max-w-md leading-relaxed text-brand-smoke">
          {serverMessage ?? 'A trainer will call you back shortly. If it is urgent, ring the branch directly — the floor is staffed at every hour.'}
        </p>
        <Button type="button" variant="glass" size="sm" onClick={() => setStatus('idle')}>
          Send another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={cn('glass rounded-lg p-6 sm:p-8', className)}>
      {/* Honeypot. Positioned off-screen rather than display:none, which some bots skip. */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Full name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            {...register('name')}
          />
          <FieldError id="name-error" message={errors.name?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Mobile number</Label>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="98765 43210"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            {...register('phone')}
          />
          <FieldError id="phone-error" message={errors.phone?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          <FieldError id="email-error" message={errors.email?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="branch">Branch</Label>
          <select
            id="branch"
            className="h-12 w-full rounded-md border border-brand-chalk/12 bg-brand-forge/70 px-4 text-sm text-brand-chalk transition-colors hover:border-brand-chalk/25 focus:border-brand-bullion focus:outline-none"
            {...register('branch')}
          >
            {branches.map((branch) => (
              <option key={branch.slug} value={branch.slug} className="bg-brand-forge">
                {branch.name} — {branch.shortName}
              </option>
            ))}
          </select>
          <FieldError id="branch-error" message={errors.branch?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="goal">What do you want to work on?</Label>
          <select
            id="goal"
            className="h-12 w-full rounded-md border border-brand-chalk/12 bg-brand-forge/70 px-4 text-sm text-brand-chalk transition-colors hover:border-brand-chalk/25 focus:border-brand-bullion focus:outline-none"
            {...register('goal')}
          >
            {goalOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-brand-forge">
                {option.label}
              </option>
            ))}
          </select>
          <FieldError id="goal-error" message={errors.goal?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="intent">Enquiry about</Label>
          <select
            id="intent"
            className="h-12 w-full rounded-md border border-brand-chalk/12 bg-brand-forge/70 px-4 text-sm text-brand-chalk transition-colors hover:border-brand-chalk/25 focus:border-brand-bullion focus:outline-none"
            {...register('intent')}
          >
            {intentOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-brand-forge">
                {option.label}
              </option>
            ))}
          </select>
          <FieldError id="intent-error" message={errors.intent?.message} />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="message">Anything we should know? (optional)</Label>
          <Textarea
            id="message"
            placeholder="Injuries, preferred training time, questions about a plan…"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
            {...register('message')}
          />
          <FieldError id="message-error" message={errors.message?.message} />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <label htmlFor="consent" className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-brand-smoke">
          <input
            id="consent"
            type="checkbox"
            className="mt-1 size-4 shrink-0 accent-[#C9A227]"
            aria-invalid={Boolean(errors.consent)}
            {...register('consent')}
          />
          <span>
            You may call or message me about my enquiry. My details will be used to reply to it and nothing else.
          </span>
        </label>
        <FieldError id="consent-error" message={errors.consent?.message} />
      </div>

      {status === 'error' && serverMessage && (
        <p role="alert" className="mt-5 rounded-md border border-brand-blood/40 bg-brand-blood/10 p-4 text-sm text-brand-chalk">
          {serverMessage}
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Button type="submit" variant="bullion" size="lg" disabled={status === 'sending'}>
          {status === 'sending' ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              Sending
            </>
          ) : (
            <>
              <Send aria-hidden="true" />
              Send enquiry
            </>
          )}
        </Button>
        <Button asChild variant="glass" size="lg">
          <a
            href={`https://wa.me/${siteConfig.contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle aria-hidden="true" />
            WhatsApp instead
          </a>
        </Button>
      </div>
    </form>
  );
}
