import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartLine } from '../types';

const STORAGE_KEY = 'acharika_cart_v1';

type CartCtx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, 'quantity'>, qty: number) => void;
  setQty: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  lastAdded: string | null;
};

const Ctx = createContext<CartCtx | null>(null);

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(load);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable (private mode); cart still works for this visit */
    }
  }, [lines]);

  // Keep tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && setLines(load());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo<CartCtx>(() => {
    const clamp = (q: number, max: number) => Math.max(1, Math.min(q, Math.max(1, Math.min(max, 20))));
    return {
      lines,
      count: lines.reduce((s, l) => s + l.quantity, 0),
      subtotal: lines.reduce((s, l) => s + l.price * l.quantity, 0),
      lastAdded,
      add: (line, qty) => {
        setLines((prev) => {
          const existing = prev.find((l) => l.variantId === line.variantId);
          if (existing) {
            return prev.map((l) => (l.variantId === line.variantId ? { ...l, ...line, quantity: clamp(l.quantity + qty, line.maxQty) } : l));
          }
          return [...prev, { ...line, quantity: clamp(qty, line.maxQty) }];
        });
        setLastAdded(line.variantId);
        window.setTimeout(() => setLastAdded(null), 2500);
      },
      setQty: (variantId, qty) =>
        setLines((prev) => prev.map((l) => (l.variantId === variantId ? { ...l, quantity: clamp(qty, l.maxQty) } : l))),
      remove: (variantId) => setLines((prev) => prev.filter((l) => l.variantId !== variantId)),
      clear: () => setLines([]),
    };
  }, [lines, lastAdded]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
