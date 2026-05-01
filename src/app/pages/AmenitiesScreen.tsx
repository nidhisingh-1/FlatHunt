import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from '../components/StatusBar';
import { ArrowLeft } from 'lucide-react';
import { useNav } from '../context/TransitionContext';
import gsap from 'gsap';

const AMENITY_GROUPS = [
  {
    group: 'Essentials',
    items: [
      { id: 'parking',      label: 'Parking',        icon: '🚗' },
      { id: 'lift',         label: 'Lift',            icon: '🛗' },
      { id: 'power_backup', label: 'Power Backup',    icon: '🔋' },
      { id: 'gas_pipeline', label: 'Gas Pipeline',    icon: '🔥' },
      { id: 'water_24x7',   label: '24×7 Water',      icon: '💧' },
      { id: 'security',     label: 'Security',         icon: '🔐' },
    ],
  },
  {
    group: 'Furnishing',
    items: [
      { id: 'fully_furnished',  label: 'Fully Furnished',  icon: '🛋️' },
      { id: 'semi_furnished',   label: 'Semi Furnished',   icon: '🪑' },
      { id: 'washing_area',     label: 'Washing Area',     icon: '🫧' },
      { id: 'modular_kitchen',  label: 'Modular Kitchen',  icon: '🍳' },
    ],
  },
  {
    group: 'Society',
    items: [
      { id: 'gym',         label: 'Gym',            icon: '🏋️' },
      { id: 'swimming',    label: 'Swimming Pool',  icon: '🏊' },
      { id: 'clubhouse',   label: 'Clubhouse',      icon: '🏛️' },
      { id: 'garden',      label: 'Garden / Park',  icon: '🌿' },
      { id: 'cctv',        label: 'CCTV',           icon: '📹' },
    ],
  },
  {
    group: 'Eco & Tech',
    items: [
      { id: 'solar',      label: 'Solar Panels',       icon: '☀️' },
      { id: 'ev_charger', label: 'EV Charger',          icon: '⚡' },
      { id: 'rainwater',  label: 'Rainwater Harvest',  icon: '🌧️' },
    ],
  },
  {
    group: 'Connectivity',
    items: [
      { id: 'metro',       label: 'Metro Station',      icon: '🚇' },
      { id: 'metro_bus',   label: 'Metro Bus / BRT',    icon: '🚌' },
      { id: 'railway',     label: 'Railway Station',    icon: '🚉' },
      { id: 'highway',     label: 'Highway Access',     icon: '🛣️' },
      { id: 'auto_stand',  label: 'Auto Stand Nearby',  icon: '🛺' },
      { id: 'airport',     label: 'Near Airport',       icon: '✈️' },
      { id: 'broadband',   label: 'High-speed Broadband', icon: '📶' },
      { id: 'smart_block', label: 'Smart City Block',   icon: '🏙️' },
      { id: 'cycle_lane',  label: 'Cycle Lane / Path',  icon: '🚲' },
    ],
  },
];

export function AmenitiesScreen() {
  const { go, goBack } = useNav();
  const [selected, setSelected] = useState<string[]>(['parking', 'lift', 'power_backup']);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      const groups = bodyRef.current.querySelectorAll<HTMLElement>('.amenity-group');
      gsap.fromTo(groups,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.1, delay: 0.05, ease: 'power2.out' }
      );
    }
  }, []);

  const toggle = (id: string, el: HTMLElement) => {
    const wasSelected = selected.includes(id);
    gsap.timeline()
      .to(el, { scale: 0.92, duration: 0.08 })
      .to(el, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-[#efefef] w-full h-full flex flex-col relative">
      <StatusBar />

      <div className="flex-1 flex flex-col px-4 pt-2 pb-6 overflow-y-auto hide-scrollbar">
        {/* Progress */}
        <div className="w-full h-2 bg-[rgba(143,143,143,0.2)] rounded-full mb-6 shrink-0">
          <div className="h-full bg-[#3a77ff] rounded-full" style={{ width: '60%' }} />
        </div>

        <div className="flex flex-col gap-5 flex-1">
          <div className="flex flex-col gap-2">
            <button className="p-1 -ml-1 w-fit rounded-full hover:bg-black/5" onClick={goBack}>
              <ArrowLeft size={24} className="text-[#1c1b1f]" />
            </button>
            <div>
              <h1 className="text-[20px] font-semibold leading-[32px] text-black">Must-have amenities</h1>
              <p className="text-[14px] font-medium leading-[20px] text-[#8f8f8f]">Pick what matters most to you</p>
            </div>
          </div>

          {/* Count badge */}
          {selected.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="bg-[#3a77ff] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                {selected.length} selected
              </div>
              <button className="text-[12px] text-[#8f8f8f] font-medium" onClick={() => setSelected([])}>
                Clear all
              </button>
            </div>
          )}

          {/* Groups */}
          <div ref={bodyRef} className="flex flex-col gap-5">
            {AMENITY_GROUPS.map(group => (
              <div key={group.group} className="amenity-group flex flex-col gap-2.5">
                <p className="text-[11px] font-medium text-[#8f8f8f] uppercase tracking-wider">{group.group}</p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map(item => {
                    const isSelected = selected.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        style={{ willChange: 'transform' }}
                        onClick={e => toggle(item.id, e.currentTarget as HTMLElement)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-[13px] font-medium border transition-colors ${
                          isSelected
                            ? 'bg-[#3a77ff]/10 border-[#3a77ff] text-[#3a77ff]'
                            : 'bg-white border-black/8 text-black shadow-[0_1px_4px_rgba(0,0,0,0.05)]'
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4 shrink-0 flex flex-row gap-3">
          <button
            className="flex-1 bg-white text-black border border-black/10 rounded-[12px] py-3.5 text-[16px] font-medium shadow-[0_2px_8px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-transform"
            onClick={() => go('/location')}
          >
            Skip
          </button>
          <button
            className="flex-[2] bg-[#3a77ff] text-white rounded-[12px] py-3.5 text-[16px] font-medium shadow-[0_4px_14px_rgba(58,119,255,0.35)] active:scale-[0.98] transition-transform"
            onClick={() => go('/location')}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}