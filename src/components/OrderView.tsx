import type { OrderStatus, PublicOrder } from '../types';
import { formatDate, rupees, STATUS_LABEL } from '../lib/format';

const FLOW: OrderStatus[] = ['placed', 'confirmed', 'packing', 'shipped', 'out_for_delivery', 'delivered'];

export function StatusTimeline({ order }: { order: PublicOrder }) {
  if (order.status === 'cancelled' || order.status === 'refunded' || order.status === 'pending_payment') {
    const tone = order.status === 'pending_payment' ? 'bg-haldi-light text-ink' : 'bg-red-50 text-red-800';
    return <div className={`rounded-xl px-4 py-3 font-semibold ${tone}`}>Status: {STATUS_LABEL[order.status]}</div>;
  }
  const current = FLOW.indexOf(order.status);
  const when = (s: OrderStatus) => order.statusHistory.filter((h) => h.status === s).at(-1)?.at;
  return (
    <ol className="relative space-y-0">
      {FLOW.map((s, i) => {
        const done = i <= current;
        const at = when(s);
        return (
          <li key={s} className="relative flex gap-3 pb-5 last:pb-0">
            {i < FLOW.length - 1 && <span className={`absolute top-7 left-[13px] h-full w-0.5 ${i < current ? 'bg-leaf' : 'bg-cream-dark'}`} aria-hidden />}
            <span className={`relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border-2 ${done ? 'border-leaf bg-leaf text-white' : 'border-cream-dark bg-white'}`}>
              {done && <span className="size-2 rounded-full bg-white" />}
            </span>
            <div>
              <p className={`font-semibold ${done ? '' : 'text-ink-soft'}`}>{STATUS_LABEL[s]}</p>
              {at && <p className="text-xs text-ink-soft">{formatDate(at)}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function OrderDetails({ order }: { order: PublicOrder }) {
  const a = order.address;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card p-5">
        <h2 className="text-lg font-semibold">Order status</h2>
        <div className="mt-4">
          <StatusTimeline order={order} />
        </div>
        {order.tracking && (
          <div className="mt-5 rounded-xl bg-cream-dark/60 p-4 text-sm">
            <p className="font-semibold">Courier tracking</p>
            {order.tracking.courier && <p>{order.tracking.courier}</p>}
            {order.tracking.awb && <p>AWB / Tracking no.: <span className="font-mono">{order.tracking.awb}</span></p>}
            {order.tracking.url && (
              <a href={order.tracking.url} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-3 min-h-9 py-1.5 text-sm">
                Track on courier website
              </a>
            )}
          </div>
        )}
      </div>
      <div className="card p-5">
        <h2 className="text-lg font-semibold">Items</h2>
        <ul className="mt-3 divide-y divide-cream-dark text-sm">
          {order.items.map((it, i) => (
            <li key={i} className="flex justify-between gap-3 py-2">
              <span>{it.name} <span className="text-ink-soft">({it.variantLabel}) × {it.quantity}</span></span>
              <span className="font-semibold">{rupees(it.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-2 space-y-1 border-t border-cream-dark pt-2 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{rupees(order.pricing.subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Delivery</dt><dd>{order.pricing.shipping ? rupees(order.pricing.shipping) : 'Free'}</dd></div>
          {order.pricing.codFee > 0 && <div className="flex justify-between"><dt>COD fee</dt><dd>{rupees(order.pricing.codFee)}</dd></div>}
          <div className="flex justify-between text-base font-bold"><dt>Total</dt><dd>{rupees(order.pricing.total)}</dd></div>
        </dl>
        <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="font-semibold">Delivery address</p>
            <p className="text-ink-soft">
              {order.customer.name}<br />
              {a.line1}, {a.line2}{a.landmark && `, ${a.landmark}`}<br />
              {a.city}, {a.state} – {a.pincode}<br />
              Phone: {order.customer.phone}
            </p>
          </div>
          <div>
            <p className="font-semibold">Payment</p>
            <p className="text-ink-soft">
              {order.payment.method === 'cod' ? 'Cash on Delivery' : 'Online (Razorpay)'}<br />
              Status: <span className="capitalize">{order.payment.status}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
