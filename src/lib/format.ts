import { useSeo, type SeoInput } from './seo';
import type { OrderStatus } from '../types';

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
export const rupees = (n: number) => inr.format(n);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: 'Awaiting payment',
  placed: 'Order placed',
  confirmed: 'Confirmed',
  packing: 'Preparing / Packing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export const SPICE_LABEL = { mild: 'Mild', medium: 'Medium spicy', hot: 'Extra teekha' } as const;

/** Sets page SEO tags (title, description, canonical, social, robots, JSON-LD). See lib/seo.ts. */
export function usePageMeta(title: string, description?: string, opts: Omit<SeoInput, 'title' | 'description'> = {}) {
  useSeo({ title, description, ...opts });
}
