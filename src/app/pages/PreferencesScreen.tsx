import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StatusBar } from '../components/StatusBar';
import { ArrowLeft, Check } from 'lucide-react';
import { useNav } from '../context/TransitionContext';
import gsap from 'gsap';

type OptionItem = { id: string; label: string };

const SOCIETY_TYPES: OptionItem[] = [
  { id: 'gated',      label: '🏘️ Gated Society' },
  { id: 'standalone', label: '🏢 Standalone Building' },
  { id: 'any',        label: '🔀 Any' },
];
const MOVE_IN: OptionItem[] = [
  { id: 'immediate', label: '⚡ Immediately' },
  { id: '1month',    label: '📅 In 1 Month' },
  { id: '3months',   label: '🗓️ In 3 Months' },
  { id: 'flexible',  label: '🌊 Flexible' },
];

const LOADER_LINES = [
  'Finding flats…',
  'Matching your budget',
  'Checking verified photos',
  'Scanning for zero brokerage',
  'Picking the best for you',
  'Almost there!',
];

function OptionRow({ label, options, value, onChange }: {
  label: string;
  options: OptionItem[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] font-semibold text-black">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-[12px] font-medium border transition-all ${
                active
                  ? 'bg-[#3a77ff]/10 border-[#3a77ff] text-[#3a77ff]'
                  : 'bg-[#f7f7f7] border-black/8 text-black'
              }`}
            >
              {active && <Check size={11} className="text-[#3a77ff] shrink-0" />}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Zomato-style full-screen loader ── */
function FlatFinder({ onDone }: { onDone: () => void }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const textRef   = useRef<HTMLParagraphElement>(null);
  const ringRef   = useRef<HTMLDivElement>(null);
  const iconRef   = useRef<HTMLDivElement>(null);
  const doneRef   = useRef(false);

  /* Spin ring */
  useEffect(() => {
    if (!ringRef.current) return;
    const tween = gsap.to(ringRef.current, {
      rotation: 360,
      duration: 1.1,
      ease: 'none',
      repeat: -1,
    });
    return () => { tween.kill(); };
  }, []);

  /* Pulse icon */
  useEffect(() => {
    if (!iconRef.current) return;
    const tween = gsap.to(iconRef.current, {
      scale: 1.12,
      duration: 0.7,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    return () => { tween.kill(); };
  }, []);

  /* Cycle text */
  const advance = useCallback(() => {
    if (!textRef.current) return;
    gsap.to(textRef.current, {
      opacity: 0, y: -10, duration: 0.22, ease: 'power2.in',
      onComplete: () => {
        setLineIdx(i => {
          const next = i + 1;
          if (next >= LOADER_LINES.length && !doneRef.current) {
            doneRef.current = true;
            setTimeout(() => {
              setVisible(false);
              onDone();
            }, 400);
            return i;
          }
          return next % LOADER_LINES.length;
        });
        if (textRef.current) {
          gsap.fromTo(textRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.26, ease: 'power2.out' }
          );
        }
      },
    });
  }, [onDone]);

  useEffect(() => {
    const t = setInterval(advance, 620);
    return () => clearInterval(t);
  }, [advance]);

  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(160deg,#f0f5ff 0%,#ffffff 60%,#f5f0ff 100%)' }}
    >
      {/* Spinning ring + icon */}
      <div className="relative flex items-center justify-center mb-8" style={{ width: 96, height: 96 }}>
        {/* Outer dashed ring */}
        <div
          ref={ringRef}
          className="absolute inset-0 rounded-full"
          style={{
            border: '3px solid transparent',
            borderTopColor: '#3a77ff',
            borderRightColor: '#a78bfa',
          }}
        />
        {/* Inner solid ring */}
        <div
          className="absolute rounded-full"
          style={{
            inset: 8,
            border: '2px solid rgba(58,119,255,0.14)',
          }}
        />
        {/* Home icon */}
        <div
          ref={iconRef}
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#3a77ff 0%,#7c3aed 100%)', boxShadow: '0 6px 24px rgba(58,119,255,0.35)' }}
        >
          <span style={{ fontSize: 26 }}>🏠</span>
        </div>
      </div>

      {/* Cycling text */}
      <p
        ref={textRef}
        className="text-[18px] font-semibold text-black mb-2 text-center px-8"
        style={{ minHeight: 28 }}
      >
        {LOADER_LINES[lineIdx]}
      </p>
      <p className="text-[13px] text-[#aaa] text-center px-10">
        Scanning verified listings that match your vibe
      </p>

      {/* Progress dots */}
      <div className="flex gap-2 mt-8">
        {LOADER_LINES.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === lineIdx ? 20 : 6,
              height: 6,
              background: i === lineIdx ? '#3a77ff' : '#dde4ff',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function PreferencesScreen() {
  const { go, goBack } = useNav();
  const [society,  setSociety]  = useState('any');
  const [moveIn,   setMoveIn]   = useState('flexible');
  const [minBaths, setMinBaths] = useState(1);
  const [brokerFree,    setBrokerFree]    = useState(false);
  const [photoVerified, setPhotoVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const ctaRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo([card1Ref.current, card2Ref.current],
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.05, ease: 'power3.out' }
      );
      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.3, delay: 0.28, ease: 'power2.out' }
      );
    });
    return () => ctx.revert();
  }, []);

  const Toggle = ({ value, onChange, label, sub }: {
    value: boolean; onChange: (v: boolean) => void; label: string; sub: string;
  }) => (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[14px] font-semibold text-black">{label}</p>
        <p className="text-[11px] text-[#8f8f8f] font-medium">{sub}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-[#3a77ff]' : 'bg-[#d9d9d9]'}`}
      >
        <div
          className={`absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-all duration-200 ${value ? 'left-[26px]' : 'left-[3px]'}`}
        />
      </button>
    </div>
  );

  return (
    <div className="bg-[#efefef] w-full h-full flex flex-col relative">
      <StatusBar />

      {loading && (
        <FlatFinder onDone={() => go('/listings')} />
      )}

      <div className="flex-1 flex flex-col px-4 pt-2 pb-6 overflow-y-auto hide-scrollbar">
        {/* Progress — full */}
        <div className="w-full h-2 bg-[rgba(143,143,143,0.2)] rounded-full mb-6 shrink-0">
          <div className="h-full bg-[#3a77ff] rounded-full w-full" />
        </div>

        <div className="flex flex-col gap-5 flex-1">
          <div className="flex flex-col gap-2">
            <button className="p-1 -ml-1 w-fit rounded-full hover:bg-black/5" onClick={goBack}>
              <ArrowLeft size={24} className="text-[#1c1b1f]" />
            </button>
            <div>
              <h1 className="text-[20px] font-semibold leading-[32px] text-black">Final preferences</h1>
              <p className="text-[14px] font-medium leading-[20px] text-[#8f8f8f]">Almost done! A few more details</p>
            </div>
          </div>

          {/* Card 1 — preferences (no Furnishing) */}
          <div ref={card1Ref} className="bg-white rounded-[16px] p-4 flex flex-col gap-4 shadow-[0_2px_14px_rgba(0,0,0,0.07)]">
            <OptionRow label="Society Type"    options={SOCIETY_TYPES} value={society}  onChange={setSociety} />
            <div className="h-px bg-black/5" />
            <OptionRow label="Move-in Timeline" options={MOVE_IN}       value={moveIn}   onChange={setMoveIn} />
            <div className="h-px bg-black/5" />
            <div className="flex flex-col gap-2">
              <p className="text-[13px] font-semibold text-black">Minimum Bathrooms</p>
              <div className="flex gap-2">
                {[1, 2, 3].map(n => (
                  <button
                    key={n}
                    onClick={() => setMinBaths(n)}
                    className={`flex-1 py-2 rounded-[10px] text-[13px] font-semibold border transition-all ${
                      minBaths === n
                        ? 'bg-[#3a77ff]/10 border-[#3a77ff] text-[#3a77ff]'
                        : 'bg-[#f7f7f7] border-black/8 text-black'
                    }`}
                  >
                    {n}+
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2 — toggles */}
          <div ref={card2Ref} className="bg-white rounded-[16px] p-4 flex flex-col gap-4 shadow-[0_2px_14px_rgba(0,0,0,0.07)]">
            <Toggle value={brokerFree}    onChange={setBrokerFree}    label="Broker Free only"    sub="No brokerage fees" />
            <div className="h-px bg-black/5" />
            <Toggle value={photoVerified} onChange={setPhotoVerified} label="Photos verified only" sub="Listings with verified photos" />
          </div>
        </div>

        <div ref={ctaRef} className="mt-auto pt-4 shrink-0">
          <button
            className="w-full bg-[#3a77ff] text-white rounded-[12px] py-3.5 text-[16px] font-medium shadow-[0_4px_14px_rgba(58,119,255,0.35)] active:scale-[0.98] transition-transform"
            onClick={() => setLoading(true)}
          >
            Find My Flat 🏠
          </button>
        </div>
      </div>
    </div>
  );
}