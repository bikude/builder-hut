import { NextResponse } from 'next/server';

import { enquirySchema, enquiryToText } from '@/lib/validation';

/**
 * Enquiry endpoint.
 *
 * Behaviour is deliberately tiered so the site works the moment it is deployed and gets
 * better as the owner configures it:
 *
 *  - `FORM_ENDPOINT` set → the validated enquiry is forwarded there as JSON. Any service
 *    that accepts a JSON POST works: Formspree, Web3Forms, a Google Apps Script, a CRM.
 *  - not set → responds with `fallback: "whatsapp"`, and the browser opens WhatsApp with
 *    the enquiry pre-filled. Nothing is lost and no enquiry silently disappears.
 *
 * Payloads are re-validated here because the client-side check is only a convenience.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Send a JSON body.' }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Some details were not accepted.', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const endpoint = process.env.FORM_ENDPOINT;

  if (!endpoint) {
    return NextResponse.json({ ok: false, fallback: 'whatsapp', text: enquiryToText(parsed.data) }, { status: 200 });
  }

  try {
    const forwarded = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        ...parsed.data,
        summary: enquiryToText(parsed.data),
        receivedAt: new Date().toISOString(),
        source: 'abuilderhut.com',
      }),
      // Do not let a slow third party hold the request open.
      signal: AbortSignal.timeout(8000),
    });

    if (!forwarded.ok) {
      return NextResponse.json(
        { ok: false, fallback: 'whatsapp', text: enquiryToText(parsed.data) },
        { status: 200 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    // Network failure or timeout — hand the visitor the WhatsApp route rather than an error.
    return NextResponse.json({ ok: false, fallback: 'whatsapp', text: enquiryToText(parsed.data) }, { status: 200 });
  }
}
