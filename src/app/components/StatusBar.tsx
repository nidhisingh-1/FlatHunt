import React from 'react';
import { Battery, Wifi, Signal } from 'lucide-react';

export function StatusBar({ dark = true }: { dark?: boolean }) {
  const colorClass = dark ? 'text-black' : 'text-white';
  return (
    <div className={`h-[40px] w-full flex items-center justify-between px-6 z-50 shrink-0 ${colorClass}`}>
      <div className="text-[14px] font-semibold tracking-tight">9:41</div>
      <div className="flex items-center gap-1.5">
        <Signal size={14} className="stroke-[2.5]" />
        <Wifi size={14} className="stroke-[2.5]" />
        <Battery size={16} className="stroke-[2.5]" />
      </div>
    </div>
  );
}
