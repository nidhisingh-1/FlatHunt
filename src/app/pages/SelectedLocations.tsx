import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from '../components/StatusBar';
import { ArrowLeft, ChevronDown, X, Check } from 'lucide-react';
import { mockLocations, Location } from '../data/mockData';
import { useNav } from '../context/TransitionContext';
import gsap from 'gsap';

const TYPE_OPTIONS = ['Workplace', 'Friend', 'GYM', 'School / College', 'Other'];

function TypeDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  /* animate dropdown open/close */
  useEffect(() => {
    if (!dropRef.current) return;
    if (open) {
      gsap.fromTo(dropRef.current,
        { opacity: 0, y: -6, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.18, ease: 'power2.out' }
      );
    }
  }, [open]);

  /* close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.closest('[data-dropdown]')?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative w-fit" data-dropdown>
      {/* Label trigger */}
      <button
        className="flex items-center gap-1.5 py-0.5"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-[12px] font-semibold text-[#3a77ff] uppercase tracking-[0.72px]">
          {value}
        </span>
        <ChevronDown
          size={14}
          className="text-[#3a77ff] transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          ref={dropRef}
          className="absolute top-full left-0 mt-1.5 z-50 bg-white rounded-[12px] overflow-hidden"
          style={{
            minWidth: 160,
            boxShadow: '0 8px 28px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
          }}
        >
          {TYPE_OPTIONS.map(opt => {
            const isActive = opt === value;
            return (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#f5f8ff] transition-colors"
                style={{ borderBottom: '1px solid #f5f5f5' }}
              >
                <span className={`text-[13px] font-medium ${isActive ? 'text-[#3a77ff]' : 'text-black'}`}>
                  {opt}
                </span>
                {isActive && <Check size={13} className="text-[#3a77ff] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function SelectedLocations() {
  const { go, goBack } = useNav();
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      const items = listRef.current.querySelectorAll<HTMLElement>('.loc-item');
      gsap.fromTo(items,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.1, delay: 0.05, ease: 'power2.out' }
      );
    }
  }, []);

  const handleRemove = (id: string, el: HTMLElement) => {
    gsap.to(el, {
      opacity: 0, x: 24, scale: 0.95, duration: 0.22, ease: 'power2.in',
      onComplete: () => setLocations(prev => prev.filter(l => l.id !== id)),
    });
  };

  const handleTypeChange = (id: string, type: string) => {
    setLocations(prev => prev.map(l => l.id === id ? { ...l, type } : l));
  };

  const handlePriorityChange = (id: string, priority: Location['priority']) => {
    setLocations(prev => prev.map(l => l.id === id ? { ...l, priority } : l));
  };

  return (
    <div className="bg-[#efefef] w-full h-full flex flex-col relative overflow-hidden">
      <StatusBar />

      <div className="flex-1 flex flex-col px-4 pt-2 pb-6 overflow-y-auto hide-scrollbar">
        {/* Progress */}
        <div className="w-full h-2 bg-[rgba(143,143,143,0.2)] rounded-full mb-6 shrink-0">
          <div className="h-full bg-[#3a77ff] rounded-full" style={{ width: '80%' }} />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <button className="p-1 -ml-1 w-fit rounded-full hover:bg-black/5" onClick={goBack}>
              <ArrowLeft size={24} className="text-[#1c1b1f]" />
            </button>
            <div>
              <h1 className="text-[20px] font-semibold leading-[32px] text-black">Search Location(s)</h1>
              <p className="text-[14px] font-medium leading-[20px] text-[#8f8f8f]">You can add up to 5 places</p>
            </div>
          </div>

          {/* Locations */}
          <div ref={listRef} className="flex flex-col gap-6">
            {locations.map(loc => (
              <div key={loc.id} className="loc-item flex flex-col gap-3">
                {/* Type dropdown trigger */}
                <TypeDropdown
                  value={loc.type}
                  onChange={type => handleTypeChange(loc.id, type)}
                />

                <div className="bg-white rounded-[10px] p-3 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <span className="text-[14px] font-semibold text-black truncate pr-4">{loc.name}</span>
                  <button
                    onClick={e => handleRemove(loc.id, (e.currentTarget as HTMLElement).closest('.loc-item') as HTMLElement)}
                    className="shrink-0 text-black"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {(['Must be close', 'Important', 'Flexible'] as Location['priority'][]).map(p => {
                    const isActive = loc.priority === p;
                    return (
                      <button
                        key={p}
                        onClick={() => handlePriorityChange(loc.id, p)}
                        className={`px-3 py-1.5 rounded-[8px] text-[12px] font-medium transition-all ${
                          isActive
                            ? 'bg-[#3a77ff]/10 text-[#0a0a0a] border border-[#3a77ff]/60'
                            : 'bg-white text-black border border-black/10'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              className="text-[#3a77ff] text-[14px] font-semibold w-fit"
              onClick={() => go('/search-active')}
            >
              + Add another location
            </button>
          </div>
        </div>

        <div className="mt-auto pt-8 shrink-0">
          <button
            className="w-full bg-[#3a77ff] text-white rounded-[12px] py-3.5 text-[16px] font-medium shadow-[0_4px_14px_rgba(58,119,255,0.35)]"
            onClick={() => go('/preferences')}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
