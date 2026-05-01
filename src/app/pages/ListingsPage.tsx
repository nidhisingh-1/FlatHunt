import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StatusBar } from '../components/StatusBar';
import { Heart, Search, SlidersHorizontal, X } from 'lucide-react';
import { mockListings, Listing } from '../data/mockData';
import { useNav } from '../context/TransitionContext';
import { useSaved } from '../context/SavedContext';
import { CardImageCarousel } from '../components/CardImageCarousel';
import { BottomBar } from '../components/BottomBar';
import { FilterSheet, DEFAULT_FILTER_STATE, countActiveFilters } from '../components/FilterSheet';
import type { FilterState } from '../components/FilterSheet';
import gsap from 'gsap';

/* ─── Location anchor chips (non-removable) ─── */
const ANCHOR_CHIPS = [
  { id: 'work',   label: 'Work: Google Ananta' },
  { id: 'friend', label: 'Friend: House 232..'  },
  { id: 'gym',    label: 'Gym: Cult...'          },
];

/* ══════════════════════════════════════════════
   Flying thumbnail animation
══════════════════════════════════════════════ */
function flyThumbnail(imgSrc: string, fromEl: HTMLElement) {
  const savedAnchor = document.getElementById('saved-btn-anchor');
  if (!savedAnchor) return;

  // Nearest image in the listing card
  const cardEl    = fromEl.closest('.listing-card') as HTMLElement | null;
  const imgEl     = cardEl?.querySelector('img') as HTMLImageElement | null;
  const sourceEl  = imgEl ?? fromEl;

  const srcRect   = sourceEl.getBoundingClientRect();
  const dstRect   = savedAnchor.getBoundingClientRect();

  const THUMB     = 56;
  const startX    = srcRect.left + (srcRect.width  - THUMB) / 2;
  const startY    = srcRect.top  + (srcRect.height - THUMB) / 2;

  /* Build the flying clone */
  const clone = document.createElement('div');
  Object.assign(clone.style, {
    position: 'fixed',
    left:     `${startX}px`,
    top:      `${startY}px`,
    width:    `${THUMB}px`,
    height:   `${THUMB}px`,
    borderRadius: '12px',
    overflow: 'hidden',
    zIndex:   '9999',
    pointerEvents: 'none',
    boxShadow: '0 6px 24px rgba(0,0,0,0.32)',
  });
  const img = document.createElement('img');
  img.src = imgSrc;
  Object.assign(img.style, { width: '100%', height: '100%', objectFit: 'cover' });
  clone.appendChild(img);
  document.body.appendChild(clone);

  const destX = dstRect.left + dstRect.width  / 2 - THUMB / 2;
  const destY = dstRect.top  + dstRect.height / 2 - THUMB / 2;

  gsap.to(clone, {
    x: destX - startX,
    y: destY - startY,
    width:        22,
    height:       22,
    borderRadius: '50%',
    opacity:      0.85,
    duration:     0.55,
    ease:         'power3.inOut',
    onComplete: () => {
      clone.remove();
      /* Bounce the saved button */
      gsap.timeline()
        .to(savedAnchor, { scale: 1.5, duration: 0.13, ease: 'power2.out' })
        .to(savedAnchor, { scale: 1,   duration: 0.30, ease: 'back.out(2.8)' });
    },
  });
}

/* ══════════════════════════════════════════════
   Component
══════════════════════════════════════════════ */
export function ListingsPage() {
  const { go }                                          = useNav();
  const { isSaved, toggleSaved, savedItems }            = useSaved();
  const [filterSheetOpen, setFilterSheetOpen]           = useState(false);
  const [appliedFilters,  setAppliedFilters]            = useState<FilterState>(DEFAULT_FILTER_STATE);

  const cardsRef     = useRef<HTMLDivElement>(null);
  const filterRowRef = useRef<HTMLDivElement>(null);
  const countRef     = useRef<HTMLDivElement>(null);
  const headerRef    = useRef<HTMLDivElement>(null);

  const activeFilterCount = countActiveFilters(appliedFilters);

  /* ── Mount animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, delay: 0.05, ease: 'power2.out' }
      );
      if (filterRowRef.current) {
        const chips = filterRowRef.current.querySelectorAll<HTMLElement>('.filter-chip');
        gsap.fromTo(chips,
          { opacity: 0, x: 14, scale: 0.9 },
          { opacity: 1, x: 0, scale: 1, duration: 0.28, stagger: 0.055, delay: 0.12, ease: 'power2.out' }
        );
      }
      gsap.fromTo(countRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3, delay: 0.25, ease: 'power2.out' }
      );
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll<HTMLElement>('.listing-card');
        gsap.fromTo(cards,
          { opacity: 0, y: 42, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.13, delay: 0.35, ease: 'power3.out' }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  /* ── Heart toggle with fly animation ── */
  const handleLike = useCallback((listing: Listing, e: React.MouseEvent) => {
    e.stopPropagation();
    const btn = e.currentTarget as HTMLElement;

    /* Heart bounce */
    gsap.timeline()
      .to(btn, { scale: 1.35, duration: 0.12, ease: 'power2.out' })
      .to(btn, { scale: 1,    duration: 0.18, ease: 'back.out(3)' });

    /* Fly thumbnail only when saving, not unsaving */
    if (!isSaved(listing.id)) {
      flyThumbnail(listing.images[0], btn);
    }

    toggleSaved(listing.id);
  }, [isSaved, toggleSaved]);

  const handleCardClick = (id: string, el: HTMLElement) => {
    gsap.to(el, {
      scale: 0.97, opacity: 0.85, duration: 0.14, ease: 'power2.in',
      onComplete: () => go(`/listings/${id}`),
    });
  };

  const handleFilterChipPress = (e: React.MouseEvent) => {
    const btn = e.currentTarget as HTMLElement;
    gsap.timeline()
      .to(btn, { scale: 0.93, duration: 0.09, ease: 'power2.in' })
      .to(btn, { scale: 1, duration: 0.14, ease: 'back.out(2)',
          onComplete: () => setFilterSheetOpen(true) });
  };

  const savedCount = savedItems.length;

  return (
    <div className="bg-[#f2f2f2] w-full h-full flex flex-col relative">
      <StatusBar />

      {/* ── Sticky top bar ── */}
      <div
        ref={headerRef}
        className="bg-white flex flex-col pb-2 z-10 relative"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
      >
        {/* Search row */}
        <div className="px-4 pt-2 flex gap-2.5 items-center">
          <div className="flex-1 bg-white drop-shadow-[0px_4px_12.5px_rgba(0,0,0,0.12)] rounded-full flex items-center gap-2 px-4 py-3">
            <Search size={15} className="text-[#1c1b1f] shrink-0" />
            <input
              type="text"
              placeholder="Start your search"
              className="bg-transparent border-none outline-none text-[14px] font-medium w-full text-black"
            />
          </div>

          {/* ── Saved button ── */}
          <button
            id="saved-btn-anchor"
            onClick={() => go('/saved')}
            className="w-11 h-11 bg-white drop-shadow-[0px_4px_12.5px_rgba(0,0,0,0.12)] rounded-full flex items-center justify-center shrink-0 relative"
            style={{ willChange: 'transform' }}
          >
            <Heart
              size={17}
              style={{
                fill:   savedCount > 0 ? '#ff3b30' : 'none',
                stroke: savedCount > 0 ? '#ff3b30' : '#1c1b1f',
                transition: 'fill 0.2s ease, stroke 0.2s ease',
              }}
            />
            {savedCount > 0 && (
              <div
                style={{
                  position: 'absolute', top: -2, right: -2,
                  minWidth: 16, height: 16, borderRadius: 100,
                  background: '#ff3b30',
                  border: '2px solid #fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 3px',
                }}
              >
                <span style={{ color: '#fff', fontSize: 9, fontWeight: 800, lineHeight: 1 }}>
                  {savedCount}
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Filter chip row */}
        <div
          ref={filterRowRef}
          className="flex overflow-x-auto hide-scrollbar px-4 pt-3 gap-2 pb-1"
          style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}
        >
          {/* ── Filters chip ── */}
          <button
            className="filter-chip flex items-center gap-1.5 pl-2.5 pr-3 py-1.5 rounded-[8px] shrink-0 drop-shadow-[0px_4px_2px_rgba(0,0,0,0.08)]"
            style={
              activeFilterCount > 0
                ? { background: 'linear-gradient(90deg,rgba(58,119,255,0.11),rgba(58,119,255,0.11)),#fff', border: '1px solid #3a77ff' }
                : { background: '#fff', border: '1px solid rgba(0,0,0,0.10)' }
            }
            onClick={handleFilterChipPress}
          >
            <SlidersHorizontal size={13} color={activeFilterCount > 0 ? '#3a77ff' : '#1c1b1f'} strokeWidth={2.2} />
            <span className="text-[12px] font-semibold" style={{ color: activeFilterCount > 0 ? '#3a77ff' : '#0a0a0a' }}>
              Filters
            </span>
            {activeFilterCount > 0 && (
              <div style={{
                minWidth: 18, height: 18, borderRadius: 100,
                background: '#3a77ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 5px', marginLeft: 1,
              }}>
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, lineHeight: 1 }}>{activeFilterCount}</span>
              </div>
            )}
          </button>

          {/* ── Location anchor chips ── */}
          {ANCHOR_CHIPS.map(chip => (
            <div
              key={chip.id}
              className="filter-chip flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] shrink-0 drop-shadow-[0px_4px_2px_rgba(0,0,0,0.08)]"
              style={{
                background: 'linear-gradient(90deg,rgba(58,119,255,0.10),rgba(58,119,255,0.10)),#fff',
                border: '0.5px solid #3a77ff',
              }}
            >
              <span className="text-[12px] font-medium text-[#0a0a0a]">{chip.label}</span>
            </div>
          ))}

          {/* ── Dynamic filter chips ── */}
          {appliedFilters.budgetRange !== 'any' && (() => {
            const labels: Record<string, string> = { 'u15': 'Under ₹15K', '15-25': '₹15K–₹25K', '25-40': '₹25K–₹40K', '40-60': '₹40K–₹60K', '60-80': '₹60K–₹80K', '80+': '₹80K+' };
            return (
              <div key="budget-chip" className="filter-chip flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] shrink-0 drop-shadow-[0px_4px_2px_rgba(0,0,0,0.08)]"
                style={{ background: 'linear-gradient(90deg,rgba(58,119,255,0.10),rgba(58,119,255,0.10)),#fff', border: '0.5px solid #3a77ff' }}>
                <span className="text-[12px] font-medium text-[#0a0a0a]">{labels[appliedFilters.budgetRange]}</span>
                <button onClick={() => setAppliedFilters(f => ({ ...f, budgetRange: 'any' }))} className="ml-0.5">
                  <X size={12} className="text-[#0a0a0a]" />
                </button>
              </div>
            );
          })()}

          {appliedFilters.flatTypes.map(ft => {
            const labels: Record<string, string> = { '1rk': '1 RK', 'studio': 'Studio', '1': '1 BHK', '2': '2 BHK', '3': '3 BHK', '4+': '4 BHK+' };
            return (
              <div key={`ft-${ft}`} className="filter-chip flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] shrink-0 drop-shadow-[0px_4px_2px_rgba(0,0,0,0.08)]"
                style={{ background: 'linear-gradient(90deg,rgba(58,119,255,0.10),rgba(58,119,255,0.10)),#fff', border: '0.5px solid #3a77ff' }}>
                <span className="text-[12px] font-medium text-[#0a0a0a]">{labels[ft]}</span>
                <button onClick={() => setAppliedFilters(f => ({ ...f, flatTypes: f.flatTypes.filter(x => x !== ft) }))} className="ml-0.5">
                  <X size={12} className="text-[#0a0a0a]" />
                </button>
              </div>
            );
          })}

          {appliedFilters.brokerFree && (
            <div className="filter-chip flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] shrink-0 drop-shadow-[0px_4px_2px_rgba(0,0,0,0.08)]"
              style={{ background: 'linear-gradient(90deg,rgba(58,119,255,0.10),rgba(58,119,255,0.10)),#fff', border: '0.5px solid #3a77ff' }}>
              <span className="text-[12px] font-medium text-[#0a0a0a]">Broker Free</span>
              <button onClick={() => setAppliedFilters(f => ({ ...f, brokerFree: false }))} className="ml-0.5">
                <X size={12} className="text-[#0a0a0a]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Listings scroll area ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 pt-4 pb-[108px]">
        {/* Count row */}
        <div ref={countRef} className="flex items-center gap-2 px-1 mb-4">
          <span className="text-[14px] font-semibold text-black">15 listings</span>
          <div className="w-1 h-1 rounded-full bg-[#aeaeae]" />
          <span className="text-[14px] font-semibold text-[#3b78ff]">12 inspector verified</span>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="flex flex-col gap-4">
          {mockListings.map(listing => (
            <div
              key={listing.id}
              className="listing-card bg-white rounded-[16px] overflow-hidden cursor-pointer border border-[rgba(0,0,0,0.08)]"
              style={{ boxShadow: '0 2px 18px rgba(0,0,0,0.07)', willChange: 'transform, opacity' }}
              onClick={e => handleCardClick(listing.id, e.currentTarget as HTMLElement)}
            >
              <CardImageCarousel
                images={listing.images}
                inspected={listing.inspected}
                inspectionStatus={listing.inspectionStatus}
                isLiked={isSaved(listing.id)}
                onLike={e => handleLike(listing, e)}
              />

              {/* Furnishing strip */}
              <div className="w-full px-3 py-1.5 flex items-center gap-3" style={{ background: 'rgba(0,0,0,0.06)' }}>
                <span className="text-[10px] font-medium text-[#8f8f8f]">{listing.furnishing}</span>
                <div className="w-1 h-1 rounded-full bg-[#aeaeae]" />
                <span className="text-[10px] font-medium text-[#8f8f8f]">{listing.area}</span>
                <div className="w-1 h-1 rounded-full bg-[#aeaeae]" />
                <span className="text-[10px] font-medium text-[#8f8f8f]">{listing.societyType}</span>
              </div>

              {/* Card body */}
              <div className="px-3 pt-2 pb-3 flex flex-col gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[16px] font-semibold text-[#0a0a0a]">{listing.title}</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-medium text-[#727272]">{listing.distances.office} from office</span>
                    <div className="w-1 h-1 rounded-full bg-[#aeaeae]" />
                    <span className="text-[10px] font-medium text-[#727272]">{listing.distances.friend} from Friend</span>
                    <div className="w-1 h-1 rounded-full bg-[#aeaeae]" />
                    <span className="text-[10px] font-medium text-[#727272]">{listing.distances.gym} from Gym</span>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-semibold text-[#0a0a0a]">{listing.price} / month</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-medium text-[#8f8f8f]">True move-in {listing.trueMoveIn}</span>
                      <span className="text-[10px] font-semibold text-[#3a77ff]">View breakdown</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-[#0a0a0a]">
                    Posted by {listing.postedBy === 'broker' ? 'Broker' : 'Owner'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomBar context="listings" activeNav="home" />

      <FilterSheet
        open={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        filters={appliedFilters}
        onChange={setAppliedFilters}
        onApply={filters => setAppliedFilters(filters)}
      />
    </div>
  );
}