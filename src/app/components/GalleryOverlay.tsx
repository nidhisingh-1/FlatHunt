import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';

/* ─── Room data ─── */
const GALLERY_SECTIONS = [
  {
    id: 'bedroom',
    label: 'Bedroom',
    description: 'This bedroom has an attached washroom and an attached balcony.',
    images: [
      'https://images.unsplash.com/photo-1662454419716-c4c504728811?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1765185237761-9f42d0764304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    ],
  },
  {
    id: 'second_bedroom',
    label: 'Second Bedroom',
    description: 'Compact and well-lit, great for a home office or guest room.',
    images: [
      'https://images.unsplash.com/photo-1721738857280-f4e7c1c43f2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1759264244764-2cb80f1a67bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    ],
  },
  {
    id: 'bathroom',
    label: 'Bathroom',
    description: 'Clean, tiled bathroom with overhead shower and storage cabinet.',
    images: [
      'https://images.unsplash.com/photo-1774716925801-cad665240e12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1590880265945-6b43effeb599?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    ],
  },
  {
    id: 'kitchen',
    label: 'Kitchen',
    description: 'Modular kitchen with granite countertop and overhead cabinets.',
    images: [
      'https://images.unsplash.com/photo-1755771984341-546c2a04f236?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1756471818388-af6aadafbf07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    ],
  },
];

const FILTERS = [{ id: 'all', label: 'All' }, ...GALLERY_SECTIONS.map(s => ({ id: s.id, label: s.label }))];

interface LightboxState { sectionId: string; imgIdx: number }

interface Props {
  open: boolean;
  onClose: () => void;
  listingImages: string[];
}

export function GalleryOverlay({ open, onClose, listingImages }: Props) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const sheetRef  = useRef<HTMLDivElement>(null);
  const lbRef     = useRef<HTMLDivElement>(null);

  /* ── Mount / unmount animation ── */
  useEffect(() => {
    if (!sheetRef.current) return;
    if (open) {
      gsap.fromTo(sheetRef.current,
        { y: '100%', opacity: 0.6 },
        { y: 0, opacity: 1, duration: 0.38, ease: 'power3.out' }
      );
    }
  }, [open]);

  const handleClose = () => {
    if (!sheetRef.current) { onClose(); return; }
    gsap.to(sheetRef.current, {
      y: '100%', opacity: 0.5, duration: 0.3, ease: 'power2.in',
      onComplete: onClose,
    });
  };

  /* ── Lightbox open ── */
  const openLightbox = (sectionId: string, imgIdx: number) => {
    setLightbox({ sectionId, imgIdx });
    setTimeout(() => {
      if (lbRef.current) {
        gsap.fromTo(lbRef.current, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.22, ease: 'power2.out' });
      }
    }, 10);
  };

  const closeLightbox = () => {
    if (lbRef.current) {
      gsap.to(lbRef.current, { opacity: 0, scale: 0.96, duration: 0.18, ease: 'power2.in', onComplete: () => setLightbox(null) });
    } else setLightbox(null);
  };

  const lbSection = lightbox ? GALLERY_SECTIONS.find(s => s.id === lightbox.sectionId) : null;
  const lbImages  = lbSection ? lbSection.images : [];
  const lbTotal   = lbImages.length;

  const lbPrev = () => setLightbox(prev => prev ? { ...prev, imgIdx: (prev.imgIdx - 1 + lbTotal) % lbTotal } : prev);
  const lbNext = () => setLightbox(prev => prev ? { ...prev, imgIdx: (prev.imgIdx + 1) % lbTotal } : prev);

  /* ── Visible sections ── */
  const visibleSections = activeFilter === 'all'
    ? GALLERY_SECTIONS
    : GALLERY_SECTIONS.filter(s => s.id === activeFilter);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div
        ref={sheetRef}
        className="absolute inset-0 flex flex-col bg-[#f5f5f7]"
        style={{ willChange: 'transform' }}
      >
        {/* ── Header ── */}
        <div className="bg-white px-4 pt-12 pb-3 flex items-center justify-between shrink-0 border-b border-black/6">
          <div>
            <p className="text-[17px] font-semibold text-black">Photos</p>
            <p className="text-[12px] text-[#8f8f8f] font-medium mt-0.5">
              {GALLERY_SECTIONS.reduce((acc, s) => acc + s.images.length, 0)} photos
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#efefef] flex items-center justify-center active:scale-90 transition-transform"
          >
            <X size={16} className="text-[#1c1b1f]" />
          </button>
        </div>

        {/* ── Filter tabs ── */}
        <div className="bg-white px-4 py-2.5 shrink-0 border-b border-black/6">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                  activeFilter === f.id
                    ? 'bg-[#3a77ff] text-white'
                    : 'bg-[#f0f0f2] text-[#4a4a4a]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Scrollable photo grid ── */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-4 flex flex-col gap-6">
          {visibleSections.map(section => (
            <div key={section.id} className="flex flex-col gap-2.5">
              {/* Section header */}
              <div className="flex flex-col gap-0.5">
                <p className="text-[14px] font-semibold text-black">{section.label}</p>
                <p className="text-[12px] text-[#8f8f8f] font-medium leading-[18px]">{section.description}</p>
              </div>

              {/* Image grid — first image full width, rest in pairs */}
              <div className="flex flex-col gap-1.5">
                {/* Hero image */}
                <button
                  className="w-full rounded-[12px] overflow-hidden active:scale-[0.99] transition-transform"
                  style={{ height: 200 }}
                  onClick={() => openLightbox(section.id, 0)}
                >
                  <img
                    src={section.images[0]}
                    alt={`${section.label} 1`}
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* Remaining images in a 2-col row */}
                {section.images.length > 1 && (
                  <div className="flex gap-1.5">
                    {section.images.slice(1).map((img, idx) => (
                      <button
                        key={img}
                        className="flex-1 rounded-[12px] overflow-hidden active:scale-[0.99] transition-transform relative"
                        style={{ height: 120 }}
                        onClick={() => openLightbox(section.id, idx + 1)}
                      >
                        <img
                          src={img}
                          alt={`${section.label} ${idx + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Bottom padding */}
          <div className="h-4" />
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox && lbSection && (
        <div
          ref={lbRef}
          className="absolute inset-0 z-60 flex flex-col"
          style={{ background: 'rgba(0,0,0,0.95)' }}
        >
          {/* Lightbox header */}
          <div className="absolute top-0 left-0 right-0 px-4 pt-12 pb-3 flex items-center justify-between z-10">
            <p className="text-white text-[14px] font-medium">
              {lbSection.label} · {lightbox.imgIdx + 1}/{lbTotal}
            </p>
            <button
              onClick={closeLightbox}
              className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center active:scale-90 transition-transform"
            >
              <X size={16} className="text-white" />
            </button>
          </div>

          {/* Lightbox image */}
          <div className="flex-1 flex items-center justify-center px-2">
            <img
              src={lbImages[lightbox.imgIdx]}
              alt={`${lbSection.label} ${lightbox.imgIdx + 1}`}
              className="w-full rounded-[10px] object-cover"
              style={{ maxHeight: '70vh' }}
            />
          </div>

          {/* Description */}
          <div className="px-5 pb-6 text-center">
            <p className="text-white/70 text-[13px] font-medium leading-[20px]">{lbSection.description}</p>
          </div>

          {/* Prev / Next */}
          {lbTotal > 1 && (
            <>
              <button
                onClick={lbPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/15 flex items-center justify-center active:scale-90 transition-transform"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
              <button
                onClick={lbNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/15 flex items-center justify-center active:scale-90 transition-transform"
              >
                <ChevronRight size={20} className="text-white" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
