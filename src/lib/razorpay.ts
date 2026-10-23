import { api } from './api';
import type { RazorpayPayload } from '../types';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

let loader: Promise<void> | null = null;

function loadScript() {
  if (window.Razorpay) return Promise.resolve();
  loader ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve();
    s.onerror = () => {
      loader = null;
      reject(new Error('Could not load the payment window. Check your connection and try again.'));
    };
    document.body.appendChild(s);
  });
  return loader;
}

/**
 * Opens Razorpay Checkout. Resolves 'paid' once the server has verified the signature,
 * or 'dismissed' if the customer closed the window.
 */
export async function payWithRazorpay(p: RazorpayPayload, order: { orderNumber: string; accessKey: string }): Promise<'paid' | 'dismissed'> {
  await loadScript();
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: p.keyId,
      order_id: p.razorpayOrderId,
      amount: p.amount,
      currency: p.currency,
      name: p.name,
      description: `Order ${order.orderNumber}`,
      prefill: p.prefill,
      theme: { color: '#2E0D0A' },
      handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        try {
          await api('/payments/verify', { body: { orderNumber: order.orderNumber, accessKey: order.accessKey, ...resp } });
          resolve('paid');
        } catch (err) {
          reject(err);
        }
      },
      modal: { ondismiss: () => resolve('dismissed') },
    });
    rzp.open();
  });
}
