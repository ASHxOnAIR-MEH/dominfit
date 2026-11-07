import { NextResponse } from 'next/server';
import { validateBooking, type BookingData } from '@/lib/booking';
export async function POST(request: Request) {
  if (request.headers.get('sec-fetch-site') === 'cross-site') return NextResponse.json({ error: 'This request could not be verified.' }, { status: 403 });
  if (!(request.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) return NextResponse.json({ error: 'Please send this request in a supported format.' }, { status: 415 });
  if (Number(request.headers.get('content-length') ?? 0) > 8000) return NextResponse.json({ error: 'Request is too large.' }, { status: 413 });
  let data: BookingData;
  try {
    const raw = await request.text();
    if (raw.length > 8000) return NextResponse.json({ error: 'Request is too large.' }, { status: 413 });
    const input = JSON.parse(raw);
    if (!input || ['name', 'phone', 'goal', 'date', 'slot', 'plan'].some(key => typeof input[key] !== 'string') || typeof input.consent !== 'boolean') throw new Error('Invalid fields');
    data = { name: input.name.trim(), phone: input.phone.trim(), goal: input.goal, date: input.date, slot: input.slot, plan: input.plan, consent: input.consent };
  } catch { return NextResponse.json({ error: 'Please check your details and try again.' }, { status: 400 }); }
  const errors = validateBooking(data);
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });
  const webhook = process.env.ORIENTATION_WEBHOOK_URL;
  if (!webhook) return NextResponse.json({ mode: 'preview' });
  try {
    const endpoint = new URL(webhook);
    const local = ['localhost', '127.0.0.1', '::1'].includes(endpoint.hostname);
    if (endpoint.protocol !== 'https:' && !(local && endpoint.protocol === 'http:')) return NextResponse.json({ error: 'The booking service needs a secure endpoint.' }, { status: 500 });
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(process.env.ORIENTATION_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.ORIENTATION_WEBHOOK_TOKEN}` } : {}) }, body: JSON.stringify({ ...data, timezone: 'Asia/Kolkata', source: 'domainfit-website', requestedAt: new Date().toISOString() }), signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Delivery failed');
    return NextResponse.json({ mode: 'received' });
  } catch { return NextResponse.json({ error: 'We couldn’t send your request just now. Your details are still here; please try again.' }, { status: 502 }); }
}
