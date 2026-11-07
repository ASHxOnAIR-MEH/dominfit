'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Points } from 'three';

function Particles() {
  const points = useRef<Points>(null);
  const pointer = useRef({ x: 0, y: 0, velocity: 0, scroll: 0 });
  const positions = useMemo(() => {
    const array = new Float32Array(180 * 3);
    for (let i = 0; i < array.length; i++) array[i] = (Math.sin(i * 127.1 + 311.7) * 43758.5453 % 1) * 6;
    return array;
  }, []);
  useEffect(() => {
    const move = (event: PointerEvent) => { pointer.current.x = event.clientX / innerWidth - 0.5; pointer.current.y = event.clientY / innerHeight - 0.5; };
    const scroll = () => { pointer.current.velocity = Math.min(0.015, Math.abs(scrollY - pointer.current.scroll) * 0.0002); pointer.current.scroll = scrollY; };
    addEventListener('pointermove', move, { passive: true });
    addEventListener('scroll', scroll, { passive: true });
    return () => { removeEventListener('pointermove', move); removeEventListener('scroll', scroll); };
  }, []);
  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.y += Math.min(delta, 0.05) * 0.025 + pointer.current.velocity;
    points.current.rotation.x += (pointer.current.y * 0.08 - points.current.rotation.x) * 0.015;
    points.current.position.x += (pointer.current.x * 0.25 - points.current.position.x) * 0.02;
    pointer.current.velocity *= 0.93;
  });
  return <points ref={points}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color="#739cff" size={0.018} transparent opacity={0.55} sizeAttenuation depthWrite={false} /></points>;
}
class AuraBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}
export default function ParticleAura({ paused }: { paused: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [capable, setCapable] = useState(false);
  useEffect(() => {
    const preference = matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)');
    const update = () => { const canvas = document.createElement('canvas'); setCapable(preference.matches && Boolean(canvas.getContext('webgl2'))); };
    update(); preference.addEventListener('change', update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (container.current) observer.observe(container.current);
    const visibility = () => { if (document.hidden) setVisible(false); else if (container.current) setVisible(container.current.getBoundingClientRect().bottom > 0); };
    document.addEventListener('visibilitychange', visibility);
    return () => { preference.removeEventListener('change', update); observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  return <div className="particle-aura" ref={container} aria-hidden="true">{capable && <AuraBoundary><Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 7] }} frameloop={visible && !paused ? 'always' : 'never'} gl={{ alpha: true, antialias: false }}><Particles /></Canvas></AuraBoundary>}</div>;
}
