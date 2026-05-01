import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Mic, ArrowUp } from 'lucide-react';
import gsap from 'gsap';

/* ── 4-pointed star icon ── */
function AIStarIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <path
        d="M13 2C13 2 14.6 9.4 16.2 10.8C17.8 12.2 24 13 24 13C24 13 17.8 13.8 16.2 15.2C14.6 16.6 13 24 13 24C13 24 11.4 16.6 9.8 15.2C8.2 13.8 2 13 2 13C2 13 8.2 12.2 9.8 10.8C11.4 9.4 13 2 13 2Z"
        fill="white"
      />
      <path
        d="M20.5 4C20.5 4 21.1 6.6 21.9 7.1C22.7 7.6 24.5 8 24.5 8C24.5 8 22.7 8.4 21.9 8.9C21.1 9.4 20.5 12 20.5 12C20.5 12 19.9 9.4 19.1 8.9C18.3 8.4 16.5 8 16.5 8C16.5 8 18.3 7.6 19.1 7.1C19.9 6.6 20.5 4 20.5 4Z"
        fill="white"
        opacity="0.7"
      />
    </svg>
  );
}

/* ── Suggestion groups ── */
const SUGGESTION_GROUPS: { category: string; prompts: { emoji: string; text: string }[] }[] = [
  {
    category: 'Compare',
    prompts: [
      { emoji: '⚖️', text: 'Compare listings 1 and 3' },
      { emoji: '📊', text: 'Which flat has the best value?' },
    ],
  },
  {
    category: 'Search',
    prompts: [
      { emoji: '🔍', text: 'Show 2 BHKs near my office' },
      { emoji: '💰', text: 'Which listings have zero brokerage?' },
      { emoji: '✅', text: 'Only inspector-verified flats' },
    ],
  },
  {
    category: 'Advice',
    prompts: [
      { emoji: '🚇', text: 'Best commute from HSR to Whitefield?' },
      { emoji: '🛡️', text: 'What should I check before signing?' },
      { emoji: '📝', text: 'Explain move-in cost breakdown' },
    ],
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
  context?: 'listings' | 'detail' | 'default';
}

export function AIScreen({ open, onClose, context = 'listings' }: Props) {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages]   = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [thinking, setThinking]   = useState(false);

  const screenRef  = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const chipsRef   = useRef<HTMLDivElement>(null);
  const orb1Ref    = useRef<HTMLDivElement>(null);
  const orb2Ref    = useRef<HTMLDivElement>(null);

  /* ── Orb idle animation ── */
  useEffect(() => {
    if (!orb1Ref.current || !orb2Ref.current) return;
    const t1 = gsap.to(orb1Ref.current, {
      y: -24, x: 18, scale: 1.12,
      duration: 4.2, ease: 'sine.inOut', yoyo: true, repeat: -1,
    });
    const t2 = gsap.to(orb2Ref.current, {
      y: 18, x: -14, scale: 0.9,
      duration: 3.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.1,
    });
    return () => { t1.kill(); t2.kill(); };
  }, []);

  /* ── Entry/exit animation ── */
  useEffect(() => {
    if (!screenRef.current) return;
    if (open) {
      gsap.fromTo(screenRef.current,
        { y: '100%' },
        { y: '0%', duration: 0.44, ease: 'cubic-bezier(0.32,0.72,0,1)' }
      );
      // stagger chips
      if (chipsRef.current) {
        const chips = chipsRef.current.querySelectorAll<HTMLElement>('.ai-chip');
        gsap.fromTo(chips,
          { opacity: 0, y: 18, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.36, stagger: 0.06, delay: 0.22, ease: 'power3.out' }
        );
      }
      // focus input
      setTimeout(() => inputRef.current?.focus(), 450);
    } else {
      gsap.to(screenRef.current, {
        y: '100%', duration: 0.34, ease: 'power3.in',
        onComplete: () => {
          setInputText('');
          setMessages([]);
        },
      });
    }
  }, [open]);

  const handleSend = () => {
    const q = inputText.trim();
    if (!q) return;
    setMessages(m => [...m, { role: 'user', text: q }]);
    setInputText('');
    setThinking(true);
    // Simulate AI reply
    setTimeout(() => {
      setThinking(false);
      setMessages(m => [...m, {
        role: 'ai',
        text: `Got it! Looking into "${q}" for you. I'll surface the best matches from your saved listings and nearby options.`,
      }]);
    }, 1600);
  };

  const handleChip = (text: string) => {
    setInputText(text);
    inputRef.current?.focus();
  };

  const hasConversation = messages.length > 0;

  return (
    <div
      ref={screenRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        transform: 'translateY(100%)',
        display: 'flex',
        flexDirection: 'column',
        background: '#0d0d14',
        overflow: 'hidden',
      }}
    >
      {/* ── Ambient orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          ref={orb1Ref}
          style={{
            position: 'absolute',
            top: '12%',
            left: '-10%',
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(58,119,255,0.22) 0%, transparent 72%)',
            filter: 'blur(24px)',
          }}
        />
        <div
          ref={orb2Ref}
          style={{
            position: 'absolute',
            top: '30%',
            right: '-8%',
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 72%)',
            filter: 'blur(24px)',
          }}
        />
        {/* Very subtle grid lines */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4 relative z-10 shrink-0">
        <div className="flex items-center gap-3">
          {/* Glowing AI orb */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(140deg, #3a77ff 0%, #6d28d9 100%)',
              boxShadow: '0 0 20px rgba(58,119,255,0.50), 0 0 40px rgba(58,119,255,0.20)',
            }}
          >
            <AIStarIcon size={20} />
          </div>
          <div>
            <p style={{ color: '#fff', fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>AI Assistant</p>
            <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 11, fontWeight: 500 }}>Powered by flat·AI</p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <X size={16} color="rgba(255,255,255,0.7)" />
        </button>
      </div>

      {/* ── Main content ── */}
      <div ref={contentRef} className="flex-1 flex flex-col overflow-hidden relative z-10">

        {!hasConversation ? (
          /* ──── IDLE STATE ──── */
          <div className="flex-1 flex flex-col items-center justify-start px-5 pt-6 overflow-y-auto hide-scrollbar pb-4">
            {/* Hero heading */}
            <div className="text-center mb-8">
              <p style={{ color: 'rgba(255,255,255,0.90)', fontSize: 24, fontWeight: 700, lineHeight: 1.3 }}>
                What are you{'\n'}looking for?
              </p>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, marginTop: 8, fontWeight: 500 }}>
                Compare listings, ask about commutes, get advice
              </p>
            </div>

            {/* ── Input box ── */}
            <div
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 20,
                padding: '14px 14px 14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: '0 0 0 1px rgba(58,119,255,0.10), 0 8px 32px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything about your search…"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'rgba(255,255,255,0.90)',
                  fontSize: 14,
                  fontWeight: 500,
                }}
                className="placeholder-[rgba(255,255,255,0.28)]"
              />
              <button
                onClick={inputText.trim() ? handleSend : undefined}
                style={{
                  width: 36, height: 36,
                  borderRadius: '50%',
                  background: inputText.trim()
                    ? 'linear-gradient(135deg,#3a77ff,#6d28d9)'
                    : 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 0.22s ease',
                  boxShadow: inputText.trim() ? '0 4px 16px rgba(58,119,255,0.45)' : 'none',
                  border: 'none',
                }}
              >
                {inputText.trim()
                  ? <ArrowUp size={15} color="#fff" />
                  : <Mic size={14} color="rgba(255,255,255,0.4)" />
                }
              </button>
            </div>

            {/* ── Suggestion chips ── */}
            <div ref={chipsRef} className="w-full mt-8 flex flex-col gap-5">
              {SUGGESTION_GROUPS.map(group => (
                <div key={group.category}>
                  <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
                    {group.category}
                  </p>
                  <div className="flex flex-col gap-2">
                    {group.prompts.map((p, i) => (
                      <button
                        key={i}
                        className="ai-chip text-left flex items-center gap-3"
                        onClick={() => handleChip(p.text)}
                        style={{
                          background: 'rgba(255,255,255,0.055)',
                          border: '1px solid rgba(255,255,255,0.09)',
                          borderRadius: 14,
                          padding: '11px 14px',
                          transition: 'background 0.18s ease, border-color 0.18s ease',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(58,119,255,0.12)';
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(58,119,255,0.28)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.055)';
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.09)';
                        }}
                      >
                        <span style={{ fontSize: 17, lineHeight: 1 }}>{p.emoji}</span>
                        <span style={{ color: 'rgba(255,255,255,0.80)', fontSize: 13, fontWeight: 500 }}>
                          {p.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ──── CONVERSATION STATE ──── */
          <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pt-2 pb-4 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'ai' && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mr-2 mt-0.5"
                    style={{ background: 'linear-gradient(140deg, #3a77ff 0%, #6d28d9 100%)' }}
                  >
                    <AIStarIcon size={14} />
                  </div>
                )}
                <div
                  style={{
                    maxWidth: '78%',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg,#3a77ff,#5b5ef4)'
                      : 'rgba(255,255,255,0.08)',
                    border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.09)' : 'none',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    padding: '10px 14px',
                    color: 'rgba(255,255,255,0.90)',
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: 1.5,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex justify-start items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(140deg, #3a77ff 0%, #6d28d9 100%)' }}
                >
                  <AIStarIcon size={14} />
                </div>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: '18px 18px 18px 4px',
                    padding: '12px 16px',
                    display: 'flex', gap: 5, alignItems: 'center',
                  }}
                >
                  {[0, 0.2, 0.4].map((d, i) => (
                    <div
                      key={i}
                      style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.5)',
                        animation: `pulse 1.2s ease-in-out ${d}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Bottom composer (conversation mode) ── */}
        {hasConversation && (
          <div
            className="shrink-0 px-4 pb-12 pt-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 18,
                padding: '12px 12px 12px 16px',
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask a follow-up…"
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: 'rgba(255,255,255,0.88)', fontSize: 13, fontWeight: 500,
                }}
                className="placeholder-[rgba(255,255,255,0.28)]"
              />
              <button
                onClick={handleSend}
                style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: inputText.trim()
                    ? 'linear-gradient(135deg,#3a77ff,#6d28d9)'
                    : 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 0.2s ease',
                  boxShadow: inputText.trim() ? '0 4px 14px rgba(58,119,255,0.4)' : 'none',
                  border: 'none',
                }}
              >
                <Send size={13} color={inputText.trim() ? '#fff' : 'rgba(255,255,255,0.3)'} style={{ transform: 'translateX(1px)' }} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        .placeholder-\\[rgba\\(255\\,255\\,255\\,0\\.28\\)\\]::placeholder {
          color: rgba(255,255,255,0.28);
        }
      `}</style>
    </div>
  );
}
