'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Pause, Play, RotateCcw, Wind } from 'lucide-react';
import { Chapter, Reveal } from './ui';
import { HiggsfieldStage } from './higgsfield-stage';
import { Modal } from './modal';

const practices = [
  { title: 'Breathwork', heading: 'Come back to your breath.', copy: 'A gentle rhythm. A little space. Let your attention settle on the simple act of breathing.' },
  { title: 'Guided mindfulness', heading: 'Be here, for a moment.', copy: 'Notice the sounds around you, the ground beneath you, and how you feel. There is nothing to get right.' },
  { title: 'Evening wind-down', heading: 'Leave a little room for rest.', copy: 'Make a quiet transition out of a busy day, with an unhurried moment of awareness.' },
  { title: 'Deep relaxation', heading: 'Let your shoulders soften.', copy: 'Check in with your body, gently release tension, and give yourself permission to slow down.' },
];
function BreathingPause({ onClose }: { onClose: () => void }) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!playing || elapsed >= 60) return;
    const timer = setTimeout(() => { setElapsed(value => value + 1); if (elapsed >= 59) setPlaying(false); }, 1000);
    return () => clearTimeout(timer);
  }, [playing, elapsed]);
  const phase = elapsed % 10 < 4 ? 'Breathe in' : 'Breathe out';
  return <Modal title="A one-minute breathing pause" onClose={onClose} className="breath-modal"><span className="eyebrow">A MOMENT FOR YOU</span><h3>A little space to <em>breathe.</em></h3><p>Follow the rhythm, at your own pace.<br />Keep your breath comfortable and unforced.</p><div className={`breath-orb ${playing ? (elapsed % 10 < 4 ? 'inhale' : 'exhale') : ''}`}><span>{elapsed >= 60 ? 'Well done.' : playing ? phase : 'Begin gently'}</span></div><div className="breath-timer">{String(Math.floor((60 - elapsed) / 60)).padStart(2, '0')}:{String((60 - elapsed) % 60).padStart(2, '0')}</div><div className="breath-controls"><button className="button button-outline" onClick={() => { if (elapsed >= 60) setElapsed(0); setPlaying(!playing); }}>{playing ? <Pause size={16} /> : <Play size={16} />}{playing ? 'Pause' : elapsed >= 60 ? 'Begin again' : 'Start your pause'}</button><button className="icon-button" aria-label="Reset breathing timer" onClick={() => { setPlaying(false); setElapsed(0); }}><RotateCcw size={18} /></button></div></Modal>;
}
export function Sanctuary() {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => document.body.classList.toggle('sanctuary-active', entry.isIntersecting), { rootMargin: '-30% 0px -30% 0px' });
    if (section.current) observer.observe(section.current);
    return () => { observer.disconnect(); document.body.classList.remove('sanctuary-active'); };
  }, []);
  return <section id="sanctuary" className="sanctuary section" ref={section}>
    <HiggsfieldStage image="/media/meditation.webp" alt="A man seated peacefully in meditation, surrounded by warm amber light" className="meditation-stage" />
    <div className="container sanctuary-content"><Reveal><Chapter number="04" light>THE SPACE TO SLOW DOWN</Chapter><h2>Rest is part<br /><em>of the protocol.</em></h2><p className="section-copy">Strength is also knowing when to pause.<br />A weekly guided session to breathe, reconnect,<br className="desktop-break" /> and make a little room for yourself.</p></Reveal>
      <Reveal delay={0.1}><div className="practice-tabs" role="tablist" aria-label="Meditation practices">{practices.map((practice, index) => <button key={practice.title} role="tab" id={`practice-${index}`} aria-controls="practice-panel" aria-selected={active === index} tabIndex={active === index ? 0 : -1} onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const next = (active + (e.key === 'ArrowRight' ? 1 : -1) + practices.length) % practices.length; setActive(next); document.getElementById(`practice-${next}`)?.focus(); } }} onClick={() => setActive(index)}>{practice.title}</button>)}</div><div className="practice-panel" role="tabpanel" id="practice-panel" aria-labelledby={`practice-${active}`}><Wind size={22} /><div><h3>{practices[active].heading}</h3><p>{practices[active].copy}</p></div></div><button className="text-button warm-button" onClick={() => setOpen(true)}><span className="play-circle"><Play size={13} fill="currentColor" /></span>Try a one-minute pause<ArrowUpRight size={16} /></button></Reveal>
    </div><div className="sanctuary-caption"><span />A quieter mind. A more present you.</div>
    {open && <BreathingPause onClose={() => setOpen(false)} />}
  </section>;
}
