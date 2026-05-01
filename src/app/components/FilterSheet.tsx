import React, { useState, useEffect, useRef } from 'react';
import {
  X, Check, Search, Plus, Trash2,
} from 'lucide-react';
import gsap from 'gsap';

/* ══════════════════════════════════════════════
   TYPES  (exported – used by ListingsPage)
══════════════════════════════════════════════ */
export interface AnchorFilter {
  id: string;
  label: string;
  shortLabel: string;
  type: 'work' | 'friend' | 'gym' | 'custom';
  active: boolean;
  radius: string;
}

export interface FilterState {
  anchors: AnchorFilter[];
  budgetRange: string;
  flatTypes: string[];
  furnishing: string[];
  society: string;
  inspection: string[];
  minBathrooms: number;
  amenities: string[];
  brokerFree: boolean;
  photosVerified: boolean;
  ownerOnly: boolean;
  moveIn: string;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  anchors: [
    { id: 'work',   label: 'Google Ananta, Mahadevpura', shortLabel: 'Work',   type: 'work',   active: true, radius: '10km' },
    { id: 'friend', label: 'Lake View Apartments, HSR',  shortLabel: 'Friend', type: 'friend', active: true, radius: '5km'  },
    { id: 'gym',    label: 'Cult Fit, 16th Main Road',   shortLabel: 'Gym',    type: 'gym',    active: true, radius: 'Any'  },
  ],
  budgetRange:   '25-40',
  flatTypes:     ['2'],
  furnishing:    [],
  society:       'any',
  inspection:    [],
  minBathrooms:  1,
  amenities:     [],
  brokerFree:    false,
  photosVerified: false,
  ownerOnly:     false,
  moveIn:        'any',
};

export function countActiveFilters(f: FilterState): number {
  let n = 0;
  if (f.budgetRange !== 'any') n++;
  n += f.flatTypes.length;
  if (f.furnishing.length) n++;
  if (f.society !== 'any') n++;
  if (f.inspection.length) n++;
  if (f.minBathrooms > 1) n++;
  n += f.amenities.length;
  if (f.brokerFree) n++;
  if (f.photosVerified) n++;
  if (f.ownerOnly) n++;
  if (f.moveIn !== 'any') n++;
  return n;
}

/* ══════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════ */
const BLUE = '#3a77ff';

const CATEGORIES = [
  { id: 'location',    label: 'Location'     },
  { id: 'budget',      label: 'Budget'       },
  { id: 'flat_type',   label: 'Flat Type'    },
  { id: 'furnishing',  label: 'Furnishing'   },
  { id: 'society',     label: 'Society'      },
  { id: 'inspection',  label: 'Inspection'   },
  { id: 'movein',      label: 'Move-in'      },
  { id: 'bathrooms',   label: 'Bathrooms'    },
  { id: 'amenities',   label: 'Amenities'    },
  { id: 'preferences', label: 'Preferences'  },
];

function getCategoryCount(id: string, f: FilterState): number {
  switch (id) {
    case 'budget':      return f.budgetRange !== 'any' ? 1 : 0;
    case 'flat_type':   return f.flatTypes.length;
    case 'furnishing':  return f.furnishing.length;
    case 'society':     return f.society !== 'any' ? 1 : 0;
    case 'inspection':  return f.inspection.length;
    case 'movein':      return f.moveIn !== 'any' ? 1 : 0;
    case 'bathrooms':   return f.minBathrooms > 1 ? 1 : 0;
    case 'amenities':   return f.amenities.length;
    case 'preferences': return (f.brokerFree ? 1 : 0) + (f.photosVerified ? 1 : 0) + (f.ownerOnly ? 1 : 0);
    default:            return 0;
  }
}

const RADIUS_OPTIONS = ['2km', '5km', '10km', '15km', 'Any'];

const BUDGET_OPTIONS = [
  { id: 'any',   label: 'Any'          },
  { id: 'u15',   label: 'Under ₹15K'  },
  { id: '15-25', label: '₹15K – ₹25K' },
  { id: '25-40', label: '₹25K – ₹40K' },
  { id: '40-60', label: '₹40K – ₹60K' },
  { id: '60-80', label: '₹60K – ₹80K' },
  { id: '80+',   label: '₹80K+'        },
];
const FLAT_TYPES = [
  { id: '1rk',    label: '1 RK'   },
  { id: 'studio', label: 'Studio' },
  { id: '1',      label: '1 BHK'  },
  { id: '2',      label: '2 BHK'  },
  { id: '3',      label: '3 BHK'  },
  { id: '4+',     label: '4 BHK+' },
];
const FURNISHING_OPTS = [
  { id: 'fully',       label: 'Fully Furnished' },
  { id: 'semi',        label: 'Semi Furnished'  },
  { id: 'unfurnished', label: 'Unfurnished'     },
];
const SOCIETY_OPTS = [
  { id: 'any',        label: 'Any'                },
  { id: 'gated',      label: 'Gated Society'      },
  { id: 'standalone', label: 'Standalone Building' },
];
const INSPECTION_OPTS = [
  { id: 'verified',  label: 'Inspector Verified'   },
  { id: 'requested', label: 'Inspection Requested' },
  { id: 'none',      label: 'Not Inspected'        },
];
const MOVEIN_OPTS = [
  { id: 'any',       label: 'Any'            },
  { id: 'immediate', label: 'Immediately'    },
  { id: '1month',    label: 'Within 1 Month' },
  { id: '3months',   label: 'Within 3 Months'},
];
const AMENITY_OPTS = [
  { id: 'parking',    label: 'Parking',           emoji: '🚗' },
  { id: 'lift',       label: 'Lift / Elevator',   emoji: '🛗' },
  { id: 'power',      label: 'Power Backup',       emoji: '⚡' },
  { id: 'gas',        label: 'Gas Pipeline',       emoji: '🔥' },
  { id: 'cctv',       label: 'CCTV Surveillance',  emoji: '📷' },
  { id: 'washing',    label: 'Washing Area',       emoji: '🧺' },
  { id: 'pool',       label: 'Swimming Pool',      emoji: '🏊' },
  { id: 'gym',        label: 'Society Gym',        emoji: '💪' },
  { id: 'clubhouse',  label: 'Clubhouse',          emoji: '🏛️' },
  { id: 'solar',      label: 'Solar Panels',       emoji: '☀️' },
  { id: 'play',       label: 'Children Play Area', emoji: '🧸' },
  { id: 'security',   label: 'Security Guard',     emoji: '💂' },
  { id: 'ev',         label: 'EV Charging Point',  emoji: '🔌' },
  { id: 'intercom',   label: 'Intercom',           emoji: '📞' },
  { id: 'rainwater',  label: 'Rainwater Harvesting', emoji: '💧' },
  { id: 'visitor',    label: 'Visitor Parking',    emoji: '🅿️' },
  { id: 'wifi',       label: 'Common WiFi',        emoji: '📶' },
  { id: 'geyser',     label: 'Geyser / Water Heater', emoji: '🚿' },
  { id: 'garden',     label: 'Garden / Greenspace', emoji: '🌿' },
  { id: 'rooftop',    label: 'Rooftop Terrace',    emoji: '🌇' },
];

/* ══════════════════════════════════════════════
   SMALL SHARED COMPONENTS
══════════════════════════════════════════════ */

/* Pill button — used for Budget, Flat type, etc. */
function PillBtn({
  label, active, onToggle, fullWidth,
}: { label: string; active: boolean; onToggle: () => void; fullWidth?: boolean }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
        padding: '8px 14px',
        borderRadius: 10,
        width: fullWidth ? '100%' : undefined,
        border: `1px solid ${active ? BLUE : 'rgba(0,0,0,0.12)'}`,
        background: active ? 'rgba(58,119,255,0.09)' : '#f4f4f4',
        fontSize: 12, fontWeight: 600,
        color: active ? BLUE : '#444',
        transition: 'all 0.14s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {active && <Check size={11} color={BLUE} strokeWidth={3} />}
      {label}
    </button>
  );
}

/* Toggle row */
function ToggleRow({ label, sub, value, onChange }: {
  label: string; sub?: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0' }}>
      <div style={{ flex: 1, paddingRight: 12 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a', lineHeight: 1.3 }}>{label}</p>
        {sub && <p style={{ fontSize: 11, color: '#999', marginTop: 3, lineHeight: 1.4 }}>{sub}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 46, height: 26, borderRadius: 100,
          background: value ? BLUE : '#d5d5d5',
          position: 'relative', border: 'none', flexShrink: 0,
          transition: 'background 0.18s ease',
        }}
      >
        <div
          style={{
            position: 'absolute', top: 3,
            left: value ? 23 : 3,
            width: 20, height: 20, borderRadius: '50%', background: '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.22)',
            transition: 'left 0.18s ease',
          }}
        />
      </button>
    </div>
  );
}

/* Checkbox row — for amenities list */
function CheckRow({
  emoji, label, checked, onToggle,
}: { emoji: string; label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '13px 0',
        width: '100%', background: 'none', border: 'none', textAlign: 'left',
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{emoji}</span>
      <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#111' }}>{label}</span>
      {/* iOS-style checkbox */}
      <div
        style={{
          width: 22, height: 22, borderRadius: 6,
          border: `1.5px solid ${checked ? BLUE : 'rgba(0,0,0,0.22)'}`,
          background: checked ? BLUE : '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'all 0.14s ease',
        }}
      >
        {checked && <Check size={13} color="#fff" strokeWidth={3} />}
      </div>
    </button>
  );
}

/* ══════════════════════════════════════════════
   RIGHT-PANEL CONTENT PER CATEGORY
══════════════════════════════════════════════ */
function LocationPanel({ local, set }: { local: FilterState; set: (p: Partial<FilterState>) => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText,  setEditText]  = useState('');
  const [addMode,   setAddMode]   = useState(false);
  const [newLabel,  setNewLabel]  = useState('');

  const commitEdit = () => {
    if (editingId && editText.trim()) {
      set({ anchors: local.anchors.map(a => a.id === editingId ? { ...a, label: editText.trim() } : a) });
    }
    setEditingId(null);
    setEditText('');
  };

  const toggleActive = (id: string) =>
    set({ anchors: local.anchors.map(a => a.id === id ? { ...a, active: !a.active } : a) });

  const deleteAnchor = (id: string) =>
    set({ anchors: local.anchors.filter(a => a.id !== id) });

  const addAnchor = () => {
    if (!newLabel.trim()) return;
    set({ anchors: [...local.anchors, {
      id: `custom-${Date.now()}`,
      label:      newLabel.trim(),
      shortLabel: newLabel.trim().split(',')[0],
      type:       'custom' as const,
      active:     true,
      radius:     '5km',
    }]});
    setNewLabel('');
    setAddMode(false);
  };

  return (
    <div style={{ padding: '16px' }}>
      <p style={{ fontSize: 11, color: '#aaa', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
        Your anchors
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {local.anchors.map(anchor => (
          <div
            key={anchor.id}
            style={{
              borderRadius: 12,
              border: '1px solid rgba(0,0,0,0.09)',
              background: '#fafafa',
              padding: '10px 12px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}
          >
            {/* Short label + location */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#0a0a0a', marginBottom: 3 }}>
                {anchor.shortLabel}
              </p>
              {editingId === anchor.id ? (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: '#fff', border: `1.5px solid ${BLUE}`,
                  borderRadius: 8, padding: '5px 10px',
                }}>
                  <Search size={12} color="#aaa" />
                  <input
                    autoFocus
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={e => {
                      if (e.key === 'Enter') commitEdit();
                      if (e.key === 'Escape') { setEditingId(null); setEditText(''); }
                    }}
                    placeholder="Search location…"
                    style={{
                      flex: 1, fontSize: 12, color: '#333',
                      background: 'none', border: 'none', outline: 'none',
                    }}
                  />
                </div>
              ) : (
                <button
                  onClick={() => { setEditingId(anchor.id); setEditText(anchor.label); }}
                  style={{
                    background: 'none', border: 'none', padding: 0,
                    fontSize: 11, color: '#888', textAlign: 'left',
                    cursor: 'text', display: 'block', maxWidth: '100%',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    textDecorationLine: 'underline',
                    textDecorationStyle: 'dotted',
                    textDecorationColor: 'rgba(0,0,0,0.25)',
                  }}
                >
                  {anchor.label}
                </button>
              )}
            </div>

            {/* Delete for custom anchors only */}
            {anchor.type === 'custom' && (
              <button
                onClick={() => deleteAnchor(anchor.id)}
                style={{ padding: 4, background: 'none', border: 'none', flexShrink: 0 }}
              >
                <Trash2 size={13} color="#ff3b30" />
              </button>
            )}

            {/* Toggle */}
            <button
              onClick={() => toggleActive(anchor.id)}
              style={{
                width: 42, height: 22, borderRadius: 100,
                background: anchor.active ? BLUE : '#d5d5d5',
                position: 'relative', border: 'none', flexShrink: 0,
                transition: 'background 0.18s ease',
              }}
            >
              <div style={{
                position: 'absolute', top: 2,
                left: anchor.active ? 22 : 2,
                width: 18, height: 18, borderRadius: '50%', background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                transition: 'left 0.18s ease',
              }} />
            </button>
          </div>
        ))}
      </div>

      {/* Add location — inline CTA */}
      {addMode ? (
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 8,
            background: '#fff', border: `1.5px solid ${BLUE}`,
            borderRadius: 10, padding: '8px 12px',
          }}>
            <Search size={13} color="#aaa" />
            <input
              autoFocus
              placeholder="Search a location…"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') addAnchor();
                if (e.key === 'Escape') { setAddMode(false); setNewLabel(''); }
              }}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 13, color: '#111' }}
            />
          </div>
          <button
            onClick={addAnchor}
            style={{
              padding: '8px 14px', borderRadius: 10,
              background: BLUE, border: 'none',
              fontSize: 12, fontWeight: 600, color: '#fff',
            }}
          >
            Add
          </button>
          <button
            onClick={() => { setAddMode(false); setNewLabel(''); }}
            style={{ padding: 4, background: 'none', border: 'none' }}
          >
            <X size={14} color="#888" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAddMode(true)}
          style={{
            marginTop: 10, padding: '8px 0',
            background: 'none', border: 'none',
            display: 'flex', alignItems: 'center', gap: 7,
            fontSize: 12, fontWeight: 600, color: BLUE,
            cursor: 'pointer',
          }}
        >
          <Plus size={14} color={BLUE} strokeWidth={2.5} />
          Add another location
        </button>
      )}
    </div>
  );
}

function AmenitiesPanel({ local, set }: { local: FilterState; set: (p: Partial<FilterState>) => void }) {
  const [query, setQuery] = useState('');

  const filtered = AMENITY_OPTS.filter(a =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  const toggle = (id: string) =>
    set({ amenities: local.amenities.includes(id)
      ? local.amenities.filter(x => x !== id)
      : [...local.amenities, id]
    });

  return (
    <div>
      {/* Search bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 2,
        background: '#fff', padding: '14px 16px 10px',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#f3f3f3', borderRadius: 10, padding: '8px 12px',
        }}>
          <Search size={14} color="#aaa" />
          <input
            type="text"
            placeholder="Search amenities…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 13, color: '#111' }}
          />
          {query !== '' && (
            <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', padding: 0 }}>
              <X size={13} color="#aaa" />
            </button>
          )}
        </div>
        {local.amenities.length > 0 && (
          <p style={{ fontSize: 11, color: BLUE, fontWeight: 600, marginTop: 8 }}>
            {local.amenities.length} selected
          </p>
        )}
      </div>

      {/* List */}
      <div style={{ padding: '0 16px' }}>
        {filtered.length === 0 ? (
          <p style={{ fontSize: 13, color: '#bbb', textAlign: 'center', padding: '28px 0' }}>No amenities found</p>
        ) : (
          filtered.map((a, i) => (
            <div key={a.id}>
              <CheckRow
                emoji={a.emoji}
                label={a.label}
                checked={local.amenities.includes(a.id)}
                onToggle={() => toggle(a.id)}
              />
              {i < filtered.length - 1 && (
                <div style={{ height: 1, background: 'rgba(0,0,0,0.06)' }} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function PreferencesPanel({ local, set }: { local: FilterState; set: (p: Partial<FilterState>) => void }) {
  return (
    <div style={{ padding: '6px 16px' }}>
      <ToggleRow
        label="Broker Free only"
        sub="No brokerage fees whatsoever"
        value={local.brokerFree}
        onChange={v => set({ brokerFree: v })}
      />
      <div style={{ height: 1, background: 'rgba(0,0,0,0.06)' }} />
      <ToggleRow
        label="Owner Listed only"
        sub="Skip broker listings entirely"
        value={local.ownerOnly}
        onChange={v => set({ ownerOnly: v })}
      />
      <div style={{ height: 1, background: 'rgba(0,0,0,0.06)' }} />
      <ToggleRow
        label="Photos verified only"
        sub="Inspector confirmed photos match the flat"
        value={local.photosVerified}
        onChange={v => set({ photosVerified: v })}
      />
    </div>
  );
}

function GenericPanel({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: '16px' }}>{children}</div>;
}

function PillGroup({
  options, value, onChange, multi,
}: {
  options: { id: string; label: string }[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  multi?: boolean;
}) {
  const isActive = (id: string) =>
    Array.isArray(value) ? value.includes(id) : value === id;

  const toggle = (id: string) => {
    if (multi) {
      const arr = value as string[];
      onChange(arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]);
    } else {
      onChange(id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map(o => (
        <PillBtn key={o.id} label={o.label} active={isActive(o.id)} onToggle={() => toggle(o.id)} fullWidth />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN SHEET COMPONENT
══════════════════════════════════════════════ */
interface Props {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onApply: (f: FilterState) => void;
}

export function FilterSheet({ open, onClose, filters, onChange, onApply }: Props) {
  const [local, setLocal]       = useState<FilterState>(filters);
  const [activeCategory, setActiveCategory] = useState('location');
  const sheetRef    = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const rightRef    = useRef<HTMLDivElement>(null);

  // Sync when sheet opens
  useEffect(() => { if (open) setLocal(filters); }, [open]);

  // Sheet enter / exit
  useEffect(() => {
    if (!sheetRef.current || !backdropRef.current) return;
    if (open) {
      gsap.set(sheetRef.current, { y: '100%' });
      gsap.to(backdropRef.current, { opacity: 1, duration: 0.26, ease: 'power2.out' });
      gsap.to(sheetRef.current,   { y: '0%',  duration: 0.42, ease: 'cubic-bezier(0.32,0.72,0,1)' });
    } else {
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.20 });
      gsap.to(sheetRef.current,   { y: '100%', duration: 0.30, ease: 'power3.in' });
    }
  }, [open]);

  // Slide right panel on category change
  useEffect(() => {
    if (!rightRef.current) return;
    gsap.fromTo(rightRef.current,
      { opacity: 0, x: 14 },
      { opacity: 1, x: 0, duration: 0.22, ease: 'power2.out' }
    );
  }, [activeCategory]);

  const set = (patch: Partial<FilterState>) => setLocal(l => ({ ...l, ...patch }));

  const handleApply = () => { onApply(local); onClose(); };
  const handleReset = () => setLocal(DEFAULT_FILTER_STATE);

  const activeCount = countActiveFilters(local);

  const selectCategory = (id: string) => {
    if (id === activeCategory) return;
    setActiveCategory(id);
    // scroll right panel back to top
    if (rightRef.current) rightRef.current.scrollTop = 0;
  };

  /* Right panel renderer */
  const renderRight = () => {
    switch (activeCategory) {
      case 'location':
        return <LocationPanel local={local} set={set} />;

      case 'budget':
        return (
          <GenericPanel>
            <p style={{ fontSize: 11, color: '#aaa', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Select range</p>
            <PillGroup options={BUDGET_OPTIONS} value={local.budgetRange} onChange={v => set({ budgetRange: v as string })} />
          </GenericPanel>
        );

      case 'flat_type':
        return (
          <GenericPanel>
            <p style={{ fontSize: 11, color: '#aaa', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Select all that apply</p>
            <PillGroup options={FLAT_TYPES} value={local.flatTypes} onChange={v => set({ flatTypes: v as string[] })} multi />
          </GenericPanel>
        );

      case 'furnishing':
        return (
          <GenericPanel>
            <p style={{ fontSize: 11, color: '#aaa', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Select all that apply</p>
            <PillGroup options={FURNISHING_OPTS} value={local.furnishing} onChange={v => set({ furnishing: v as string[] })} multi />
          </GenericPanel>
        );

      case 'society':
        return (
          <GenericPanel>
            <p style={{ fontSize: 11, color: '#aaa', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Select one</p>
            <PillGroup options={SOCIETY_OPTS} value={local.society} onChange={v => set({ society: v as string })} />
          </GenericPanel>
        );

      case 'inspection':
        return (
          <GenericPanel>
            <p style={{ fontSize: 11, color: '#aaa', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Select all that apply</p>
            <PillGroup options={INSPECTION_OPTS} value={local.inspection} onChange={v => set({ inspection: v as string[] })} multi />
          </GenericPanel>
        );

      case 'movein':
        return (
          <GenericPanel>
            <p style={{ fontSize: 11, color: '#aaa', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>When do you need to move?</p>
            <PillGroup options={MOVEIN_OPTS} value={local.moveIn} onChange={v => set({ moveIn: v as string })} />
          </GenericPanel>
        );

      case 'bathrooms':
        return (
          <GenericPanel>
            <p style={{ fontSize: 11, color: '#aaa', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Minimum count</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3].map(n => (
                <button
                  key={n}
                  onClick={() => set({ minBathrooms: n })}
                  style={{
                    flex: 1, padding: '12px 0', borderRadius: 10,
                    border: `1px solid ${local.minBathrooms === n ? BLUE : 'rgba(0,0,0,0.12)'}`,
                    background: local.minBathrooms === n ? 'rgba(58,119,255,0.09)' : '#f4f4f4',
                    fontSize: 15, fontWeight: 700,
                    color: local.minBathrooms === n ? BLUE : '#444',
                    transition: 'all 0.14s ease',
                  }}
                >
                  {n}+
                </button>
              ))}
            </div>
          </GenericPanel>
        );

      case 'amenities':
        return <AmenitiesPanel local={local} set={set} />;

      case 'preferences':
        return <PreferencesPanel local={local} set={set} />;

      default:
        return null;
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 55, pointerEvents: open ? 'auto' : 'none' }}>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.40)',
          backdropFilter: 'blur(2px)',
          opacity: 0,
        }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '91%',
          background: '#fff',
          borderRadius: '22px 22px 0 0',
          boxShadow: '0 -8px 48px rgba(0,0,0,0.16)',
          display: 'flex', flexDirection: 'column',
          transform: 'translateY(100%)',
          overflow: 'hidden',
        }}
      >
        {/* ── Handle ── */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 100, background: 'rgba(0,0,0,0.12)' }} />
        </div>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 18px 10px',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <p style={{ fontSize: 17, fontWeight: 800, color: '#0a0a0a' }}>Filters</p>
            {activeCount > 0 && (
              <div style={{
                minWidth: 22, height: 22, borderRadius: 100,
                background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px',
              }}>
                <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>{activeCount}</span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={handleReset}
              style={{ fontSize: 13, fontWeight: 700, color: '#ff3b30', background: 'none', border: 'none' }}
            >
              Reset all
            </button>
            <button
              onClick={onClose}
              style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'rgba(0,0,0,0.07)', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={14} color="#555" />
            </button>
          </div>
        </div>

        {/* ── Two-column body ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* LEFT SIDEBAR */}
          <div
            style={{
              width: '36%',
              background: '#F5F5F5',
              overflowY: 'auto',
              flexShrink: 0,
              borderRight: '1px solid rgba(0,0,0,0.07)',
            }}
            className="hide-scrollbar"
          >
            {CATEGORIES.map(cat => {
              const count   = getCategoryCount(cat.id, local);
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => selectCategory(cat.id)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '14px 14px 14px 0',
                    paddingLeft: isActive ? 0 : 0,
                    background: isActive ? '#fff' : 'transparent',
                    borderLeft: `3px solid ${isActive ? BLUE : 'transparent'}`,
                    borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? BLUE : '#444',
                      paddingLeft: 14,
                      lineHeight: 1.3,
                    }}
                  >
                    {cat.label}
                  </span>
                  {count > 0 && (
                    <div style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: BLUE, flexShrink: 0, marginRight: 12,
                    }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* RIGHT PANEL */}
          <div
            ref={rightRef}
            style={{ flex: 1, overflowY: 'auto', background: '#fff' }}
            className="hide-scrollbar"
          >
            {renderRight()}
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '12px 16px 24px',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          background: '#fff', flexShrink: 0,
          display: 'flex', gap: 10,
        }}>
          <button
            onClick={handleReset}
            style={{
              flex: 1, padding: '12px 0', borderRadius: 12,
              fontSize: 13, fontWeight: 700,
              border: '1.5px solid rgba(0,0,0,0.13)',
              background: '#fff', color: '#555',
            }}
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            style={{
              flex: 2.5, padding: '12px 0', borderRadius: 12,
              fontSize: 14, fontWeight: 800,
              background: `linear-gradient(135deg,${BLUE} 0%,#5b5ef4 100%)`,
              border: 'none', color: '#fff',
              boxShadow: '0 4px 16px rgba(58,119,255,0.32)',
            }}
          >
            {activeCount > 0 ? `Apply · ${activeCount} filters` : 'Show all results'}
          </button>
        </div>
      </div>
    </div>
  );
}