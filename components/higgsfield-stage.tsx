'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export function HiggsfieldStage({ image, alt, className = '', priority = false, video, sizes = '(max-width: 760px) 100vw, 60vw' }: { image: string; alt: string; className?: string; priority?: boolean; video?: { mp4: string; webm: string }; sizes?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element || !video) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let inView = false;
    const syncPlayback = () => {
      if (inView && !preference.matches && !document.hidden && !document.body.classList.contains('motion-paused')) element.play().catch(() => {});
      else element.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; syncPlayback(); }, { threshold: 0.1 });
    observer.observe(element);
    const classObserver = new MutationObserver(syncPlayback);
    classObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('visibilitychange', syncPlayback);
    preference.addEventListener('change', syncPlayback);
    return () => { observer.disconnect(); classObserver.disconnect(); element.pause(); document.removeEventListener('visibilitychange', syncPlayback); preference.removeEventListener('change', syncPlayback); };
  }, [video]);
  return <div className={`stage ${className}`}>
    {imageFailed ? <div className="stage-fallback" role="img" aria-label={alt}><span>df.</span></div> : <Image src={image} alt={alt} fill sizes={sizes} priority={priority} quality={85} onError={() => setImageFailed(true)} />}
    {video && !failed && <video ref={ref} muted playsInline loop preload="none" poster={image} aria-label={alt} onError={() => setFailed(true)}><source src={video.webm} type="video/webm" /><source src={video.mp4} type="video/mp4" onError={() => setFailed(true)} /></video>}
  </div>;
}
