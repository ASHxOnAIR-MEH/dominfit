'use client';
import { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Droplets, Flame, Footprints, Moon, RotateCcw, Sparkles } from 'lucide-react';
import { Chapter, Reveal } from './ui';
import { HiggsfieldStage } from './higgsfield-stage';

const habits = [
  { label: 'Make time to move', note: 'Your 35-minute session', streak: '14-day sample streak', icon: Footprints },
  { label: 'Keep hydration close', note: 'Your personal daily target', streak: '10-day sample streak', icon: Droplets },
  { label: 'Find a quiet moment', note: '5 minutes just for you', streak: '', icon: Sparkles },
  { label: 'Ease into the evening', note: 'A little less screen time', streak: '', icon: Moon },
];
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function eventFor(day: number, month: number, year: number) {
  const weekday = new Date(Date.UTC(year, month, day)).getUTCDay();
  if (day === 12 || day === 26) return { type: 'review', title: 'A conversation with your coach', time: '5:30 PM · Sample follow-up' };
  if (weekday === 0) return { type: 'rest', title: 'Make room for rest', time: 'An open day, at your pace' };
  if (weekday === 6) return { type: 'meditate', title: 'Weekly guided meditation', time: '8:00 AM · Sample session' };
  return { type: 'movement', title: 'Your daily movement', time: '7:00 AM · 35-minute sample session' };
}
export function HabitExperience() {
  const [tab, setTab] = useState('habits');
  const [checked, setChecked] = useState([true, true, false, false]);
  const [month, setMonth] = useState(10);
  const [year, setYear] = useState(2026);
  const [day, setDay] = useState(12);
  const count = checked.filter(Boolean).length;
  const completion = count * 25;
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const offset = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const event = eventFor(day, month, year);
  function shiftMonth(direction: number) { const next = new Date(Date.UTC(year, month + direction, 1)); setMonth(next.getUTCMonth()); setYear(next.getUTCFullYear()); setDay(1); }
  return <section id="consistency" className="section habits-section"><div className="container two-column"><Reveal className="habit-copy"><Chapter number="06">YOUR EVERYDAY, ELEVATED</Chapter><h2>Small actions.<br /><em>Lasting change.</em></h2><p className="section-copy">Wellbeing happens between the big moments. Build a rhythm with simple habits, thoughtful check-ins, and a clear view of your progress.</p><div className="habit-note"><span className="little-line" /><p>A little more consistent.<br />A little more <em>you.</em></p></div><span className="sample-label">INTERACTIVE PREVIEW · SAMPLE DATA</span></Reveal>
    <Reveal className="experience-card" delay={0.1}><div className="experience-top"><span className="mini-brand">Domainfit<span>.</span></span><span className="live-dot" aria-hidden="true" /></div><div className={`experience-photo ${tab === 'habits' ? 'habit-photo' : 'calendar-photo'}`}><HiggsfieldStage image={tab === 'habits' ? '/media/habits.webp' : '/media/calendar.webp'} alt={tab === 'habits' ? 'A man checking a simple daily habit board' : 'A coach and client reviewing a weekly calendar together'} sizes="(max-width: 760px) 90vw, 38vw" /><span>{tab === 'habits' ? 'CONSISTENCY, AT YOUR PACE' : 'CHECK IN · REFLECT · ADJUST'}</span></div><div className="experience-tabs" role="tablist" aria-label="Member experience"><button id="habit-tab" role="tab" aria-selected={tab === 'habits'} aria-controls="habit-panel" onClick={() => setTab('habits')}>Habit tracker</button><button id="calendar-tab" role="tab" aria-selected={tab === 'calendar'} aria-controls="calendar-panel" onClick={() => setTab('calendar')}>Your calendar</button></div>
    {tab === 'habits' ? <div role="tabpanel" id="habit-panel" aria-labelledby="habit-tab" className="habit-panel"><div className="habit-progress"><div><span className="small-muted">ONE GOOD DAY AT A TIME</span><h3>Your daily rhythm</h3><p aria-live="polite">{count === 4 ? 'A little win worth noticing.' : `${count} of 4 habits complete. Keep it going.`}</p></div><div className="progress-ring" style={{ '--progress': `${completion}%` } as React.CSSProperties}><span>{completion}<small>%</small></span></div></div><div className="habit-checklist">{habits.map((habit, index) => <label key={habit.label} className={`habit-row ${checked[index] ? 'done' : ''}`}><input type="checkbox" checked={checked[index]} onChange={() => setChecked(current => current.map((value, i) => i === index ? !value : value))} /><span className="habit-icon"><habit.icon size={19} /></span><span className="habit-row-copy"><strong>{habit.label}</strong><small>{habit.note}</small></span><span className="custom-check">{checked[index] && <Check size={14} />}</span></label>)}</div><div className="habit-bottom"><span><Flame size={15} />14-day sample movement streak</span><button aria-label="Reset sample habits" onClick={() => setChecked([false, false, false, false])}><RotateCcw size={14} />Reset</button></div></div> : <div role="tabpanel" id="calendar-panel" aria-labelledby="calendar-tab" className="calendar-panel"><div className="calendar-heading"><h3>{monthNames[month]} <span>{year}</span></h3><div><button className="icon-button" aria-label="Previous month" onClick={() => shiftMonth(-1)}><ChevronLeft size={18} /></button><button className="icon-button" aria-label="Next month" onClick={() => shiftMonth(1)}><ChevronRight size={18} /></button></div></div><div className="calendar-grid">{['M','T','W','T','F','S','S'].map((name, i) => <span key={`weekday-${i}`} className="weekday" aria-label={['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i]}>{name}</span>)}{Array.from({ length: offset }, (_, i) => <span key={`empty-${i}`} />)}{Array.from({ length: days }, (_, i) => { const date = i + 1; const info = eventFor(date, month, year); return <button key={date} className={`calendar-day ${info.type} ${date === day ? 'selected' : ''}`} aria-pressed={date === day} aria-label={`${monthNames[month]} ${date}, ${year}: ${info.title}`} onClick={() => setDay(date)}>{date}<i /></button>; })}</div><div className="calendar-legend"><span><i className="movement" />Movement</span><span><i className="meditate" />Meditation</span><span><i className="review" />Check-in</span></div><div className={`calendar-detail ${event.type}`} aria-live="polite"><span>{String(day).padStart(2, '0')}</span><div><strong>{event.title}</strong><small>{event.time}</small></div></div></div>}
    </Reveal></div></section>;
}
