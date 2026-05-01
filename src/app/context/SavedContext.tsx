import React, { createContext, useContext, useState, useEffect } from 'react';

export type SavedStatus = 'shortlisted' | 'contacted' | 'visit_scheduled' | 'not_interested';

export interface SavedItem {
  id: string;
  status: SavedStatus;
  savedAt: number; // unix ms
}

interface SavedContextType {
  savedItems: SavedItem[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
  updateStatus: (id: string, status: SavedStatus) => void;
  removeFromSaved: (id: string) => void;
}

const SavedContext = createContext<SavedContextType | null>(null);

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    try {
      const raw = localStorage.getItem('flatapp_saved');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try { localStorage.setItem('flatapp_saved', JSON.stringify(savedItems)); } catch {}
  }, [savedItems]);

  const isSaved = (id: string) => savedItems.some(i => i.id === id);

  const toggleSaved = (id: string) =>
    setSavedItems(prev =>
      prev.some(i => i.id === id)
        ? prev.filter(i => i.id !== id)
        : [...prev, { id, status: 'shortlisted', savedAt: Date.now() }]
    );

  const updateStatus = (id: string, status: SavedStatus) =>
    setSavedItems(prev => prev.map(i => i.id === id ? { ...i, status } : i));

  const removeFromSaved = (id: string) =>
    setSavedItems(prev => prev.filter(i => i.id !== id));

  return (
    <SavedContext.Provider value={{ savedItems, isSaved, toggleSaved, updateStatus, removeFromSaved }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error('useSaved must be used within SavedProvider');
  return ctx;
}
