import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from '../components/StatusBar';
import { ArrowLeft, Search, MapPin } from 'lucide-react';
import { useNav } from '../context/TransitionContext';
import { KeyboardMock } from '../components/KeyboardMock';
import gsap from 'gsap';

const RESULTS = [
  { name: 'Google Ananta', addr: 'Mahadevpura, East Bengaluru, Karnataka' },
  { name: 'Google Ananta', addr: 'Hobli, Bengaluru, East Bengaluru, Karnataka, India' },
  { name: 'Google Chacha', addr: 'Achanbal, Ananthbaug' },
  { name: 'Google Chacha', addr: 'Achanbal, Ananthbaug, Karnataka' },
];

export function LocationSearchActive() {
  const { go, goBack } = useNav();
  const [query, setQuery] = useState('Google Ananta');
  const keyboardRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ─── Keyboard slides up from below ───
    if (keyboardRef.current) {
      gsap.set(keyboardRef.current, { y: '100%' });
      gsap.to(keyboardRef.current, {
        y: 0,
        duration: 0.42,
        delay: 0.15,       // let page slide-in finish first
        ease: 'power3.out',
      });
    }

    // ─── Header animates down from above ───
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, delay: 0.1, ease: 'power2.out' }
      );
    }

    // ─── Results stagger in ───
    if (resultsRef.current) {
      const items = resultsRef.current.querySelectorAll<HTMLElement>('.result-item');
      gsap.fromTo(items,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.32, stagger: 0.08, delay: 0.28, ease: 'power2.out' }
      );
    }

    // Auto-focus input after page animation settles
    const t = setTimeout(() => inputRef.current?.focus(), 450);
    return () => clearTimeout(t);
  }, []);

  const dismissKeyboardAndGo = async (path: string) => {
    // Slide keyboard away first, then navigate
    if (keyboardRef.current) {
      await gsap.to(keyboardRef.current, {
        y: '100%',
        duration: 0.26,
        ease: 'power2.in',
      });
    }
    go(path);
  };

  const handleSelect = () => dismissKeyboardAndGo('/selected-locations');

  const handleKeyPress = (key: string) => {
    if (key === 'Backspace') {
      setQuery(q => q.slice(0, -1));
    } else if (key.length === 1) {
      setQuery(q => q + key);
    }
  };

  const filteredResults = query.trim()
    ? RESULTS.filter(r =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.addr.toLowerCase().includes(query.toLowerCase())
      )
    : RESULTS;

  return (
    <div className="bg-white w-full h-full flex flex-col overflow-hidden">
      <StatusBar />

      {/* ── Search header ── */}
      <div ref={headerRef} className="px-4 pt-2 pb-3 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button
            className="p-1 -ml-1 rounded-full hover:bg-black/5"
            onClick={() => goBack()}
          >
            <ArrowLeft size={24} className="text-[#1c1b1f]" />
          </button>
          <h1 className="text-[20px] font-semibold text-black">Search Location</h1>
          <div className="w-8" />
        </div>

        {/* Search bar — visible & focused */}
        <div className="bg-[#f4f4f4] rounded-full flex items-center gap-2 px-4 py-3 shadow-[0_0_0_2px_#3a77ff33]">
          <Search size={16} className="text-[#1c1b1f] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search area, locality, building"
            className="bg-transparent border-none outline-none text-[14px] font-medium text-black flex-1 min-w-0"
          />
          {query.length > 0 && (
            <button
              className="text-[#8f8f8f] text-[20px] leading-none"
              onClick={() => setQuery('')}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      <div ref={resultsRef} className="flex-1 overflow-y-auto hide-scrollbar px-4">
        {filteredResults.map((r, i) => (
          <button
            key={i}
            className="result-item w-full flex items-start gap-3 py-4 border-b border-[#f0f0f0] text-left"
            onClick={handleSelect}
          >
            <div className="w-8 h-8 rounded-full bg-[#f4f4f4] flex items-center justify-center shrink-0 mt-0.5">
              <MapPin size={14} className="text-[#3a77ff]" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[14px] font-semibold text-black truncate">{r.name}</span>
              <span className="text-[12px] font-medium text-[#8f8f8f] leading-snug">{r.addr}</span>
            </div>
          </button>
        ))}

        {query.trim() && (
          <button
            className="w-full text-left py-4 text-[14px] font-medium text-[#3a77ff]"
            onClick={handleSelect}
          >
            Show more results for "{query}"
          </button>
        )}
      </div>

      {/* ── Keyboard (slides up from bottom) ── */}
      <div ref={keyboardRef} className="shrink-0" style={{ willChange: 'transform' }}>
        <KeyboardMock onReturn={handleSelect} onKeyPress={handleKeyPress} />
      </div>
    </div>
  );
}
