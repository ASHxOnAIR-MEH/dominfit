'use client';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
export function Modal({ title, children, onClose, className = '' }: { title: string; children: ReactNode; onClose: () => void; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const element = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <dialog ref={ref} aria-labelledby={titleId} className={`modal ${className}`} onClose={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="modal-inner"><button type="button" className="icon-button modal-close" onClick={onClose} aria-label="Close dialog"><X size={21} /></button><h2 id={titleId} className="sr-only">{title}</h2>{children}</div></dialog>;
}
