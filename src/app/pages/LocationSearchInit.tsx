import React, { useRef, useEffect } from 'react';
import { StatusBar } from '../components/StatusBar';
import { ArrowLeft, Search } from 'lucide-react';
import { useNav } from '../context/TransitionContext';
import gsap from 'gsap';

export function LocationSearchInit() {
  const { go, goBack } = useNav();
  const searchBarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (searchBarRef.current) {
      gsap.fromTo(searchBarRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.3, delay: 0.1, ease: 'power2.out' }
      );
    }
  }, []);

  const handleSearchTap = () => {
    const bar = searchBarRef.current;
    if (!bar) { go('/search-active'); return; }
    gsap.timeline()
      .to(bar, { scale: 0.96, duration: 0.1, ease: 'power2.in' })
      .to(bar, { scale: 1, duration: 0.1, ease: 'power2.out', onComplete: () => go('/search-active') });
  };

  return (
    <div className="bg-[#efefef] w-full h-full flex flex-col relative">
      <StatusBar />

      <div className="flex-1 flex flex-col px-4 pt-2 pb-6 overflow-y-auto hide-scrollbar">
        {/* Progress Bar */}
        <div className="w-full h-2 bg-[rgba(143,143,143,0.2)] rounded-full mb-6 shrink-0">
          <div className="h-full bg-[#3a77ff] rounded-full" style={{ width: '80%' }} />
        </div>

        <div className="flex flex-col gap-6 flex-1">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <button className="p-1 -ml-1 w-fit rounded-full hover:bg-black/5" onClick={goBack}>
              <ArrowLeft size={24} className="text-[#1c1b1f]" />
            </button>
            <div>
              <h1 className="text-[20px] font-semibold leading-[32px] text-black">Add area you want to search</h1>
              <p className="text-[14px] font-medium leading-[20px] text-[#8f8f8f]">You can add up to 5 places</p>
            </div>
          </div>

          {/* Search bar */}
          <button
            ref={searchBarRef}
            className="w-full bg-white rounded-full py-4 px-5 flex items-center gap-3 shadow-[0_4px_14px_rgba(0,0,0,0.12)] text-left"
            style={{ willChange: 'transform' }}
            onClick={handleSearchTap}
          >
            <Search size={18} className="text-[#1c1b1f] shrink-0" />
            <span className="text-[14px] font-medium text-[#8f8f8f]">Search area, locality, building</span>
          </button>
        </div>

        <div className="mt-auto pt-4 shrink-0">
          <button
            disabled
            className="w-full bg-[#3a77ff]/30 text-white rounded-[12px] py-3.5 text-[16px] font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}