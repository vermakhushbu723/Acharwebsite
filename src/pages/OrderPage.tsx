import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { payWithRazorpay } from '../lib/razorpay';
import { usePageMeta } from '../lib/format';
import type { PublicOrder, RazorpayPayload } from '../types';
import { OrderDetails } from '../components/OrderView';
import { EmptyState, PageLoader, Spinner } from '../components/ui';

/** Order confirmation + secure tracking link page: /order/:orderNumber?k=<accessKey> */
export default function OrderPage() {
  const { orderNumber = '' } = useParams();
  const [params] = useSearchParams();
  const key = params.get('k') || '';
  const isNew = params.get('new') === '1';
  const [data, setData] = useState<{ order: PublicOrder; payment: RazorpayPayload | null } | null>(null);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');
  const [copied, setCopied] = useState(false);
  usePageMeta(`Order ${orderNumber}`, undefined, { noindex: true });

  const load = () =>
    api<{ order: PublicOrder; payment: RazorpayPayload | null }>(`/orders/${encodeURIComponent(orderNumber)}?k=${encodeURIComponent(key)}`)
      .then(setData)
      .catch((e) => setError(e.message));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber, key]);

  if (error) {
    return (
      <EmptyState title="Order nahi mila" body="Link galat ya purana ho sakta hai. Order ID aur phone number se track karein." action={<Link to="/track-order" className="btn-primary">Track Order</Link>} />
    );
  }
  if (!data) return <PageLoader />;

  const { order, payment } = data;
  const awaitingPayment = order.status === 'pending_payment' && payment;

  const pay = async () => {
    if (!payment) return;
    setPaying(true);
    setPayError('');
    try {
      await payWithRazorpay(payment, { orderNumber: order.orderNumber, accessKey: key });
      await load();
    } catch (e) {
      setPayError((e as Error).message);
    } finally {
      setPaying(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href.replace(/&new=1/, ''));
      setCopied(true);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="container-page py-8">
      {awaitingPayment ? (
        <div className="card mb-6 border-haldi bg-haldi-light/40 p-6">
          <h1 className="text-2xl font-bold sm:text-3xl">Payment pending</h1>
          <p className="mt-2 text-ink-soft">
            Order <strong className="text-ink">{order.orderNumber}</strong> is reserved for you but not confirmed yet. Please complete the payment within 30 minutes. Unpaid orders are cancelled automatically.
          </p>
          {payError && <p className="mt-3 text-red-700">{payError}</p>}
          <button className="btn-primary mt-4" onClick={pay} disabled={paying}>
            {paying ? <Spinner className="size-5" /> : 'Complete payment'}
          </button>
        </div>
      ) : (
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">{isNew && order.status !== 'cancelled' ? 'Thank you! Aapka order place ho gaya hai.' : `Order ${order.orderNumber}`}</h1>
          <p className="mx-auto mt-2 max-w-xl text-ink-soft">
            Order ID: <strong className="font-mono text-ink">{order.orderNumber}</strong>.{' '}
            {isNew && 'Hum aapke order details verify karke processing update share karenge.'}
          </p>
        </div>
      )}

      <OrderDetails order={order} />

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button className="btn-secondary" onClick={copyLink}>{copied ? 'Link copied' : 'Copy tracking link'}</button>
        <Link to="/shop" className="btn-ghost">Continue shopping</Link>
        <Link to="/contact" className="btn-ghost">Need help?</Link>
      </div>
      <p className="mt-3 text-center text-xs text-ink-soft">Save this link to track your order. You can also track with your order ID and phone number.</p>
    </div>
  );
}
