import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Phone, Check, X, Heart } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { useNav } from '../context/TransitionContext';
import { useSaved, SavedStatus } from '../context/SavedContext';
import { mockListings, Listing } from '../data/mockData';
import gsap from 'gsap';

/* ─── Status meta — read-only, auto-driven ─── */
const STATUS_META: Record<SavedStatus, { label: string; color: string; bg: string }> = {
  shortlisted:     { label: 'Saved',             color: '#aaa',    bg: 'transparent'                },
  contacted:       { label: 'Owner contacted',    color: '#16a34a', bg: 'rgba(22,163,74,0.09)'       },
  visit_scheduled: { label: 'Visit scheduled',    color: '#7c3aed', bg: 'rgba(124,58,237,0.09)'      },
  not_interested:  { label: 'Not interested',     color: '#9ca3af', bg: 'rgba(156,163,175,0.09)'     },
};

/* Filter tabs — no "Shortlisted" */
const FILTER_TABS: { id: SavedStatus | 'all'; label: string }[] = [
  { id: 'all',             label: 'All'           },
  { id: 'contacted',       label: 'Contacted'     },
  { id: 'visit_scheduled', label: 'Visit Booked'  },
  { id: 'not_interested',  label: 'Not Interested'},
];

/* ─── Single saved card ─── */
function SavedCard({ listing, savedItem, onRemove, onUpdateStatus, onCardClick }: {
  listing: Listing;
  savedItem: { status: SavedStatus; savedAt: number };
  onRemove: () => void;
  onUpdateStatus: (s: SavedStatus) => void;
  onCardClick: () => void;
}) {
  const [contacted, setContacted] = useState(
    savedItem.status === 'contacted' || savedItem.status === 'visit_scheduled'
  );
  const cardRef = useRef<HTMLDivElement>(null);

  /* Card entrance */
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.32, ease: 'power3.out' }
    );
  }, []);

  const daysAgo  = Math.floor((Date.now() - savedItem.savedAt) / (1000 * 60 * 60 * 24));
  const timeLabel = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`;

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    const btn = e.currentTarget as HTMLElement;
    gsap.timeline()
      .to(btn, { scale: 0.93, duration: 0.10 })
      .to(btn, { scale: 1,    duration: 0.22, ease: 'back.out(2)' });
    setContacted(true);
    onUpdateStatus('contacted');
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cardRef.current) { onRemove(); return; }
    gsap.to(cardRef.current, {
      x: 36, opacity: 0,
      height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0,
      duration: 0.30, ease: 'power3.in',
      onComplete: onRemove,
    });
  };

  return (
    <div
      ref={cardRef}
      style={{
        background: '#fff',
        borderRadius: 14,
        boxShadow: '0 1px 10px rgba(0,0,0,0.07)',
        border: '1px solid rgba(0,0,0,0.07)',
        marginBottom: 10,
        overflow: 'hidden',
      }}
    >
      {/* ── Top: thumbnail + info ── */}
      <div
        onClick={onCardClick}
        style={{ display: 'flex', gap: 12, padding: '12px 12px 10px 12px', cursor: 'pointer', position: 'relative' }}
      >
        {/* Thumbnail */}
        <div style={{ width: 70, height: 70, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
          <img
            src={listing.images[0]}
            alt={listing.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0, paddingRight: 24 }}>
          {/* Price first — primary */}
          <p style={{ fontSize: 15, fontWeight: 600, color: '#0a0a0a', lineHeight: 1.25, marginBottom: 3 }}>
            {listing.price}
            <span style={{ fontSize: 11, fontWeight: 400, color: '#aaa', marginLeft: 3 }}>/mo</span>
          </p>
          {/* Title — secondary */}
          <p style={{ fontSize: 13, fontWeight: 400, color: '#444', lineHeight: 1.3, marginBottom: 5 }}>
            {listing.title}
          </p>
          {/* Details row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 400, color: '#999' }}>{listing.area}</span>
            <span style={{ fontSize: 9, color: '#ddd' }}>•</span>
            <span style={{ fontSize: 11, fontWeight: 400, color: '#999' }}>{listing.furnishing}</span>
            <span style={{ fontSize: 9, color: '#ddd' }}>•</span>
            <span style={{ fontSize: 11, fontWeight: 400, color: '#999' }}>{listing.distances.office} office</span>
          </div>
          {/* Time */}
          <p style={{ fontSize: 10, fontWeight: 400, color: '#ccc', marginTop: 4 }}>Saved {timeLabel}</p>
        </div>

        {/* Remove × */}
        <button
          onClick={handleRemove}
          style={{
            position: 'absolute', top: 10, right: 10,
            width: 20, height: 20, borderRadius: '50%',
            background: 'rgba(0,0,0,0.07)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <X size={10} color="#999" />
        </button>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: 'rgba(0,0,0,0.05)', margin: '0 12px' }} />

      {/* ── Action row ── */}
      <div style={{ padding: '9px 12px 11px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {contacted ? (
          /* Auto status display — green, no interaction */
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 12, fontWeight: 500, color: '#16a34a',
          }}>
            <Check size={13} color="#16a34a" strokeWidth={2.5} />
            Owner contacted
          </div>
        ) : (
          <button
            onClick={handleContact}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '7px 18px', borderRadius: 20,
              background: '#3a77ff', border: 'none',
              fontSize: 12, fontWeight: 600, color: '#fff',
              boxShadow: '0 2px 10px rgba(58,119,255,0.28)',
            }}
          >
            <Phone size={13} color="#fff" strokeWidth={2} />
            Contact Owner
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Main screen ─── */
export function SavedScreen() {
  const { goBack, go }                              = useNav();
  const { savedItems, updateStatus, removeFromSaved } = useSaved();
  const [activeFilter, setActiveFilter]             = useState<SavedStatus | 'all'>('all');
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }
    );
  }, []);

  /* Combine saved ids with listing data */
  const savedWithData = savedItems
    .map(item => ({ item, listing: mockListings.find(l => l.id === item.id) }))
    .filter((x): x is { item: typeof savedItems[0]; listing: Listing } => !!x.listing)
    .reverse();

  const filtered = activeFilter === 'all'
    ? savedWithData
    : savedWithData.filter(x => x.item.status === activeFilter);

  return (
    <div style={{ background: '#f2f2f2', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      {/* Header */}
      <div
        ref={headerRef}
        style={{ background: '#fff', padding: '6px 16px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', flexShrink: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <button
            onClick={goBack}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: '#f2f2f2', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ArrowLeft size={17} color="#1c1b1f" />
          </button>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 17, fontWeight: 600, color: '#0a0a0a' }}>
              Saved{savedItems.length > 0 ? ` (${savedItems.length})` : ''}
            </p>
            <p style={{ fontSize: 12, fontWeight: 400, color: '#aaa', marginTop: 1 }}>
              Your saved properties
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto' }} className="hide-scrollbar">
          {FILTER_TABS.map(tab => {
            const count = tab.id === 'all'
              ? savedItems.length
              : savedItems.filter(i => i.status === tab.id).length;
            if (count === 0 && tab.id !== 'all') return null;
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                style={{
                  padding: '5px 13px', borderRadius: 20, flexShrink: 0,
                  background: isActive ? '#3a77ff' : 'rgba(0,0,0,0.06)',
                  border: 'none',
                  fontSize: 12, fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#fff' : '#666',
                  transition: 'all 0.16s ease',
                }}
              >
                {tab.label}{count > 0 ? ` · ${count}` : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div
        style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 40px' }}
        className="hide-scrollbar"
      >
        {filtered.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '60%', gap: 14, textAlign: 'center',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(255,59,48,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Heart size={28} color="#ff3b30" strokeWidth={1.5} />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#0a0a0a' }}>
                {activeFilter === 'all' ? 'No saved listings yet' : `No ${FILTER_TABS.find(t => t.id === activeFilter)?.label.toLowerCase()} listings`}
              </p>
              <p style={{ fontSize: 13, fontWeight: 400, color: '#aaa', marginTop: 6, lineHeight: 1.5 }}>
                {activeFilter === 'all'
                  ? 'Tap ♡ on any listing to save it here'
                  : 'Try a different filter tab'}
              </p>
            </div>
            {activeFilter === 'all' && (
              <button
                onClick={() => go('/listings')}
                style={{
                  marginTop: 4, padding: '10px 22px', borderRadius: 12,
                  background: '#3a77ff', border: 'none',
                  fontSize: 13, fontWeight: 600, color: '#fff',
                  boxShadow: '0 4px 14px rgba(58,119,255,0.28)',
                }}
              >
                Browse listings
              </button>
            )}
          </div>
        ) : (
          filtered.map(({ item, listing }) => (
            <SavedCard
              key={item.id}
              listing={listing}
              savedItem={item}
              onRemove={() => removeFromSaved(item.id)}
              onUpdateStatus={s => updateStatus(item.id, s)}
              onCardClick={() => go(`/listings/${listing.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}
