import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from '../components/StatusBar';
import { ArrowLeft, Check } from 'lucide-react';
import { useNav } from '../context/TransitionContext';
import gsap from 'gsap';

/* ── Entire flat options ── */
const ENTIRE_TYPES = [
  { id: '1rk',    label: '1 RK',    icon: '🏠' },
  { id: '1bhk',   label: '1 BHK',   icon: '🛏' },
  { id: '2bhk',   label: '2 BHK',   icon: '🛏' },
  { id: '3bhk',   label: '3 BHK',   icon: '🏡' },
  { id: '3bhk+',  label: '3+ BHK',  icon: '🏰' },
  { id: 'studio', label: 'Studio',   icon: '✨' },
];

/* ── Room / shared options ── */
const ROOM_TYPES = [
  { id: 'private',  label: 'Private Room',  icon: '🚪', hint: 'Your own room, shared kitchen & bath' },
  { id: 'shared',   label: 'Shared Room',   icon: '👥', hint: 'Split a room with a flatmate' },
  { id: 'pg',       label: 'PG / Hostel',   icon: '🏘️', hint: 'Paying guest, meals often included' },
  { id: 'flatmate', label: 'Join a Flat',   icon: '🤝', hint: 'Move into an existing flat as flatmate' },
];

type Mode = 'entire' | 'room';

export function FlatTypeScreen() {
  const { go, goBack } = useNav();
  const [mode, setMode]       = useState<Mode>('entire');
  const [selected, setSelected] = useState<string[]>(['2bhk']);
  const gridRef    = useRef<HTMLDivElement>(null);
  const segmentRef = useRef<HTMLDivElement>(null);
  const thumbRef   = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);

  /* Initial stagger-in */
  useEffect(() => {
    animateGridIn(0.05);
    isFirstMount.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function animateGridIn(delay = 0) {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll<HTMLElement>('.type-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 22, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 0.32, stagger: 0.06, delay, ease: 'power3.out' }
    );
  }

  function animateGridOut(then: () => void) {
    if (!gridRef.current) { then(); return; }
    const cards = gridRef.current.querySelectorAll<HTMLElement>('.type-card');
    gsap.to(cards, {
      opacity: 0, y: -14, scale: 0.96, duration: 0.18, stagger: 0.03, ease: 'power2.in',
      onComplete: then,
    });
  }

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    animateGridOut(() => {
      setMode(next);
      setSelected(next === 'entire' ? ['2bhk'] : ['private']);
      // grid will re-render → animate in
      requestAnimationFrame(() => requestAnimationFrame(() => animateGridIn(0)));
    });

    // Slide the thumb on the segmented control
    if (thumbRef.current && segmentRef.current) {
      const segW = segmentRef.current.offsetWidth;
      gsap.to(thumbRef.current, {
        x: next === 'entire' ? 0 : segW / 2 - 4,
        duration: 0.24,
        ease: 'power2.inOut',
      });
    }
  };

  const toggle = (id: string, el: HTMLElement) => {
    const wasSelected = selected.includes(id);
    gsap.timeline()
      .to(el, { scale: wasSelected ? 0.96 : 0.94, duration: 0.08 })
      .to(el, { scale: 1, duration: 0.22, ease: 'back.out(2.5)' });
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const currentTypes = mode === 'entire' ? ENTIRE_TYPES : ROOM_TYPES;
  const allTypes     = [...ENTIRE_TYPES, ...ROOM_TYPES];

  return (
    <div className="bg-[#efefef] w-full h-full flex flex-col relative">
      <StatusBar />

      <div className="flex-1 flex flex-col px-4 pt-2 pb-6 overflow-y-auto hide-scrollbar">
        {/* Progress */}
        <div className="w-full h-2 bg-[rgba(143,143,143,0.2)] rounded-full mb-6 shrink-0">
          <div className="h-full bg-[#3a77ff] rounded-full" style={{ width: '40%' }} />
        </div>

        <div className="flex flex-col gap-5 flex-1">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <button className="p-1 -ml-1 w-fit rounded-full hover:bg-black/5" onClick={goBack}>
              <ArrowLeft size={24} className="text-[#1c1b1f]" />
            </button>
            <div>
              <h1 className="text-[20px] font-semibold leading-[32px] text-black">
                {mode === 'entire' ? 'What type of flat?' : 'What kind of room?'}
              </h1>
              <p className="text-[14px] font-medium leading-[20px] text-[#8f8f8f]">Select all that you're open to</p>
            </div>
          </div>

          {/* ── Segmented mode switcher ── */}
          <div
            ref={segmentRef}
            className="relative flex bg-white rounded-[14px] p-1 shadow-[0_2px_10px_rgba(0,0,0,0.08)] border border-black/6"
            style={{ height: 46 }}
          >
            {/* Sliding thumb */}
            <div
              ref={thumbRef}
              className="absolute top-1 bottom-1 rounded-[10px] bg-[#3a77ff] shadow-[0_2px_10px_rgba(58,119,255,0.28)]"
              style={{ width: 'calc(50% - 4px)', left: 4, willChange: 'transform' }}
            />
            {/* Labels */}
            {([
              { key: 'entire', label: 'Entire Flat', emoji: '🏠' },
              { key: 'room',   label: 'Room / Shared', emoji: '🚪' },
            ] as { key: Mode; label: string; emoji: string }[]).map(seg => (
              <button
                key={seg.key}
                className="relative z-10 flex-1 flex items-center justify-center gap-1.5 transition-colors duration-200"
                onClick={() => switchMode(seg.key)}
              >
                <span className="text-[13px]">{seg.emoji}</span>
                <span
                  className="text-[13px] font-semibold transition-colors duration-200"
                  style={{ color: mode === seg.key ? '#fff' : '#8f8f8f' }}
                >
                  {seg.label}
                </span>
              </button>
            ))}
          </div>

          {/* ── Type grid ── */}
          <div ref={gridRef} className="grid grid-cols-2 gap-3">
            {currentTypes.map(type => {
              const isSelected = selected.includes(type.id);
              return (
                <button
                  key={type.id}
                  className={`type-card relative flex flex-col items-start p-4 rounded-[16px] border text-left transition-colors ${
                    isSelected
                      ? 'bg-[#3a77ff]/10 border-[#3a77ff] shadow-[0_2px_14px_rgba(58,119,255,0.16)]'
                      : 'bg-white border-black/8 shadow-[0_2px_8px_rgba(0,0,0,0.05)]'
                  }`}
                  style={{ willChange: 'transform' }}
                  onClick={e => toggle(type.id, e.currentTarget as HTMLElement)}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-[#3a77ff] rounded-full flex items-center justify-center">
                      <Check size={11} color="white" />
                    </div>
                  )}
                  <span className="text-2xl mb-2">{type.icon}</span>
                  <span className={`text-[15px] font-semibold leading-tight ${isSelected ? 'text-[#3a77ff]' : 'text-black'}`}>
                    {type.label}
                  </span>
                  {'hint' in type && (
                    <span className="text-[11px] font-medium text-[#aaa] mt-1 leading-snug">
                      {(type as typeof ROOM_TYPES[0]).hint}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selection summary */}
          {selected.length > 0 && (
            <div className="bg-white/70 rounded-[12px] px-4 py-3 border border-black/8">
              <p className="text-[12px] font-medium text-[#555]">
                Selected:{' '}
                <span className="text-[#3a77ff] font-semibold">
                  {selected
                    .map(s => allTypes.find(t => t.id === s)?.label)
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 shrink-0">
          <button
            disabled={selected.length === 0}
            className={`w-full text-white rounded-[12px] py-3.5 text-[16px] font-medium transition-all ${
              selected.length > 0
                ? 'bg-[#3a77ff] shadow-[0_4px_14px_rgba(58,119,255,0.35)] active:scale-[0.98]'
                : 'bg-[#3a77ff]/35'
            }`}
            onClick={() => go('/amenities')}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
