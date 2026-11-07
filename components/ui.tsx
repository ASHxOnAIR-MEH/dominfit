'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={reduced ? {} : { opacity: [0.7, 1], y: [22, 0] }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
export function Chapter({ number, children, light = false }: { number: string; children: ReactNode; light?: boolean }) {
  return <div className={`chapter ${light ? 'chapter-warm' : ''}`}><span>{number}</span><span className="chapter-line" />{children}</div>;
}
export function Brand({ footer = false }: { footer?: boolean }) {
  return <a href="#home" className={`brand ${footer ? 'brand-footer' : ''}`} aria-label="Domainfit home">domainfit<span>.</span></a>;
}
export function BookingButton({ onClick, children = 'Book free orientation', secondary = false, className = '' }: { onClick: () => void; children?: ReactNode; secondary?: boolean; className?: string }) {
  return <button type="button" className={`button ${secondary ? 'button-outline' : 'button-primary'} ${className}`} onClick={onClick}><span>{children}</span><ArrowUpRight size={18} aria-hidden="true" /></button>;
}
