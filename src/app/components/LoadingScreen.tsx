import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Props {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
  const dot1 = useRef<HTMLDivElement>(null);
  const dot2 = useRef<HTMLDivElement>(null);
  const dot3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Start invisible
    gsap.set([iconRef.current, ringRef.current, titleRef.current, tagRef.current], {
      opacity: 0, y: 24, scale: 0.85,
    });
    gsap.set([dot1.current, dot2.current, dot3.current], { opacity: 0, y: 6 });

    tl
      // Pulsing ring
      .to(ringRef.current, { opacity: 0.15, scale: 1.5, duration: 0.01 }, 0)
      .to(ringRef.current, {
        opacity: 0, scale: 2.2, duration: 1.2, ease: 'power1.out', repeat: -1, repeatDelay: 0.4,
      }, 0)

      // Icon bounces in
      .to(iconRef.current, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.55, ease: 'back.out(1.6)',
      }, 0.15)

      // App name slides up
      .to(titleRef.current, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.4, ease: 'power2.out',
      }, 0.45)

      // Tagline
      .to(tagRef.current, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.35, ease: 'power2.out',
      }, 0.65)

      // Loading dots bounce in with stagger
      .to([dot1.current, dot2.current, dot3.current], {
        opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: 'back.out(2)',
      }, 0.9)

      // Dots bounce continuously
      .to([dot1.current, dot2.current, dot3.current], {
        y: -9, duration: 0.4, ease: 'sine.inOut',
        stagger: 0.14, repeat: 3, yoyo: true,
      }, 1.2)

      // ── EXIT ──
      .to([iconRef.current, titleRef.current, tagRef.current], {
        y: -16, opacity: 0, scale: 0.92,
        duration: 0.38, stagger: 0.04, ease: 'power2.in',
      }, 2.6)
      .to([dot1.current, dot2.current, dot3.current], {
        opacity: 0, duration: 0.2,
      }, 2.62)
      .to(wrapRef.current, {
        opacity: 0, duration: 0.35, ease: 'power1.in',
        onComplete,
      }, 2.85);

    return () => { tl.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 z-[999] flex flex-col items-center justify-center gap-3"
      style={{ background: 'linear-gradient(160deg, #0d0d1a 0%, #0a1628 60%, #0a0a0a 100%)' }}
    >
      {/* Pulsing ring behind icon */}
      <div className="relative flex items-center justify-center">
        <div
          ref={ringRef}
          className="absolute w-24 h-24 rounded-[28px] bg-[#3a77ff]"
          style={{ opacity: 0 }}
        />

        {/* App icon */}
        <div
          ref={iconRef}
          className="relative w-[88px] h-[88px] rounded-[24px] flex items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, #3a77ff 0%, #1a4fcf 100%)',
            boxShadow: '0 12px 40px rgba(58,119,255,0.55), 0 4px 12px rgba(0,0,0,0.4)',
          }}
        >
          <span style={{ fontSize: 40, lineHeight: 1 }}>🏠</span>
        </div>
      </div>

      {/* App title */}
      <h1
        ref={titleRef}
        style={{
          color: 'white',
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: '-0.5px',
          lineHeight: 1,
          marginTop: 8,
        }}
      >
        FlatFind
      </h1>

      {/* Tagline */}
      <p
        ref={tagRef}
        style={{
          color: 'rgba(255,255,255,0.45)',
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: '0.3px',
        }}
      >
        Find your perfect home
      </p>

      {/* Loading dots */}
      <div className="flex gap-[7px] mt-6">
        <div ref={dot1} className="w-2 h-2 rounded-full bg-[#3a77ff]" />
        <div ref={dot2} className="w-2 h-2 rounded-full bg-[#3a77ff] opacity-70" />
        <div ref={dot3} className="w-2 h-2 rounded-full bg-[#3a77ff] opacity-40" />
      </div>
    </div>
  );
}
