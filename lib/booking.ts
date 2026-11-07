export const goals = ['Build strength', 'Improve fitness', 'Manage weight', 'Move more comfortably', 'Find balance', 'Explore my options'] as const;
export const slots = ['7:00–9:00 AM', '10:00 AM–12:00 PM', '2:00–4:00 PM', '5:00–7:00 PM'] as const;
export const plans = ['Not sure yet', 'Elegance', 'Prime', 'Advanced'] as const;
export type BookingData = { name: string; phone: string; goal: string; date: string; slot: string; plan: string; consent: boolean };
export function todayInIndia() { return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Kolkata' }).format(new Date()); }
export function validateBooking(data: BookingData, step?: number): Record<string, string> {
  const errors: Record<string, string> = {};
  if (step === undefined || step === 0) {
    if (!data.name.trim() || data.name.trim().length > 100) errors.name = 'Please enter your name (up to 100 characters).';
    if (!/^[+()\d\s-]+$/.test(data.phone) || data.phone.replace(/\D/g, '').length < 7 || data.phone.replace(/\D/g, '').length > 15) errors.phone = 'Enter a valid phone number, including your country code.';
  }
  if (step === undefined || step === 1) {
    if (!(goals as readonly string[]).includes(data.goal)) errors.goal = 'Choose the goal that feels right for you.';
    if (!(plans as readonly string[]).includes(data.plan)) errors.plan = 'Please choose a membership preference.';
  }
  if (step === undefined || step === 2) {
    const parsed = new Date(`${data.date}T00:00:00Z`);
    const valid = /^\d{4}-\d{2}-\d{2}$/.test(data.date) && !isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === data.date;
    const latest = new Date(`${todayInIndia()}T00:00:00Z`); latest.setUTCDate(latest.getUTCDate() + 60);
    if (!valid || data.date <= todayInIndia() || data.date > latest.toISOString().slice(0, 10)) errors.date = 'Choose a date from tomorrow to 60 days ahead.';
    if (!(slots as readonly string[]).includes(data.slot)) errors.slot = 'Choose your preferred time window.';
    if (!data.consent) errors.consent = 'Please confirm we may contact you about your orientation.';
  }
  return errors;
}
