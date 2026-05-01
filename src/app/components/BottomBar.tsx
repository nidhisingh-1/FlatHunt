import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Home, Users, MessageCircle } from 'lucide-react';
import gsap from 'gsap';
import { AIScreen } from './AIScreen';

/* ─── Primary blue used throughout the app ─── */
const BLUE = '#007aff';

/* ─── Nav tabs: Home · Flatmates · Inbox ─── */
const NAV_TABS = [
  { id: 'home',      Icon: Home,          label: 'Home'                },
  { id: 'flatmates', Icon: Users,         label: 'Flatmates'           },
  { id: 'inbox',     Icon: MessageCircle, label: 'Inbox', unread: 3   },
];

/* ─── Floating nudge messages from the AI circle ─── */
const FLOAT_MSGS = [
  'Looking for something specific?',
  'Ask me anything',
  'I can compare listings',
  'Need help filtering?',
  'Ask about commute times',
  'Found what you need?',
  'Check amenities nearby',
];

/* ─── Contextual sheet prompts ─── */
const PROMPTS: Record<string, string[]> = {
  listings: [
    'Show me 2 BHK with parking near Indiranagar',
    'Which listings have zero brokerage?',
    'Best for a couple, no curfew',
    'Filter by gated society only',
  ],
  detail: [
    'Is this safe for solo women?',
    "What's the commute to MG Road?",
    'Any recurring issues with this society?',
    'Compare this to similar listings nearby',
  ],
  default: [
    'Help me find the right place',
    'What should I check before signing?',
    'Explain move-in costs',
  ],
};

/* ─── Custom 4-pointed AI star (filled, white) ─── */
function AIStarIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      {/* Main large star */}
      <path
        d="M13 2C13 2 14.6 9.4 16.2 10.8C17.8 12.2 24 13 24 13C24 13 17.8 13.8 16.2 15.2C14.6 16.6 13 24 13 24C13 24 11.4 16.6 9.8 15.2C8.2 13.8 2 13 2 13C2 13 8.2 12.2 9.8 10.8C11.4 9.4 13 2 13 2Z"
        fill="white"
      />
      {/* Small accent star top-right */}
      <path
        d="M20.5 4C20.5 4 21.1 6.6 21.9 7.1C22.7 7.6 24.5 8 24.5 8C24.5 8 22.7 8.4 21.9 8.9C21.1 9.4 20.5 12 20.5 12C20.5 12 19.9 9.4 19.1 8.9C18.3 8.4 16.5 8 16.5 8C16.5 8 18.3 7.6 19.1 7.1C19.9 6.6 20.5 4 20.5 4Z"
        fill="white"
        opacity="0.72"
      />
    </svg>
  );
}

export interface BottomBarProps {
  activeNav?: string;
  onNavChange?: (id: string) => void;
  context?: 'listings' | 'detail' | 'default';
}

export function BottomBar({
  activeNav = 'home',
  onNavChange,
  context = 'listings',
}: BottomBarProps) {
  const [activeNavId, setActiveNavId] = useState(activeNav);
  const [aiOpen, setAiOpen]           = useState(false);
  const [floatMsg, setFloatMsg]       = useState<string | null>(null);

  const circleRef  = useRef<HTMLButtonElement>(null);
  const bubbleRef  = useRef<HTMLDivElement>(null);
  const msgIndex   = useRef(0);
  const floatTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Floating bubble sequence ── */
  const showNextBubble = useCallback(() => {
    const msg = FLOAT_MSGS[msgIndex.current % FLOAT_MSGS.length];
    msgIndex.current++;
    setFloatMsg(msg);
  }, []);

  /* Animate bubble in → hold → out once floatMsg is set */
  useEffect(() => {
    if (!floatMsg || !bubbleRef.current) return;
    const el = bubbleRef.current;

    gsap.fromTo(el,
      { opacity: 0, y: 10, scale: 0.88 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.38, ease: 'back.out(1.8)',
        onComplete: () => {
          gsap.to(el, {
            opacity: 0, y: -14, scale: 0.92,
            duration: 0.42, ease: 'power2.in',
            delay: 2.2,
            onComplete: () => setFloatMsg(null),
          });
        },
      }
    );
  }, [floatMsg]);

  /* Kick off recurring interval */
  useEffect(() => {
    // First bubble after 3 seconds
    const initial = setTimeout(() => {
      showNextBubble();
      // Then every 6 seconds
      floatTimer.current = setInterval(showNextBubble, 6000);
    }, 3000);

    return () => {
      clearTimeout(initial);
      if (floatTimer.current) clearInterval(floatTimer.current);
    };
  }, [showNextBubble]);

  /* ── AI circle press ── */
  const handleCirclePress = useCallback(() => {
    if (!circleRef.current) { setAiOpen(true); return; }
    // Kill any pending bubble
    setFloatMsg(null);
    gsap.timeline()
      .to(circleRef.current, { scale: 0.90, duration: 0.10, ease: 'power2.in' })
      .to(circleRef.current, { scale: 1.06, duration: 0.16, ease: 'back.out(2.8)' })
      .to(circleRef.current, { scale: 1,    duration: 0.10, ease: 'power2.out',
          onComplete: () => setAiOpen(true) });
  }, []);

  const handleClose = () => setAiOpen(false);

  const handleNavTap = (id: string) => {
    setActiveNavId(id);
    onNavChange?.(id);
  };

  const prompts = PROMPTS[context] ?? PROMPTS.default;

  return (
    <>
      {/* ═══ Bottom bar ═══ */}
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none z-40"
        style={{
          background: 'linear-gradient(to top, rgba(242,242,242,0.97) 60%, transparent 100%)',
          paddingBottom: 'env(safe-area-inset-bottom, 20px)',
        }}
      >
        <div className="flex items-end justify-between px-4 pt-3 pb-5">

          {/* ── Tab Pills ── */}
          <div
            className="pointer-events-auto flex-1 max-w-[306px] min-w-0 relative rounded-[9999px]"
            style={{
              background: 'rgba(255,255,255,0.82)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              boxShadow: '0px 2px 10px rgba(0,0,0,0.10)',
              border: '0.5px solid rgba(255,255,255,0.65)',
            }}
          >
            <div className="flex flex-row items-center justify-center size-full">
              <div
                className="flex items-center justify-center w-full"
                style={{ padding: '4px 14px 4px 4px' }}
              >
                {NAV_TABS.map(({ id, Icon, label, unread }, idx) => {
                  const isActive = activeNavId === id;
                  return (
                    <button
                      key={id}
                      onClick={() => handleNavTap(id)}
                      className="flex-1 min-w-0 relative transition-all duration-200"
                      style={{
                        borderRadius: '100px',
                        background: isActive ? '#e8f0ff' : 'transparent',
                        marginRight: idx < NAV_TABS.length - 1 ? '-10px' : 0,
                        zIndex: isActive ? 2 : 1,
                      }}
                    >
                      <div className="flex flex-col items-center justify-center overflow-hidden rounded-[inherit] size-full">
                        <div
                          className="flex flex-col items-center justify-center gap-[3px] w-full"
                          style={{ padding: '8px' }}
                        >
                          <div className="relative flex items-center justify-center w-full shrink-0">
                            <Icon
                              size={20}
                              strokeWidth={0}
                              style={{
                                fill: isActive ? BLUE : '#b0b0b8',
                                transition: 'fill 180ms ease',
                              }}
                            />
                            {unread && !isActive && (
                              <div
                                className="absolute -top-[3px] right-[18%] min-w-[15px] h-[15px] rounded-full flex items-center justify-center px-[3px]"
                                style={{ background: '#ff3b30', border: '1.5px solid rgba(255,255,255,0.9)' }}
                              >
                                <span className="text-white leading-none" style={{ fontSize: 9, fontWeight: 700 }}>
                                  {unread}
                                </span>
                              </div>
                            )}
                          </div>
                          <span
                            className="text-[11px] text-center w-full overflow-hidden text-ellipsis whitespace-nowrap leading-[13px] tracking-[0.06px]"
                            style={{
                              color: isActive ? BLUE : '#888',
                              fontWeight: isActive ? 600 : 400,
                              transition: 'color 180ms ease, font-weight 180ms ease',
                            }}
                          >
                            {label}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── 16px Spacer ── */}
          <div className="w-4 shrink-0" />

          {/* ── AI Circle + floating bubble ── */}
          <div className="relative pointer-events-auto shrink-0" style={{ width: 60, height: 60 }}>
            {/* Floating bubble */}
            {floatMsg && (
              <div
                ref={bubbleRef}
                className="absolute right-0 flex items-center whitespace-nowrap"
                style={{
                  bottom: 'calc(100% + 10px)',
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderRadius: '20px',
                  padding: '7px 13px',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.13), 0 0 0 0.5px rgba(0,0,0,0.07)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#1a1a1a',
                  zIndex: 5,
                  transformOrigin: 'bottom right',
                }}
              >
                {floatMsg}
                <span
                  style={{
                    position: 'absolute',
                    bottom: -6, right: 20,
                    width: 0, height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid rgba(255,255,255,0.92)',
                  }}
                />
              </div>
            )}

            {/* Circle button */}
            <button
              ref={circleRef}
              onClick={handleCirclePress}
              className="relative flex items-center justify-center rounded-full overflow-hidden"
              style={{
                width: 60, height: 60,
                background: 'linear-gradient(160deg, #3a77ff 0%, #1c1b1f 100%)',
                boxShadow: '0px 4px 16px rgba(58,119,255,0.38), 0 0 0 1px rgba(255,255,255,0.10) inset',
              }}
            >
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.18) 0%, transparent 65%)' }}
              />
              <AIStarIcon />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Full-screen AI Screen ═══ */}
      <AIScreen open={aiOpen} onClose={handleClose} context={context} />
    </>
  );
}