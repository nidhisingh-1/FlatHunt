import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from '../components/StatusBar';
import { ArrowLeft } from 'lucide-react';
import { useNav } from '../context/TransitionContext';
import gsap from 'gsap';

const PRESETS = [
  { label: '< ₹15K',   min: 0,     max: 15000  },
  { label: '₹15K–30K', min: 15000, max: 30000  },
  { label: '₹30K–50K', min: 30000, max: 50000  },
  { label: '₹50K–80K', min: 50000, max: 80000  },
  { label: '₹80K+',    min: 80000, max: 150000 },
];

function formatINR(val: number) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000)   return `₹${Math.round(val / 1000)}K`;
  return `₹${val}`;
}

const RANGE_MIN = 0;
const RANGE_MAX = 150000;
const STEP = 1000;

export function BudgetScreen() {
  const { go } = useNav();
  const [minBudget, setMinBudget] = useState(20000);
  const [maxBudget, setMaxBudget] = useState(60000);
  const [activePreset, setActivePreset] = useState<number | null>(null);

  const cardRef  = useRef<HTMLDivElement>(null);
  const presetsRef = useRef<HTMLDivElement>(null);
  const ctaRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 28, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, delay: 0.05, ease: 'power3.out' }
      );
      if (presetsRef.current) {
        const chips = presetsRef.current.querySelectorAll<HTMLElement>('.preset-chip');
        gsap.fromTo(chips,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.07, delay: 0.2, ease: 'power2.out' }
        );
      }
      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, delay: 0.35, ease: 'power2.out' }
      );
    });
    return () => ctx.revert();
  }, []);

  const handlePreset = (idx: number) => {
    setActivePreset(idx);
    setMinBudget(PRESETS[idx].min);
    setMaxBudget(PRESETS[idx].max);
    // Bounce the card
    gsap.timeline()
      .to(cardRef.current, { scale: 0.98, duration: 0.1 })
      .to(cardRef.current, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
  };

  const minPercent = ((minBudget - RANGE_MIN) / (RANGE_MAX - RANGE_MIN)) * 100;
  const maxPercent = ((maxBudget - RANGE_MIN) / (RANGE_MAX - RANGE_MIN)) * 100;

  return (
    <div className="bg-[#efefef] w-full h-full flex flex-col relative">
      <StatusBar />

      <div className="flex-1 flex flex-col px-4 pt-2 pb-6 overflow-y-auto hide-scrollbar">
        {/* Progress */}
        <div className="w-full h-2 bg-[rgba(143,143,143,0.2)] rounded-full mb-6 shrink-0">
          <div className="h-full bg-[#3a77ff] rounded-full" style={{ width: '20%' }} />
        </div>

        <div className="flex flex-col gap-6 flex-1">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <button className="p-1 -ml-1 w-fit rounded-full hover:bg-black/5 opacity-30 pointer-events-none">
              <ArrowLeft size={24} className="text-[#1c1b1f]" />
            </button>
            <div>
              <h1 className="text-[20px] font-semibold leading-[32px] text-black">What's your budget?</h1>
              <p className="text-[14px] font-medium leading-[20px] text-[#8f8f8f]">Set your monthly rent range</p>
            </div>
          </div>

          {/* Budget card */}
          <div ref={cardRef} className="bg-white rounded-[16px] p-5 flex flex-col gap-5 shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-medium text-[#8f8f8f] uppercase tracking-wider block mb-0.5">Min</span>
                <span className="text-[22px] font-semibold text-[#3a77ff]">{formatINR(minBudget)}</span>
              </div>
              <div className="h-8 w-px bg-[#e5e5e5]" />
              <div className="text-right">
                <span className="text-[10px] font-medium text-[#8f8f8f] uppercase tracking-wider block mb-0.5">Max</span>
                <span className="text-[22px] font-semibold text-[#3a77ff]">{formatINR(maxBudget)}</span>
              </div>
            </div>

            {/* Dual-range slider */}
            <div className="relative pt-2 pb-1">
              <div className="relative h-2 mx-2">
                <div className="absolute inset-0 bg-[#e8e8e8] rounded-full" />
                <div
                  className="absolute h-full bg-[#3a77ff] rounded-full"
                  style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
                />
                <input
                  type="range" min={RANGE_MIN} max={RANGE_MAX} step={STEP} value={minBudget}
                  onChange={e => {
                    const v = +e.target.value;
                    if (v < maxBudget - 5000) { setMinBudget(v); setActivePreset(null); }
                  }}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-10"
                />
                <input
                  type="range" min={RANGE_MIN} max={RANGE_MAX} step={STEP} value={maxBudget}
                  onChange={e => {
                    const v = +e.target.value;
                    if (v > minBudget + 5000) { setMaxBudget(v); setActivePreset(null); }
                  }}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-20"
                />
                {/* Visual thumbs */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-[#3a77ff] rounded-full shadow-[0_2px_8px_rgba(58,119,255,0.4)] z-30 pointer-events-none"
                  style={{ left: `${minPercent}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-[#3a77ff] rounded-full shadow-[0_2px_8px_rgba(58,119,255,0.4)] z-30 pointer-events-none"
                  style={{ left: `${maxPercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-3 px-1">
                <span className="text-[10px] text-[#8f8f8f]">{formatINR(RANGE_MIN)}</span>
                <span className="text-[10px] text-[#8f8f8f]">{formatINR(RANGE_MAX)}</span>
              </div>
            </div>
          </div>

          {/* Presets */}
          <div className="flex flex-col gap-3">
            <p className="text-[12px] font-medium text-[#8f8f8f]">Popular ranges</p>
            <div ref={presetsRef} className="flex flex-wrap gap-2">
              {PRESETS.map((p, i) => (
                <button
                  key={p.label}
                  onClick={() => handlePreset(i)}
                  className={`preset-chip px-4 py-2 rounded-[10px] text-[13px] font-medium transition-all border ${
                    activePreset === i
                      ? 'bg-[#3a77ff]/10 border-[#3a77ff] text-[#3a77ff]'
                      : 'bg-white border-black/10 text-black'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="bg-[#3a77ff]/8 rounded-[12px] px-4 py-3 border border-[#3a77ff]/15">
            <p className="text-[12px] font-medium text-[#3a77ff]">
              💡 Budget includes rent only. We'll show you the <span className="font-semibold">true move-in cost</span> on each listing.
            </p>
          </div>
        </div>

        <div ref={ctaRef} className="mt-auto pt-4 shrink-0">
          <button
            className="w-full bg-[#3a77ff] text-white rounded-[12px] py-3.5 text-[16px] font-medium shadow-[0_4px_14px_rgba(58,119,255,0.35)] active:scale-[0.98] transition-transform"
            onClick={() => go('/flat-type')}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
