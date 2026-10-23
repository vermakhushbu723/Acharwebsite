import { useState, type FormEvent } from 'react';
import { api, ApiError } from '../lib/api';
import { usePageMeta } from '../lib/format';
import type { PublicOrder } from '../types';
import { OrderDetails } from '../components/OrderView';
import { Spinner } from '../components/ui';

export default function TrackOrder() {
  usePageMeta('Track Your Order', 'Apne Acharika achaar order ka status order ID aur mobile number se track karein. Courier tracking details bhi yahin milengi.');
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<PublicOrder | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await api<{ order: PublicOrder }>('/orders/track', { body: { orderNumber, phone } });
      setOrder(res.order);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(Object.values(apiErr.fields)[0] || apiErr.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-bold sm:text-4xl">Track your order</h1>
      <p className="mt-1 text-ink-soft">Order ID aur order par diya gaya mobile number enter karein.</p>

      <form onSubmit={submit} className="card mt-6 grid max-w-2xl gap-4 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <label htmlFor="ord" className="label">Order ID</label>
          <input id="ord" className="input font-mono uppercase" placeholder="ACH-261011-XXXXXX" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="ph" className="label">Mobile number</label>
          <input id="ph" type="tel" inputMode="numeric" maxLength={10} className="input" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} required />
        </div>
        <button className="btn-primary" disabled={loading}>{loading ? <Spinner className="size-5" /> : 'Track'}</button>
        {error && <p className="field-error sm:col-span-3" role="alert">{error}</p>}
      </form>

      {order && (
        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-semibold">
            Order <span className="font-mono">{order.orderNumber}</span>
          </h2>
          <OrderDetails order={order} />
        </div>
      )}
    </div>
  );
}
