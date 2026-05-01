import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import { useNav } from '../context/TransitionContext';
import { StatusBar } from '../components/StatusBar';
import {
  ArrowLeft, Share, Heart, Star, CheckCircle2, ChevronRight,
  X, Video, Home, Sparkles, AlertCircle, CircleHelp, Send, Images,
} from 'lucide-react';
import { mockListings } from '../data/mockData';
import { GalleryOverlay } from '../components/GalleryOverlay';
import gsap from 'gsap';

/* ─────────── Static mock data ─────────── */

const ROOM_LABELS = ['Master Bedroom', 'Living Room', 'Kitchen', 'Balcony', 'Bathroom', 'Hall'];
const TOTAL_PHOTOS = 14;

const VERIFIED_CHIPS = ['Photos', 'Amenities', 'Owner'];

const TENTATIVE_MOVE_IN = 'May 15, 2026';

const COST_ITEMS = [
  { label: 'Monthly rent',           amount: '₹30,000', sub: null },
  { label: 'Security deposit',       amount: '₹60,000', sub: '2 months · refundable' },
  { label: 'Brokerage',              amount: 'Zero',     sub: 'Owner-listed' },
  { label: 'Rental agreement',       amount: '₹2,500',  sub: null },
  { label: 'Police verification',    amount: '₹500',    sub: null },
  { label: 'First month maintenance',amount: '₹3,500',  sub: null },
  { label: 'Estimated electricity',  amount: '₹2,400',  sub: 'Govt meter rate · ~300 units' },
];

const ANCHORS = [
  { emoji: '🏢', label: 'Office', km: '4.2 km', min: '12 min', color: '#f97316' },
  { emoji: '👤', label: 'Friend', km: '7 km',   min: '18 min', color: '#a855f7' },
  { emoji: '🏋️', label: 'Gym',    km: '2 km',   min: '6 min',  color: '#22c55e' },
];

const QUICK_FACTS = [
  '12 min walk to HSR Metro',
  '24 cafes within 1 km',
  'Safe to walk after 10 PM (verified)',
];

const ALL_AMENITIES: Record<string, { name: string; verified: boolean }[]> = {
  'In-flat': [
    { name: 'Parking',       verified: true  },
    { name: 'Gas Pipeline',  verified: true  },
    { name: 'Semi-Furnished',verified: true  },
    { name: 'Power Backup',  verified: true  },
    { name: 'Washing Area',  verified: true  },
    { name: 'Battery Charger',verified: false },
  ],
  'Building': [
    { name: 'Lift',           verified: true  },
    { name: 'Solar Panels',   verified: false },
    { name: 'CCTV',           verified: true  },
    { name: 'Security Guard', verified: true  },
  ],
  'Society': [
    { name: 'Society Pool',       verified: false },
    { name: 'Clubhouse',          verified: false },
    { name: 'Children Play Area', verified: true  },
  ],
  'Utilities': [
    { name: 'Govt Meter',       verified: true },
    { name: 'Piped Water',      verified: true },
    { name: '24/7 Water Supply',verified: true },
  ],
};

const INSPECTION_ITEMS = [
  { category: 'Structure', items: [
    { label: 'Walls — no seepage or cracks',   status: 'pass' },
    { label: 'Ceiling — no stains or dampness',status: 'pass' },
    { label: 'Flooring — no chips or loose tiles', status: 'pass' },
    { label: 'Windows — operable and latched', status: 'pass' },
    { label: 'Doors — all close flush',        status: 'pass' },
  ]},
  { category: 'Electrical', items: [
    { label: 'All switches functional',   status: 'pass' },
    { label: 'Earthing tested',           status: 'pass' },
    { label: 'MCB trips correctly',       status: 'pass' },
    { label: 'Fan / light fittings secure',status: 'pass' },
    { label: 'AC units checked',          status: 'note' },
  ]},
  { category: 'Plumbing', items: [
    { label: 'No leakage in pipes',       status: 'pass' },
    { label: 'Water pressure adequate',   status: 'pass' },
    { label: 'Hot water geyser works',    status: 'pass' },
    { label: 'Jet spray functional',      status: 'fail' },
    { label: 'Flush — no running water',  status: 'pass' },
  ]},
  { category: 'Kitchen', items: [
    { label: 'Gas pipeline connected',    status: 'pass' },
    { label: 'Chimney / exhaust works',   status: 'pass' },
    { label: 'Sink drains properly',      status: 'pass' },
    { label: 'Cabinets — no damage',      status: 'pass' },
    { label: 'Counter tiles intact',      status: 'pass' },
  ]},
  { category: 'Common Areas', items: [
    { label: 'Lift functional',            status: 'pass' },
    { label: 'Stairwell lights working',   status: 'pass' },
    { label: 'Parking space confirmed',    status: 'pass' },
    { label: 'Security / CCTV operational',status: 'pass' },
    { label: 'Society pool accessible',    status: 'fail' },
  ]},
  { category: 'Safety', items: [
    { label: 'Fire extinguisher present',  status: 'pass' },
    { label: 'Smoke detector installed',   status: 'pass' },
    { label: 'Main door locks properly',   status: 'pass' },
    { label: 'Gas valve operable',         status: 'pass' },
    { label: 'Emergency exit clear',       status: 'pass' },
  ]},
];

const REVIEWS_ALL = [
  { rating: 5, text: "The flat is well-located and has good natural lighting, which makes the space feel open and comfortable. The layout is functional, and basic amenities are in place. Overall, it's a solid option.", author: 'Sakshi', age: 27, since: '2024', type: 'Tenant', date: 'Jan 2026' },
  { rating: 4, text: 'Great locality and friendly neighbours. Water supply is consistent and the owner is very responsive to issues.', author: 'Rahul', age: 31, since: '2023', type: 'Neighbour', date: 'Mar 2026' },
  { rating: 5, text: 'Loved the balcony view and the area is super walkable. Metro is close by which is a huge plus for daily commute.', author: 'Priya', age: 25, since: '2023', type: 'Tenant', date: 'Dec 2025' },
  { rating: 3, text: 'Parking can be tight on weekends but otherwise a decent flat for the price. Street lighting could be better on inner lanes.', author: 'Arun', age: 29, since: '2022', type: 'Neighbour', date: 'Feb 2026' },
  { rating: 5, text: 'Very clean and well-maintained. The society management is responsive and there\'s always hot water.', author: 'Meera', age: 26, since: '2024', type: 'Tenant', date: 'Apr 2026' },
];

const OWNER_COMMITMENTS = [
  { task: 'Repaint master bedroom',              by: 'by May 15' },
  { task: 'Fix jet spray in attached bathroom',  by: 'by May 10' },
];

const NOT_INCLUDED = {
  unverified: ["Society pool — owner-declared but inspector couldn't access on visit. Update by April 30."],
  notPart: [
    'Brokerage: not applicable (owner-listed)',
    'Furniture beyond what\'s shown: not included',
    'Society club access: separate registration, owner can guide',
  ],
};

/* ─────────── Flat amenity availability map ─────────── */
const AMENITY_AVAIL: Record<string, boolean> = {};
Object.values(ALL_AMENITIES).forEach(items =>
  items.forEach(({ name, verified }) => { AMENITY_AVAIL[name] = verified; })
);

/* ─────────── Inline AI star icon ─────────── */
function AIStarIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <path d="M13 2C13 2 14.6 9.4 16.2 10.8C17.8 12.2 24 13 24 13C24 13 17.8 13.8 16.2 15.2C14.6 16.6 13 24 13 24C13 24 11.4 16.6 9.8 15.2C8.2 13.8 2 13 2 13C2 13 8.2 12.2 9.8 10.8C11.4 9.4 13 2 13 2Z" fill="white" />
      <path d="M20.5 4C20.5 4 21.1 6.6 21.9 7.1C22.7 7.6 24.5 8 24.5 8C24.5 8 22.7 8.4 21.9 8.9C21.1 9.4 20.5 12 20.5 12C20.5 12 19.9 9.4 19.1 8.9C18.3 8.4 16.5 8 16.5 8C16.5 8 18.3 7.6 19.1 7.1C19.9 6.6 20.5 4 20.5 4Z" fill="white" opacity="0.72" />
    </svg>
  );
}

/* ─────────── Reusable components ─────────── */

function BottomSheet({
  open, onClose, title, children,
}: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.42)', zIndex: 60,
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.28s ease',
        }}
      />
      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, width: '100%',
          background: 'white', borderRadius: '24px 24px 0 0',
          zIndex: 61, maxHeight: '86vh', display: 'flex', flexDirection: 'column',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.34s cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-9 h-1 rounded-full bg-[#e0e0e0]" />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#f0f0f0] shrink-0">
          <span className="text-[17px] font-bold text-black">{title}</span>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#f4f4f4] flex items-center justify-center">
            <X size={15} className="text-[#555]" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {children}
        </div>
      </div>
    </>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-[2px]">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11} className={i <= n ? 'text-yellow-400 fill-yellow-400' : 'text-[#ddd]'} />
      ))}
    </div>
  );
}

function Divider() {
  return <div className="mx-4 h-[1px] bg-[#f0f0f0]" />;
}

/* ─────────── Main page ─────────── */

export function ListingDetail() {
  const { id } = useParams();
  const { goBack } = useNav();
  const listing = mockListings.find(l => l.id === id) || mockListings[0];

  /* Gallery */
  const [photoIdx, setPhotoIdx]   = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [isLiked, setIsLiked]     = useState(false);
  const chevronRef                 = useRef<HTMLDivElement>(null);
  const galleryTouchX              = useRef<number | null>(null);
  const autoSlideRef               = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Tabs */
  const [activeTab, setActiveTab] = useState(0);
  const scrollRef                  = useRef<HTMLDivElement>(null);
  const tabsRef                    = useRef<HTMLDivElement>(null);
  const overviewRef                = useRef<HTMLDivElement>(null);
  const locationRef                = useRef<HTMLDivElement>(null);
  const reviewsRef                 = useRef<HTMLDivElement>(null);
  const ownerRef                   = useRef<HTMLDivElement>(null);

  /* Sheets */
  type SheetId = 'amenities' | 'cost' | 'inspection' | 'reviews' | 'walkthrough' | null;
  const [openSheet, setOpenSheet] = useState<SheetId>(null);

  /* Review filter */
  const [reviewFilter, setReviewFilter] = useState('All');

  /* Walkthrough scheduling state */
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [selectedTime, setSelectedTime]       = useState<string | null>(null);
  const [walkthroughConfirmed, setWalkthroughConfirmed] = useState(false);

  /* AI ask input */
  const [aiInput, setAiInput] = useState('');

  /* Swipe ghost hint */
  useEffect(() => {
    const el = chevronRef.current;
    if (!el) return;
    const tl = gsap.timeline({ delay: 1.1 });
    tl.fromTo(el, { opacity: 0, x: 0 }, { opacity: 0.9, x: -16, duration: 0.4, ease: 'power2.out' })
      .to(el, { opacity: 0, x: -26, duration: 0.45, ease: 'power2.in' });
  }, []);

  /* Reset/start auto-slide interval */
  const resetAutoSlide = useCallback(() => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    if (listing.images.length <= 1) return;
    autoSlideRef.current = setInterval(() => {
      setPhotoIdx(p => (p + 1) % listing.images.length);
    }, 2500);
  }, [listing.images.length]);

  /* Start auto-slide on mount, clean up on unmount */
  useEffect(() => {
    resetAutoSlide();
    return () => { if (autoSlideRef.current) clearInterval(autoSlideRef.current); };
  }, [resetAutoSlide]);

  /* Slide to photo index */
  const slideTo = useCallback((raw: number) => {
    const idx = Math.max(0, Math.min(raw, listing.images.length - 1));
    setPhotoIdx(idx);
    resetAutoSlide();
  }, [listing.images.length, resetAutoSlide]);

  const onTouchStart = (e: React.TouchEvent) => { galleryTouchX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (galleryTouchX.current === null) return;
    const d = galleryTouchX.current - e.changedTouches[0].clientX;
    if (Math.abs(d) > 32) {
      setPhotoIdx(p => {
        const next = d > 0 ? p + 1 : p - 1;
        return Math.max(0, Math.min(next, listing.images.length - 1));
      });
      resetAutoSlide();
    }
    galleryTouchX.current = null;
  };

  /* Tab scroll tracking */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const tabBottom = tabsRef.current?.getBoundingClientRect().bottom ?? 100;
      const refs = [overviewRef, locationRef, reviewsRef, ownerRef];
      let cur = 0;
      refs.forEach((r, i) => {
        if (r.current && r.current.getBoundingClientRect().top <= tabBottom + 32) cur = i;
      });
      setActiveTab(cur);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>, idx: number) => {
    setActiveTab(idx);
    if (!ref.current || !scrollRef.current) return;
    const tabH = tabsRef.current?.offsetHeight ?? 44;
    scrollRef.current.scrollTo({ top: ref.current.offsetTop - tabH - 4, behavior: 'smooth' });
  };

  const TABS = [
    { label: 'Overview', ref: overviewRef },
    { label: 'Location', ref: locationRef },
    { label: 'Reviews',  ref: reviewsRef  },
    { label: 'Owner',    ref: ownerRef    },
  ];

  const filteredReviews = REVIEWS_ALL.filter(r => {
    if (reviewFilter === 'By tenants')   return r.type === 'Tenant';
    if (reviewFilter === 'By neighbours')return r.type === 'Neighbour';
    if (reviewFilter === 'Positive')     return r.rating >= 4;
    if (reviewFilter === 'Critical')     return r.rating < 4;
    return true;
  });

  const VERIFIED_AMENITY_NAMES = ['Parking', 'Gas Pipeline', 'Lift', 'Power Backup', 'Semi Furnished', 'Govt Meter'];

  /* ── Render ── */
  return (
    <div className="bg-white w-full h-full flex flex-col relative overflow-hidden">
      {/* Status bar overlay */}
      <div className="absolute top-0 left-0 w-full z-40 pointer-events-none">
        <StatusBar dark={false} />
      </div>

      {/* ── Scrollable body ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto hide-scrollbar pb-[90px]">

        {/* ════════ S1 — PHOTO GALLERY ════════ */}
        <div
          className="relative w-full overflow-hidden"
          style={{ height: 238 }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Each photo, stacked absolutely, sliding via CSS transform */}
          {listing.images.map((src, i) => (
            <div
              key={src}
              className="absolute inset-0"
              style={{
                transform: `translateX(${(i - photoIdx) * 100}%)`,
                transition: 'transform 0.42s cubic-bezier(0.25,0.46,0.45,0.94)',
                willChange: 'transform',
              }}
            >
              <img src={src} alt={ROOM_LABELS[i] ?? 'Room'} className="w-full h-full object-cover" />
            </div>
          ))}

          {/* Gradient overlay */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.52) 0%,transparent 38%,rgba(0,0,0,0.38) 100%)' }}
          />

          {/* Ghost swipe chevron */}
          <div
            ref={chevronRef}
            className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none"
            style={{ opacity: 0 }}
          >
            <ChevronRight size={46} className="text-white drop-shadow-xl" strokeWidth={1.4} />
          </div>

          {/* ── Top controls ── */}
          <div className="absolute top-[50px] left-0 right-0 px-3 flex items-center justify-between z-10">
            <button
              onClick={goBack}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
            >
              <ArrowLeft size={18} className="text-white" />
            </button>
            <div className="flex items-center gap-2">
              {/* Video button */}
              <button className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <Video size={15} className="text-white" />
              </button>
              <button className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <Share size={15} className="text-white" />
              </button>
              <button
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
                onClick={() => setIsLiked(p => !p)}
              >
                <Heart size={15} className={isLiked ? 'text-red-400 fill-red-400' : 'text-white'} />
              </button>
            </div>
          </div>


          {/* ── Bottom row: Inspected + dot indicator ── */}
          <div
            className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center justify-between z-10"
            style={{ background: 'linear-gradient(89.9deg,#3a77ff 6.9%,rgba(50,188,69,0) 54%)' }}
          >
            <div className="flex items-center gap-1.5">
              <Home size={13} className="text-white shrink-0" />
              <span className="text-white text-[10px] font-semibold">Inspected: {listing.inspected}</span>
            </div>
            <button
              onClick={() => setGalleryOpen(true)}
              className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-2.5 py-[5px] rounded-full border border-white/20 active:scale-95 transition-transform"
            >
              <Images size={11} className="text-white" />
              <span className="text-white text-[11px] font-medium">View Gallery</span>
              <span className="text-white/55 text-[11px]">{photoIdx + 1}/{listing.images.length}</span>
            </button>
          </div>
        </div>

        {/* ════════ WALKTHROUGH NOTIFICATION BANNER ════════ */}
        <button
          onClick={() => { setOpenSheet('walkthrough'); setWalkthroughConfirmed(false); setSelectedTime(null); }}
          className="w-full flex items-center justify-between px-4 py-2 border-b border-[#d2e0ff]"
          style={{ background: 'linear-gradient(90deg,#eef3ff 0%,#f5f8ff 100%)' }}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3a77ff] opacity-55" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3a77ff]" />
            </span>
            <span className="text-[12px] font-semibold text-[#3a77ff]">Online walkthrough available</span>
          </div>
          <span className="text-[11px] font-bold text-[#3a77ff] shrink-0 ml-2">Schedule ›</span>
        </button>

        {/* ════════ S2 — TITLE + METADATA ════════ */}
        <div className="px-4 pt-4 pb-4 border-b border-[#f2f2f2]">
          <h1 className="text-[21px] font-bold text-black leading-snug">{listing.title}</h1>
          <p className="text-[13px] text-[#666] mt-1.5 font-medium">
            {listing.distances.office} from your office · 12 min to HSR Metro
          </p>
          <p className="text-[13px] text-[#666] mt-0.5 font-medium">
            Tentative move-in · {TENTATIVE_MOVE_IN}
          </p>

          {/* Metadata chips */}
          <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-0.5">
            <div className="flex items-center gap-1.5 bg-[#f2f2f2] rounded-full px-3 py-[7px] shrink-0">
              <span className="text-[13px] leading-none">🛋️</span>
              <span className="text-[12px] font-semibold text-[#333]">Semi-furnished</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f2f2f2] rounded-full px-3 py-[7px] shrink-0">
              <span className="text-[13px] leading-none">📐</span>
              <span className="text-[12px] font-semibold text-[#333]">850 sq ft</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#edfcf1] border border-[#b6ecc4] rounded-full px-3 py-[7px] shrink-0">
              <CheckCircle2 size={12} className="text-[#1a8a2e] shrink-0" />
              <span className="text-[12px] font-semibold text-[#1a8a2e]">Gated society</span>
            </div>
          </div>

          {/* Source chips */}
          <div className="flex gap-2 mt-2.5 flex-wrap">
            <span className="text-[11px] font-semibold text-[#555] bg-[#f2f2f2] px-2.5 py-1 rounded-full">
              New listing · {listing.postedDaysAgo} days old
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#1a8a2e] bg-[#edfcf1] border border-[#b6ecc4] px-2.5 py-1 rounded-full">
              <CheckCircle2 size={10} /> Posted by owner ✓
            </span>
          </div>
        </div>

        {/* ════════ S3 — COST BLOCK ════════ */}
        <div className="px-4 pt-3 pb-3 border-b border-[#f2f2f2]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#aaa] tracking-[0.12em] uppercase leading-none mb-1">Monthly Rent</p>
              <div className="flex items-baseline gap-1">
                <span className="text-[22px] font-bold text-black">{listing.price}</span>
                <span className="text-[12px] font-medium text-[#999]">/ mo</span>
              </div>
            </div>
            <button
              className="text-[12px] font-semibold text-[#3a77ff] border border-[#d2e0ff] bg-[#eef3ff] px-3 py-1.5 rounded-full shrink-0"
              onClick={() => setOpenSheet('cost')}
            >
              Full breakdown ›
            </button>
          </div>
          <p className="text-[11px] text-[#999] mt-1.5">
            True move-in cost <span className="font-semibold text-[#555]">{listing.trueMoveIn}</span>
          </p>
        </div>

        {/* ════════ S4 — VERIFIED AT A GLANCE ════════ */}
        <div className="px-4 pt-4 pb-3 border-b border-[#f2f2f2]">
          <p className="text-[15px] font-bold text-black mb-3">What's verified</p>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-0.5">
            {VERIFIED_CHIPS.map(chip => (
              <div key={chip} className="flex items-center gap-1.5 bg-[#edfcf1] border border-[#b6ecc4] px-3 py-[7px] rounded-full shrink-0">
                <CheckCircle2 size={12} className="text-[#1a8a2e]" />
                <span className="text-[12px] font-semibold text-[#1a8a2e]">{chip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ════════ S5 — ACTIVITY STRIP ════════ */}
        <div className="bg-[#f8f9fa] px-4 py-2.5 border-b border-[#f0f0f0]">
          <p className="text-[12px] font-medium text-[#777]">
            8 enquiries this week ·{' '}
            <span className="font-semibold" style={{ color: '#d97706', background: '#fef3c7', borderRadius: 6, padding: '1px 7px' }}>
              Owner replies in {listing.ownerReplyTime}
            </span>
          </p>
        </div>

        {/* ════════ STICKY TABS ════════ */}
        <div
          ref={tabsRef}
          className="sticky top-0 bg-white z-20 flex border-b border-[#ebebeb]"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        >
          {TABS.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => scrollToSection(tab.ref as React.RefObject<HTMLDivElement>, i)}
              className="flex-1 py-[11px] relative text-[13px] font-semibold transition-colors duration-200"
              style={{ color: activeTab === i ? '#3a77ff' : '#999' }}
            >
              {tab.label}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full transition-opacity duration-200"
                style={{ background: '#3a77ff', opacity: activeTab === i ? 1 : 0 }}
              />
            </button>
          ))}
        </div>

        {/* ════════ OVERVIEW SECTION ════════ */}
        <div ref={overviewRef} className="pt-5 pb-2">
          {/* What you're getting */}
          <div className="px-4">
            <p className="text-[16px] font-bold text-black mb-3">What you're getting</p>
            <div className="grid grid-cols-2 gap-2">
              {listing.amenities.slice(0, 6).map((name, i) => {
                const avail = AMENITY_AVAIL[name] !== false;
                return (
                  <div key={i} className={`flex items-center justify-between rounded-[11px] px-3 py-2.5 border ${avail ? 'bg-[#f8f9fa] border-[#f0f0f0]' : 'bg-[#fafafa] border-[#f0f0f0]'}`}>
                    <span className={`text-[13px] font-medium ${avail ? 'text-black' : 'text-[#bbb] line-through'}`}>{name}</span>
                    {avail
                      ? <CheckCircle2 size={15} className="text-[#1a8a2e] shrink-0" />
                      : <X size={13} className="text-[#d0d0d0] shrink-0" />
                    }
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setOpenSheet('amenities')}
              className="w-full mt-3 py-2.5 border border-[#e2e2e2] rounded-[11px] text-[13px] font-semibold text-[#3a77ff]"
            >
              +{listing.amenities.length - 6 + 14} more amenities
            </button>
          </div>

          {/* ── AI Ask Input ── */}
          <div className="px-4 pt-4">
            <div
              className="flex items-center gap-3 px-3.5 py-3 rounded-[18px]"
              style={{
                background: 'linear-gradient(135deg,rgba(58,119,255,0.07) 0%,rgba(28,27,31,0.03) 100%)',
                border: '1px solid rgba(58,119,255,0.18)',
                boxShadow: '0 2px 12px rgba(58,119,255,0.08)',
              }}
            >
              {/* AI circle */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: 'linear-gradient(160deg,#3a77ff 0%,#1c1b1f 100%)',
                  boxShadow: '0 2px 8px rgba(58,119,255,0.32)',
                }}
              >
                <AIStarIcon size={16} />
              </div>
              <input
                type="text"
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                placeholder="Ask anything about this listing…"
                className="flex-1 bg-transparent border-none outline-none text-[13px] text-black"
                style={{ color: '#111' }}
              />
              <button
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  background: aiInput.trim() ? '#3a77ff' : 'rgba(0,0,0,0.07)',
                  boxShadow: aiInput.trim() ? '0 2px 8px rgba(58,119,255,0.32)' : 'none',
                }}
              >
                <Send size={12} style={{ color: aiInput.trim() ? '#fff' : '#aaa', transform: 'translateX(1px)' }} />
              </button>
            </div>
          </div>

          <Divider />

          {/* About this property */}
          <div className="px-4 pt-5 pb-4">
            <p className="text-[16px] font-bold text-black mb-2.5">About this property</p>
            <div className="flex items-stretch bg-[#f8f9fa] border border-[#f0f0f0] rounded-[12px] overflow-hidden mb-3">
              {[
                { label: 'Built',    value: listing.details.built },
                { label: 'Painted', value: listing.details.lastPainted },
                { label: 'Tenants', value: `${listing.details.previousTenants} prev.` },
              ].map((item, idx, arr) => (
                <div key={item.label}
                  className="flex-1 flex flex-col items-center justify-center py-2.5"
                  style={{ borderRight: idx < arr.length - 1 ? '1px solid #efefef' : 'none' }}
                >
                  <span className="text-[13px] font-bold text-black leading-tight">{item.value}</span>
                  <span className="text-[10px] font-medium text-[#aaa] mt-0.5">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="bg-[#eef3ff] border border-[#d2e0ff] rounded-[12px] px-4 py-3 flex items-center justify-between">
              <p className="text-[12px] font-medium text-[#444]">
                Last inspected <span className="font-semibold">{listing.details.lastInspected}</span> by inspector
              </p>
              <button
                onClick={() => setOpenSheet('inspection')}
                className="flex items-center gap-0.5 text-[12px] font-semibold text-[#3a77ff] whitespace-nowrap ml-2 shrink-0"
              >
                See report <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>

        <Divider />

        {/* ════════ LOCATION SECTION ════════ */}
        <div ref={locationRef} className="px-4 pt-5 pb-4">
          <p className="text-[16px] font-bold text-black mb-3">Living in HSR Sector 6</p>

          {/* Map mockup */}
          <div className="relative rounded-[16px] overflow-hidden mb-3 border border-[#e8e8e8]" style={{ height: 182 }}>
            {/* Base */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(145deg,#e2eedf,#d3e8d0 35%,#c5daf0 68%,#b6cde8)' }} />
            {/* Block grid */}
            <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.18 }}>
              {[40,80,120,160].map(y => <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="#555" strokeWidth="0.6" />)}
              {[55,110,165,220,275,330].map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="200" stroke="#555" strokeWidth="0.6" />)}
            </svg>
            {/* Roads */}
            <svg className="absolute inset-0 w-full h-full">
              <path d="M0,91 Q85,80 170,91 T340,87" stroke="white" strokeWidth="7" fill="none" opacity="0.88" />
              <path d="M0,122 Q85,115 170,122 T340,118" stroke="#f0ead5" strokeWidth="5" fill="none" opacity="0.75" />
              <path d="M170,0 Q172,55 170,91 T172,182" stroke="white" strokeWidth="5" fill="none" opacity="0.88" />
              <path d="M280,0 Q282,55 280,91 T282,182" stroke="#f0ead5" strokeWidth="4" fill="none" opacity="0.65" />
              {/* Dashed anchor lines */}
              <line x1="43%" y1="47%" x2="76%" y2="20%" stroke="#3a77ff" strokeWidth="1.8" strokeDasharray="5,4" opacity="0.75" />
              <line x1="43%" y1="47%" x2="73%" y2="70%" stroke="#a855f7" strokeWidth="1.8" strokeDasharray="5,4" opacity="0.75" />
              <line x1="43%" y1="47%" x2="19%" y2="73%" stroke="#22c55e" strokeWidth="1.8" strokeDasharray="5,4" opacity="0.75" />
            </svg>
            {/* Property pin */}
            <div className="absolute" style={{ top: '43%', left: '41%', transform: 'translate(-50%,-50%)' }}>
              <div className="w-5 h-5 rounded-full bg-[#3a77ff] border-[2.5px] border-white flex items-center justify-center shadow-lg">
                <Home size={9} className="text-white" />
              </div>
            </div>
            {/* Office */}
            <div className="absolute" style={{ top: '17%', left: '74%', transform: 'translate(-50%,-50%)' }}>
              <div className="w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-white shadow" />
              <span className="absolute -top-[18px] left-1/2 -translate-x-1/2 text-[8px] font-bold text-orange-700 whitespace-nowrap">Office</span>
            </div>
            {/* Friend */}
            <div className="absolute" style={{ top: '68%', left: '71%', transform: 'translate(-50%,-50%)' }}>
              <div className="w-3.5 h-3.5 rounded-full bg-purple-500 border-2 border-white shadow" />
              <span className="absolute -top-[18px] left-1/2 -translate-x-1/2 text-[8px] font-bold text-purple-700 whitespace-nowrap">Friend</span>
            </div>
            {/* Gym */}
            <div className="absolute" style={{ top: '72%', left: '17%', transform: 'translate(-50%,-50%)' }}>
              <div className="w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white shadow" />
              <span className="absolute -top-[18px] left-1/2 -translate-x-1/2 text-[8px] font-bold text-green-700 whitespace-nowrap">Gym</span>
            </div>
          </div>

          {/* Anchor distance chips — compact 3-column */}
          <div className="flex gap-2 mb-3">
            {ANCHORS.map(a => (
              <div key={a.label} className="flex-1 bg-[#f8f9fa] border border-[#f0f0f0] rounded-[12px] py-2.5 flex flex-col items-center gap-0.5">
                <span className="text-[18px] leading-none">{a.emoji}</span>
                <span className="text-[12px] font-bold text-black mt-0.5">{a.min}</span>
                <span className="text-[10px] text-[#aaa]">{a.km}</span>
              </div>
            ))}
          </div>

          {/* Quick facts */}
          <div className="flex flex-col gap-2 mb-4">
            {QUICK_FACTS.map(fact => (
              <div key={fact} className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-[#1a8a2e] shrink-0" />
                <span className="text-[12px] font-medium text-[#444]">{fact}</span>
              </div>
            ))}
          </div>

          {/* View on map CTA */}
          <a
            href={`https://www.google.com/maps/search/HSR+Layout+Sector+6+Bangalore`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 border border-[#3a77ff] rounded-[11px] text-[13px] font-semibold text-[#3a77ff]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            View on map
          </a>
        </div>

        <Divider />

        {/* ════════ REVIEWS SECTION ════════ */}
        <div ref={reviewsRef} className="px-4 pt-5 pb-4">
          <p className="text-[16px] font-bold text-black mb-3">What residents say</p>

          {/* AI summary */}
          <div className="bg-[#f5f0ff] border border-[#e0d5ff] rounded-[14px] px-4 py-4 mb-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={13} className="text-[#7c3aed]" />
              <span className="text-[12px] font-bold text-[#7c3aed] tracking-wide">AI Summary</span>
            </div>
            <p className="text-[13px] text-[#333] leading-[1.58]">
              Residents love the cafe density and metro proximity. A few mention parking gets tight on weekends, and street lighting on the inner lanes could be better.
            </p>
            <p className="text-[11px] text-[#999] mt-2">Based on 14 reviews from current and past residents</p>
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 mb-4 pb-0.5">
            {['All', 'By tenants', 'By neighbours', 'Positive', 'Critical'].map(f => (
              <button
                key={f}
                onClick={() => setReviewFilter(f)}
                className="shrink-0 px-3 py-[7px] rounded-full border text-[12px] font-semibold transition-colors duration-150"
                style={{
                  background: reviewFilter === f ? '#3a77ff' : 'white',
                  borderColor: reviewFilter === f ? '#3a77ff' : '#e0e0e0',
                  color: reviewFilter === f ? 'white' : '#666',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Review cards */}
          <div className="flex flex-col gap-3">
            {filteredReviews.slice(0, 2).map((r, i) => (
              <div key={i} className="bg-[#f8f9fa] border border-[#f0f0f0] rounded-[14px] p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-[13px] font-bold text-black">{r.author}, {r.age}</p>
                    <p className="text-[11px] text-[#999]">{r.type} · resident since {r.since}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Stars n={r.rating} />
                    <span className="text-[10px] text-[#bbb]">{r.date}</span>
                  </div>
                </div>
                <p className="text-[12px] text-[#444] leading-[1.6]">{r.text}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setOpenSheet('reviews')}
            className="w-full mt-3 py-2.5 border border-[#e2e2e2] rounded-[11px] text-[13px] font-semibold text-[#3a77ff]"
          >
            +11 more reviews
          </button>
        </div>

        <Divider />

        {/* ════════ OWNER SECTION ════════ */}
        <div ref={ownerRef} className="px-4 pt-5 pb-4">

          {/* Live walkthrough card */}
          <div className="overflow-hidden rounded-[16px] border border-[#d2e0ff] mb-5"
            style={{ background: 'linear-gradient(135deg,#eef3ff 0%,#f5f8ff 100%)' }}
          >
            {/* Available badge strip */}
            <div className="flex items-center gap-2 bg-[#3a77ff] px-4 py-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <span className="text-white text-[11px] font-bold tracking-wide">
                Online walkthrough available for this listing
              </span>
            </div>
            {/* Body */}
            <div className="px-4 py-4">
              <p className="text-[15px] font-bold text-black mb-1">See it live, from wherever you are</p>
              <p className="text-[12px] text-[#555] leading-[1.55] mb-3">
                A 15-minute video call with the owner — they walk through every room in real time. You can ask questions on the spot.
              </p>
              {/* Feature pills */}
              <div className="flex gap-2 mb-4">
                {[['🕐', '~15 min'], ['🎥', 'Recorded'], ['₹0', 'Free']].map(([icon, label]) => (
                  <div key={label} className="flex items-center gap-1 bg-white border border-[#dce8ff] rounded-full px-2.5 py-1">
                    <span className="text-[10px]">{icon}</span>
                    <span className="text-[11px] font-semibold text-[#3a77ff]">{label}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setOpenSheet('walkthrough'); setWalkthroughConfirmed(false); setSelectedTime(null); }}
                className="w-full h-[42px] rounded-[11px] bg-[#3a77ff] text-white text-[13px] font-semibold shadow-[0_2px_12px_rgba(58,119,255,0.3)]"
              >
                Schedule online walkthrough
              </button>
              <p className="text-[11px] text-[#999] mt-2 text-center">Owner confirms within ~6 hours</p>
            </div>
          </div>

          {/* About the owner */}
          <p className="text-[16px] font-bold text-black mb-3">About the owner</p>
          <div className="bg-[#f8f9fa] border border-[#f0f0f0] rounded-[16px] p-4 mb-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full bg-[#3a77ff]/14 flex items-center justify-center shrink-0">
                <span className="text-[17px] font-bold text-[#3a77ff]">A</span>
              </div>
              <div>
                <p className="text-[15px] font-bold text-black">Anita M.</p>
                <p className="text-[11px] text-[#999]">Owner · listed since 2024</p>
              </div>
            </div>
            {/* Verification */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {['KYC verified', 'ID verified', 'Property ownership verified'].map(b => (
                <span key={b} className="flex items-center gap-1 bg-[#edfcf1] border border-[#b6ecc4] px-2 py-[4px] rounded-full text-[11px] font-semibold text-[#1a8a2e]">
                  <CheckCircle2 size={10} /> {b}
                </span>
              ))}
            </div>
            {/* Stats row */}
            <div className="flex gap-5 mb-3">
              {[['3 listed', 'Properties'], ['4.6 ★', 'Rating'], ['4 hours', 'Replies in']].map(([val, lbl]) => (
                <div key={lbl} className="flex flex-col">
                  <span className="text-[13px] font-bold text-black">{val}</span>
                  <span className="text-[10px] text-[#aaa] font-medium">{lbl}</span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-[#ebebeb]">
              <p className="text-[11px] text-[#888] mb-2">📵 Phone number stays masked until you both agree to share.</p>
              <div className="flex flex-wrap gap-1.5">
                {['Open to bachelors ✓', 'Mixed-gender visitors ✓', 'No curfew ✓'].map(r => (
                  <span key={r} className="text-[11px] font-medium text-[#444] bg-white border border-[#e5e5e5] px-2 py-[4px] rounded-full">{r}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Owner commitments */}
          <div className="bg-[#fffbf0] border border-[#f5e199] rounded-[14px] p-4 mb-3">
            <p className="text-[13px] font-bold text-[#8a6400] mb-2.5">Owner has committed to fix</p>
            <div className="flex flex-col gap-2.5">
              {OWNER_COMMITMENTS.map((c, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-[#555]">{c.task}</span>
                  <span className="text-[11px] font-bold text-[#8a6400] bg-[#fef3c7] px-2 py-0.5 rounded-full ml-2 shrink-0">{c.by}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#bbb] mt-3 leading-[1.5]">
              These commitments are tracked. If unmet, request a refund of brokerage.
            </p>
          </div>

          {/* What's not included */}
          <p className="text-[15px] font-bold text-black mb-2.5">What's not included</p>
          <div className="bg-[#f8f9fa] border border-[#f0f0f0] rounded-[14px] p-4">
            {NOT_INCLUDED.unverified.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest mb-2">Honest disclosure</p>
                {NOT_INCLUDED.unverified.map((item, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <AlertCircle size={13} className="text-[#f59e0b] shrink-0 mt-0.5" />
                    <span className="text-[12px] text-[#555] leading-[1.5]">{item}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest mb-2">Not part of listing</p>
            {NOT_INCLUDED.notPart.map((item, i) => (
              <div key={i} className="flex gap-2 items-start mb-1.5">
                <span className="text-[#ccc] text-[13px] shrink-0 mt-[-1px]">·</span>
                <span className="text-[12px] text-[#555] leading-[1.5]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-2" />
      </div>

      {/* ════════ STICKY BOTTOM CTA ════════ */}
      <div className="absolute bottom-0 left-0 w-full bg-white border-t border-[#ebebeb] px-4 pt-3 pb-8 flex items-center gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.07)] z-30">
        <button className="flex-1 h-[44px] rounded-[12px] border-[1.5px] border-[#3a77ff] text-[#3a77ff] text-[13px] font-semibold whitespace-nowrap">
          Contact owner
        </button>
        <button
          onClick={() => { setOpenSheet('walkthrough'); setWalkthroughConfirmed(false); setSelectedTime(null); }}
          className="flex-[1.4] h-[44px] rounded-[12px] bg-[#3a77ff] text-white text-[13px] font-semibold shadow-[0_3px_14px_rgba(58,119,255,0.32)] whitespace-nowrap"
        >
          Schedule visit
        </button>
      </div>

      {/* iOS home indicator */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-black rounded-full z-50" />

      {/* ════════ BOTTOM SHEETS ════════ */}

      {/* Amenities */}
      <BottomSheet open={openSheet === 'amenities'} onClose={() => setOpenSheet(null)} title="All amenities">
        {Object.entries(ALL_AMENITIES).map(([cat, items]) => (
          <div key={cat} className="mb-5">
            <p className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest mb-2.5">{cat}</p>
            {items.map(item => (
              <div key={item.name} className="flex items-center justify-between py-2.5 border-b border-[#f5f5f5]">
                <span className={`text-[14px] font-medium ${item.verified ? 'text-black' : 'text-[#bbb] line-through'}`}>
                  {item.name}
                </span>
                {item.verified
                  ? <CheckCircle2 size={16} className="text-[#1a8a2e]" />
                  : <X size={14} className="text-[#d0d0d0]" />
                }
              </div>
            ))}
          </div>
        ))}
        <p className="text-[11px] text-[#bbb] mt-1">Strikethrough items are not available in this flat.</p>
      </BottomSheet>

      {/* Cost breakdown */}
      <BottomSheet open={openSheet === 'cost'} onClose={() => setOpenSheet(null)} title="What you'll actually pay">
        {COST_ITEMS.map((item, i) => (
          <div key={i} className="flex items-start justify-between py-3 border-b border-[#f5f5f5]">
            <div>
              <p className="text-[14px] font-medium text-black">{item.label}</p>
              {item.sub && <p className="text-[11px] text-[#999] mt-0.5">{item.sub}</p>}
            </div>
            <span className="text-[14px] font-semibold text-black ml-4 shrink-0">{item.amount}</span>
          </div>
        ))}
        <div className="flex items-center justify-between py-4 border-t border-[#f0f0f0] mt-1">
          <p className="text-[15px] font-bold text-black">Total to move in</p>
          <span className="text-[15px] font-bold text-[#3a77ff]">₹98,900</span>
        </div>
        <button className="text-[13px] font-semibold text-[#3a77ff]">How is this calculated? ›</button>
      </BottomSheet>

      {/* Inspection report */}
      <BottomSheet open={openSheet === 'inspection'} onClose={() => setOpenSheet(null)} title={`Inspection report · ${listing.details.lastInspected}`}>
        <p className="text-[12px] text-[#999] mb-4">Inspector: Rajesh Kumar · 30-point verification</p>
        {INSPECTION_ITEMS.map(section => (
          <div key={section.category} className="mb-5">
            <p className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest mb-2.5">{section.category}</p>
            {section.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-[#f5f5f5]">
                <span className="text-[13px] font-medium text-black">{item.label}</span>
                <span className="shrink-0 ml-3">
                  {item.status === 'pass' && <CheckCircle2 size={15} className="text-[#1a8a2e]" />}
                  {item.status === 'fail' && <AlertCircle  size={15} className="text-red-500" />}
                  {item.status === 'note' && <AlertCircle  size={15} className="text-[#f59e0b]" />}
                </span>
              </div>
            ))}
          </div>
        ))}
      </BottomSheet>

      {/* All reviews */}
      <BottomSheet open={openSheet === 'reviews'} onClose={() => setOpenSheet(null)} title="All reviews">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5 mb-4 pb-0.5">
          {['All', 'By tenants', 'By neighbours', 'Positive', 'Critical'].map(f => (
            <button
              key={f}
              onClick={() => setReviewFilter(f)}
              className="shrink-0 px-3 py-[7px] rounded-full border text-[12px] font-semibold"
              style={{
                background: reviewFilter === f ? '#3a77ff' : 'white',
                borderColor: reviewFilter === f ? '#3a77ff' : '#e0e0e0',
                color: reviewFilter === f ? 'white' : '#666',
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {filteredReviews.map((r, i) => (
            <div key={i} className="bg-[#f8f9fa] border border-[#f0f0f0] rounded-[14px] p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-[13px] font-bold text-black">{r.author}, {r.age}</p>
                  <p className="text-[11px] text-[#999]">{r.type} · resident since {r.since}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Stars n={r.rating} />
                  <span className="text-[10px] text-[#bbb]">{r.date}</span>
                </div>
              </div>
              <p className="text-[12px] text-[#444] leading-[1.6]">{r.text}</p>
            </div>
          ))}
        </div>
      </BottomSheet>

      {/* Walkthrough scheduler */}
      <WalkthroughSheet
        open={openSheet === 'walkthrough'}
        onClose={() => setOpenSheet(null)}
        selectedDateIdx={selectedDateIdx}
        setSelectedDateIdx={setSelectedDateIdx}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        confirmed={walkthroughConfirmed}
        setConfirmed={setWalkthroughConfirmed}
      />

      <GalleryOverlay
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        listingImages={listing.images}
      />
    </div>
  );
}

/* ─────────── Walkthrough scheduling sheet ─────────── */

const WALK_DATES = (() => {
  const base = new Date(2026, 4, 1);
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return {
      day: days[d.getDay()],
      date: d.getDate(),
      month: months[d.getMonth()],
      label: `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`,
    };
  });
})();

const WALK_SLOTS: Record<string, { time: string; booked: boolean }[]> = {
  Morning: [
    { time: '9:00 AM',  booked: false },
    { time: '10:00 AM', booked: true  },
    { time: '11:00 AM', booked: false },
    { time: '11:30 AM', booked: false },
  ],
  Afternoon: [
    { time: '1:00 PM',  booked: false },
    { time: '2:30 PM',  booked: true  },
    { time: '3:30 PM',  booked: false },
    { time: '4:30 PM',  booked: false },
  ],
  Evening: [
    { time: '5:30 PM',  booked: true  },
    { time: '6:30 PM',  booked: false },
    { time: '7:30 PM',  booked: false },
    { time: '8:00 PM',  booked: false },
  ],
};

function WalkthroughSheet({
  open, onClose,
  selectedDateIdx, setSelectedDateIdx,
  selectedTime, setSelectedTime,
  confirmed, setConfirmed,
}: {
  open: boolean; onClose: () => void;
  selectedDateIdx: number; setSelectedDateIdx: (i: number) => void;
  selectedTime: string | null; setSelectedTime: (t: string | null) => void;
  confirmed: boolean; setConfirmed: (b: boolean) => void;
}) {
  const selected = WALK_DATES[selectedDateIdx];
  const canConfirm = !!selectedTime && !confirmed;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.42)', zIndex: 60,
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.28s ease',
        }}
      />
      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, width: '100%',
          background: 'white', borderRadius: '24px 24px 0 0',
          zIndex: 61, maxHeight: '92vh', display: 'flex', flexDirection: 'column',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.34s cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-9 h-1 rounded-full bg-[#e0e0e0]" />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#f0f0f0] shrink-0">
          <div>
            <p className="text-[17px] font-bold text-black">Schedule walkthrough</p>
            <p className="text-[11px] text-[#999] mt-0.5">Live video · ~15 min · Free · Recorded</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#f4f4f4] flex items-center justify-center">
            <X size={15} className="text-[#555]" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pb-6">
          {confirmed ? (
            /* ── Confirmed state ── */
            <div className="flex flex-col items-center px-6 py-10 text-center">
              <div className="w-16 h-16 rounded-full bg-[#edfcf1] flex items-center justify-center mb-4">
                <CheckCircle2 size={32} className="text-[#1a8a2e]" />
              </div>
              <p className="text-[18px] font-bold text-black mb-1">Walkthrough requested!</p>
              <p className="text-[13px] text-[#555] leading-[1.6] mb-5">
                {selected?.label} at {selectedTime}<br />
                Anita M. will confirm within ~6 hours.
              </p>
              <div className="w-full bg-[#f8f9fa] border border-[#f0f0f0] rounded-[14px] p-4 mb-5 text-left">
                <p className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest mb-3">What happens next</p>
                {[
                  "You'll receive a confirmation message from the owner",
                  "A video link (Meet / Zoom) will be shared before the call",
                  "The session is recorded and sent to you afterwards",
                ].map((step, i) => (
                  <div key={i} className="flex gap-3 items-start mb-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#3a77ff] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white text-[9px] font-bold">{i + 1}</span>
                    </div>
                    <span className="text-[12px] text-[#444] leading-[1.55]">{step}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={onClose}
                className="w-full h-[46px] rounded-[12px] bg-[#3a77ff] text-white text-[13px] font-semibold shadow-[0_3px_14px_rgba(58,119,255,0.3)]"
              >
                Done
              </button>
            </div>
          ) : (
            /* ── Scheduler ── */
            <div className="px-5 pt-4">
              {/* Owner row */}
              <div className="flex items-center gap-3 bg-[#f8f9fa] rounded-[12px] px-3 py-2.5 mb-5">
                <div className="w-8 h-8 rounded-full bg-[#3a77ff]/14 flex items-center justify-center shrink-0">
                  <span className="text-[13px] font-bold text-[#3a77ff]">A</span>
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-black">Anita M. will host this walkthrough</p>
                  <p className="text-[11px] text-[#999]">Owner · KYC verified · Replies in 4 hours</p>
                </div>
              </div>

              {/* Date picker */}
              <p className="text-[13px] font-bold text-black mb-2.5">Pick a date</p>
              <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5 mb-5 pb-0.5">
                {WALK_DATES.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedDateIdx(i); setSelectedTime(null); }}
                    className="flex flex-col items-center shrink-0 px-3 pt-2 pb-2.5 rounded-[12px] border transition-all duration-150"
                    style={{
                      minWidth: 52,
                      background: selectedDateIdx === i ? '#3a77ff' : 'white',
                      borderColor: selectedDateIdx === i ? '#3a77ff' : '#e5e5e5',
                    }}
                  >
                    <span className="text-[10px] font-semibold mb-0.5" style={{ color: selectedDateIdx === i ? 'rgba(255,255,255,0.72)' : '#aaa' }}>{d.day}</span>
                    <span className="text-[17px] font-bold leading-none mb-0.5" style={{ color: selectedDateIdx === i ? 'white' : 'black' }}>{d.date}</span>
                    <span className="text-[10px]" style={{ color: selectedDateIdx === i ? 'rgba(255,255,255,0.65)' : '#bbb' }}>{d.month}</span>
                  </button>
                ))}
              </div>

              {/* Time slots */}
              {Object.entries(WALK_SLOTS).map(([period, slots]) => (
                <div key={period} className="mb-4">
                  <p className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest mb-2">{period}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map(slot => {
                      const isSel = selectedTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          disabled={slot.booked}
                          onClick={() => setSelectedTime(slot.time)}
                          className="py-2.5 rounded-[10px] border text-[11px] font-semibold transition-all duration-150"
                          style={{
                            background: slot.booked ? '#f5f5f5' : isSel ? '#3a77ff' : 'white',
                            borderColor: slot.booked ? '#eee' : isSel ? '#3a77ff' : '#e5e5e5',
                            color: slot.booked ? '#ccc' : isSel ? 'white' : '#333',
                            cursor: slot.booked ? 'not-allowed' : 'pointer',
                            textDecoration: slot.booked ? 'line-through' : 'none',
                          }}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Legend */}
              <div className="flex items-center gap-4 mb-5">
                {[
                  { bg: 'white', border: '#e5e5e5', label: 'Available' },
                  { bg: '#f5f5f5', border: '#eee',   label: 'Booked'    },
                  { bg: '#3a77ff', border: '#3a77ff', label: 'Selected'  },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-[3px] shrink-0" style={{ background: l.bg, border: `1px solid ${l.border}` }} />
                    <span className="text-[11px] text-[#888]">{l.label}</span>
                  </div>
                ))}
              </div>

              {/* Selected summary */}
              {selectedTime && (
                <div className="bg-[#eef3ff] border border-[#d2e0ff] rounded-[12px] px-4 py-3 mb-4">
                  <p className="text-[12px] font-medium text-[#444]">
                    Your slot:{' '}
                    <span className="font-bold text-[#3a77ff]">{selected?.label} at {selectedTime}</span>
                  </p>
                  <p className="text-[11px] text-[#888] mt-0.5">~15 min · A video link will be sent before the call</p>
                </div>
              )}

              {/* Confirm */}
              <button
                disabled={!canConfirm}
                onClick={() => canConfirm && setConfirmed(true)}
                className="w-full h-[48px] rounded-[12px] text-[14px] font-semibold transition-all duration-150"
                style={{
                  background: canConfirm ? '#3a77ff' : '#ececec',
                  color: canConfirm ? 'white' : '#bbb',
                  boxShadow: canConfirm ? '0 3px 14px rgba(58,119,255,0.3)' : 'none',
                }}
              >
                {selectedTime ? `Confirm — ${selected?.label}, ${selectedTime}` : 'Select a time to continue'}
              </button>
              <p className="text-[11px] text-[#bbb] text-center mt-2 mb-1">Free · No payment needed · Cancel anytime</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}