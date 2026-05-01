import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Home, Clock, AlertCircle } from 'lucide-react';
import type { InspectionStatus } from '../data/mockData';

interface Props {
  images: string[];
  inspected: string;
  inspectionStatus: InspectionStatus;
  isLiked: boolean;
  onLike: (e: React.MouseEvent) => void;
}

const ROOM_LABELS = ['Master Bedroom', 'Living Room', 'Kitchen', 'Balcony', 'Bathroom', 'Hall'];
const TOTAL_PHOTOS = 14;

/* ── Inspection state configs ── */
const INSPECTION_CONFIG: Record<InspectionStatus, {
  gradient: string;
  icon: React.ReactNode;
  label: (date: string) => string;
  textColor: string;
}> = {
  verified: {
    gradient: 'linear-gradient(89.9deg,#3a77ff 6.9%,rgba(50,188,69,0) 51%)',
    icon: <Home size={13} className="text-white shrink-0" />,
    label: (date) => `Inspected: ${date}`,
    textColor: 'text-white',
  },
  requested: {
    gradient: 'linear-gradient(89.9deg,#d97706 6.9%,rgba(217,119,6,0) 51%)',
    icon: <Clock size={12} className="text-white shrink-0" />,
    label: () => 'Inspection Requested',
    textColor: 'text-white',
  },
  none: {
    gradient: 'linear-gradient(89.9deg,rgba(70,70,70,0.88) 6.9%,rgba(70,70,70,0) 51%)',
    icon: <AlertCircle size={12} className="text-white shrink-0" />,
    label: () => 'Not Yet Inspected',
    textColor: 'text-white',
  },
};

export function CardImageCarousel({ images, inspected, inspectionStatus, isLiked, onLike }: Props) {
  const [current, setCurrent]         = useState(0);
  const [dotsVisible, setDotsVisible] = useState(false);

  const containerRef   = useRef<HTMLDivElement>(null);
  const firstSlideRef  = useRef(false);
  const intervalRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX    = useRef<number | null>(null);
  const touchStartY    = useRef<number | null>(null);
  const didSwipeRef    = useRef(false);
  const currentRef     = useRef(0);

  const revealDots = () => {
    if (!firstSlideRef.current) {
      firstSlideRef.current = true;
      setDotsVisible(true);
    }
  };

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
    currentRef.current = idx;
    revealDots();
  }, []);

  const goNext = useCallback(() => {
    setCurrent(c => {
      const next = (c + 1) % images.length;
      currentRef.current = next;
      revealDots();
      return next;
    });
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrent(c => {
      const prev = (c - 1 + images.length) % images.length;
      currentRef.current = prev;
      revealDots();
      return prev;
    });
  }, [images.length]);

  /* ── Auto-advance ── */
  const resetInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (images.length <= 1) return;
    intervalRef.current = setInterval(goNext, 3200);
  }, [images.length, goNext]);

  useEffect(() => {
    resetInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [resetInterval]);

  /* ── Non-passive native touch listeners ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      didSwipeRef.current = false;
    };

    const onMove = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;
      const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
      const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
      if (dx > dy && dx > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onEnd = (e: TouchEvent) => {
      if (touchStartX.current === null) return;
      const delta = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 28) {
        didSwipeRef.current = true;
        if (delta > 0) goNext(); else goPrev();
        resetInterval();
      }
      touchStartX.current = null;
      touchStartY.current = null;
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove',  onMove,  { passive: false });
    el.addEventListener('touchend',   onEnd,   { passive: true });

    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove',  onMove);
      el.removeEventListener('touchend',   onEnd);
    };
  }, [goNext, goPrev, resetInterval]);

  const handleClick = (e: React.MouseEvent) => {
    if (didSwipeRef.current) {
      e.stopPropagation();
      didSwipeRef.current = false;
    }
  };

  const label        = ROOM_LABELS[current] ?? 'Interior';
  const displayTotal = Math.max(images.length, TOTAL_PHOTOS);
  const cfg          = INSPECTION_CONFIG[inspectionStatus];

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: 183, touchAction: 'pan-y' }}
      onClick={handleClick}
    >
      {/* Cross-fade images */}
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={ROOM_LABELS[i] ?? 'Room'}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: i === current ? 1 : 0,
            transition: 'opacity 680ms cubic-bezier(0.4,0,0.2,1)',
            willChange: 'opacity',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Corner gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(135deg,rgba(0,0,0,0) 48%,rgba(0,0,0,0.45) 100%)' }}
      />

      {/* Top-left label */}
      <div className="absolute top-3 left-3 bg-black/60 px-2 py-[3px] rounded-[6px]">
        <span className="text-white text-[10px] font-semibold">
          {label} ({current + 1}/{displayTotal})
        </span>
      </div>

      {/* Heart button */}
      <button
        className="absolute top-3 right-3"
        onClick={onLike}
        style={{ willChange: 'transform' }}
      >
        <Heart
          size={27}
          className={isLiked ? 'text-red-500 fill-red-500' : 'text-white'}
          strokeWidth={isLiked ? 0 : 1.5}
        />
      </button>

      {/* Bottom row: Inspection state + dots */}
      <div
        className="absolute bottom-0 left-0 right-0 py-1.5 px-2.5 flex items-center justify-between"
        style={{ background: cfg.gradient }}
      >
        <div className="flex items-center gap-1.5 shrink-0">
          {cfg.icon}
          <span className={`${cfg.textColor} text-[10px] font-semibold`}>
            {cfg.label(inspected)}
          </span>
        </div>

        {images.length > 1 && (
          <div
            className="flex gap-[5px] items-center"
            style={{ opacity: dotsVisible ? 1 : 0, transition: 'opacity 450ms ease' }}
          >
            {images.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); goTo(i); resetInterval(); }}
                style={{
                  width:           i === current ? 6 : 4,
                  height:          i === current ? 6 : 4,
                  borderRadius:    '50%',
                  backgroundColor: 'white',
                  opacity:         i === current ? 1 : 0.5,
                  transition:      'width 280ms ease, height 280ms ease, opacity 280ms ease',
                  flexShrink:      0,
                  padding:         0,
                  border:          'none',
                  cursor:          'pointer',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
