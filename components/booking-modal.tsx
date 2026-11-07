'use client';
import { useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCheck, Clock3, LoaderCircle, ShieldCheck } from 'lucide-react';
import { Modal } from './modal';
import { goals, plans, slots, todayInIndia, validateBooking, type BookingData } from '@/lib/booking';

export function BookingModal({ onClose, plan, enabled }: { onClose: () => void; plan: string; enabled: boolean }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<BookingData>({ name: '', phone: '+91 ', goal: '', date: '', slot: '', plan: plan || 'Not sure yet', consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<'preview' | 'received' | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  function change(key: keyof BookingData, value: string | boolean) { setData(current => ({ ...current, [key]: value })); setErrors(current => ({ ...current, [key]: '' })); }
  function focusStep() { requestAnimationFrame(() => heading.current?.focus()); }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending) return;
    const found = validateBooking(data, step);
    setErrors(found);
    if (Object.keys(found).length) { requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()); return; }
    if (step < 2) { setStep(step + 1); focusStep(); return; }
    setPending(true);
    try {
      const response = await fetch('/api/orientation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: AbortSignal.timeout(15000) });
      const body = await response.json();
      if (!response.ok) { setErrors(body.errors || { general: body.error || 'Something went wrong. Please try again.' }); return; }
      setResult(body.mode); focusStep();
    } catch { setErrors({ general: 'We couldn’t connect. Please try again; your details are still here.' }); }
    finally { setPending(false); }
  }
  const min = new Date(`${todayInIndia()}T00:00:00Z`); min.setUTCDate(min.getUTCDate() + 1);
  const max = new Date(`${todayInIndia()}T00:00:00Z`); max.setUTCDate(max.getUTCDate() + 60);
  return <Modal title="Your free orientation" onClose={onClose} className="booking-modal">
    <div className="modal-eyebrow"><span className="status-dot" />YOUR NEXT CHAPTER</div>
    {result ? <div className="booking-result"><div className="result-icon"><CheckCheck size={32} /></div><h3 tabIndex={-1} ref={heading}>{result === 'received' ? 'A good first step.' : 'Your next step, imagined.'}</h3><p>{result === 'received' ? 'Your orientation request has been received. The team will contact you to confirm a time.' : 'This is a booking preview. Your details haven’t been submitted and no appointment has been reserved.'}</p><div className="request-summary"><span>{data.name}</span><strong>{data.goal}</strong><span>{new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${data.date}T12:00:00Z`))} · {data.slot}</span><small>Preferred time · India Standard Time</small></div><button className="button button-primary" onClick={onClose}>Back to the experience <ArrowRight size={18} /></button></div> : <>
      <h3 className="booking-heading" tabIndex={-1} ref={heading}>{['Let’s start with you.', 'What brings you here?', 'Make a little space.'][step]}</h3>
      <p className="booking-subtitle">A 15-minute conversation. A clearer way forward.</p>
      {!enabled && <p className="preview-notice">Booking preview · No appointment will be reserved.</p>}
      <div className="booking-progress" aria-label={`Step ${step + 1} of 3`}>{['You', 'Your goal', 'Your time'].map((label, index) => <div key={label} className={index <= step ? 'current' : ''}><span>{index < step ? <Check size={12} /> : `0${index + 1}`}</span>{label}</div>)}</div>
      <form ref={form} onSubmit={submit} noValidate>
        {step === 0 && <div className="form-fields"><label htmlFor="booking-name">Your name<input id="booking-name" autoComplete="name" placeholder="What should we call you?" value={data.name} onChange={e => change('name', e.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'error-name' : undefined} maxLength={100} required /></label>{errors.name && <p id="error-name" className="field-error">{errors.name}</p>}<label htmlFor="booking-phone">Phone number<input id="booking-phone" type="tel" autoComplete="tel" value={data.phone} onChange={e => change('phone', e.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'error-phone' : 'phone-help'} required maxLength={30} /></label><small id="phone-help">Include your country code so we can reach you.</small>{errors.phone && <p id="error-phone" className="field-error">{errors.phone}</p>}</div>}
        {step === 1 && <div className="form-fields"><fieldset aria-invalid={Boolean(errors.goal)} aria-describedby={errors.goal ? 'error-goal' : undefined}><legend>Choose your main goal</legend><div className="goal-options">{goals.map(goal => <label key={goal} className={data.goal === goal ? 'selected' : ''}><input type="radio" name="goal" value={goal} checked={data.goal === goal} onChange={() => change('goal', goal)} />{goal}{data.goal === goal && <Check size={16} />}</label>)}</div></fieldset>{errors.goal && <p id="error-goal" className="field-error">{errors.goal}</p>}<label htmlFor="booking-plan">Membership preference<select id="booking-plan" value={data.plan} onChange={e => change('plan', e.target.value)}>{plans.map(value => <option key={value}>{value}</option>)}</select></label></div>}
        {step === 2 && <div className="form-fields"><label htmlFor="booking-date">Preferred date<input id="booking-date" type="date" min={min.toISOString().slice(0, 10)} max={max.toISOString().slice(0, 10)} value={data.date} onChange={e => change('date', e.target.value)} aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? 'error-date' : undefined} required /></label>{errors.date && <p id="error-date" className="field-error">{errors.date}</p>}<label htmlFor="booking-slot">Preferred time window<select id="booking-slot" value={data.slot} onChange={e => change('slot', e.target.value)} aria-invalid={Boolean(errors.slot)} aria-describedby={errors.slot ? 'error-slot' : undefined} required><option value="">Choose a time</option>{slots.map(slot => <option key={slot}>{slot}</option>)}</select></label>{errors.slot && <p id="error-slot" className="field-error">{errors.slot}</p>}<small className="time-zone"><Clock3 size={14} /> India Standard Time (UTC+5:30). Subject to confirmation.</small><label className="consent"><input type="checkbox" checked={data.consent} onChange={e => change('consent', e.target.checked)} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? 'error-consent' : undefined} />You may contact me about this orientation request.</label>{errors.consent && <p id="error-consent" className="field-error">{errors.consent}</p>}</div>}
        {errors.general && <p role="alert" className="field-error">{errors.general}</p>}
        <div className="booking-actions">{step > 0 && <button type="button" className="text-button" disabled={pending} onClick={() => { setStep(step - 1); setErrors({}); focusStep(); }}><ArrowLeft size={16} />Back</button>}<button type="submit" className="button button-primary" disabled={pending}>{pending ? 'Sending…' : step === 2 ? enabled ? 'Request my orientation' : 'Preview my request' : 'Continue'}{pending ? <LoaderCircle size={18} className="spin" /> : <ArrowRight size={18} />}</button></div>
        <p className="form-reassurance"><ShieldCheck size={14} />{enabled ? 'Your details are used to respond to this request.' : 'Preview details are not stored or sent to Domainfit.'}</p>
      </form>
    </>}
  </Modal>;
}
