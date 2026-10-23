import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { api } from '../lib/api';
import { rupees, usePageMeta } from '../lib/format';
import type { Quote } from '../types';
import { ProductImage } from '../components/JarArt';
import { EmptyState, QuantityStepper, Spinner } from '../components/ui';
import { TrashIcon } from '../components/Icons';

export default function Cart() {
  usePageMeta('Your Cart', undefined, { noindex: true });
  const { lines, setQty, remove } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  // Re-validate prices and stock with the server whenever the cart changes.
  const key = lines.map((l) => `${l.variantId}:${l.quantity}`).join(',');
  useEffect(() => {
    if (!lines.length) {
      setQuote(null);
      return;
    }
    const ctrl = new AbortController();
    setChecking(true);
    setError('');
    api<Quote>('/cart/validate', {
      body: { items: lines.map((l) => ({ productId: l.productId, variantId: l.variantId, quantity: l.quantity })) },
      signal: ctrl.signal,
    })
      .then(setQuote)
      .catch((e) => e.name !== 'AbortError' && setError(e.message))
      .finally(() => setChecking(false));
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (!lines.length) {
    return (
      <div className="container-page py-8">
        <EmptyState
          title="Aapka cart khaali hai"
          body="Apna favourite achaar choose karein aur cart mein add karein."
          action={<Link to="/shop" className="btn-primary">Shop All Achaar</Link>}
        />
      </div>
    );
  }

  const issueFor = (variantId: string) => quote?.issues.find((i) => i.variantId === variantId);
  const hasIssues = Boolean(quote?.issues.length);
  const threshold = settings.shipping.freeShippingThreshold;
  const subtotal = quote?.pricing.subtotal ?? 0;

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-bold sm:text-4xl">Your Cart</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-4">
          {lines.map((l) => {
            const issue = issueFor(l.variantId);
            const serverLine = quote?.lines.find((q) => q.variantId === l.variantId);
            const price = serverLine?.unitPrice ?? l.price;
            return (
              <li key={l.variantId} className={`card flex gap-4 p-3 sm:p-4 ${issue ? 'border-red-300' : ''}`}>
                <Link to={`/products/${l.slug}`} className="size-24 shrink-0 overflow-hidden rounded-xl sm:size-28">
                  <ProductImage product={{ name: l.name, accentColor: l.accentColor, images: l.image ? [{ url: l.image, alt: l.name }] : [] }} className="size-full" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link to={`/products/${l.slug}`} className="font-semibold hover:text-achaar">{l.name}</Link>
                      <p className="text-sm text-ink-soft">{l.variantLabel} · {rupees(price)} each</p>
                    </div>
                    <button className="flex size-10 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-achaar hover:text-cream hover:text-achaar" onClick={() => remove(l.variantId)} aria-label={`Remove ${l.name}`}>
                      <TrashIcon />
                    </button>
                  </div>
                  {issue && <p className="mt-1 text-sm font-semibold text-red-700">{issue.message}</p>}
                  <div className="mt-auto flex items-center justify-between pt-2">
                    {issue?.type === 'unavailable' ? (
                      <span />
                    ) : (
                      <QuantityStepper size="sm" value={l.quantity} max={issue?.type === 'stock' ? Math.max(issue.available ?? 1, 1) : l.maxQty} onChange={(n) => setQty(l.variantId, n)} />
                    )}
                    <span className="font-bold">{rupees(price * l.quantity)}</span>
                  </div>
                </div>
              </li>
            );
          })}
          <li>
            <Link to="/shop" className="btn-ghost">Continue Shopping</Link>
          </li>
        </ul>

        <aside className="card h-fit p-5 lg:sticky lg:top-28">
          <h2 className="text-xl font-semibold">Order summary</h2>
          {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="font-semibold">{quote ? rupees(quote.pricing.subtotal) : '…'}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd>{quote ? (quote.pricing.shipping === 0 ? 'Free' : rupees(quote.pricing.shipping)) : '…'}</dd>
            </div>
            {threshold > 0 && subtotal > 0 && subtotal < threshold && (
              <p className="rounded-lg bg-haldi-light/50 px-3 py-2 text-xs">Add {rupees(threshold - subtotal)} more for free delivery.</p>
            )}
            <div className="flex justify-between border-t border-cream-dark pt-3 text-base">
              <dt className="font-semibold">Estimated total</dt>
              <dd className="font-bold">{quote ? rupees(quote.pricing.subtotal + quote.pricing.shipping) : '…'}</dd>
            </div>
            <p className="text-xs text-ink-soft">Prices include taxes. Final delivery charge and any COD fee are confirmed at checkout.</p>
          </dl>
          {hasIssues && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">Please fix the items marked above to continue.</p>}
          <button className="btn-primary mt-5 w-full text-lg" disabled={checking || hasIssues || !quote} onClick={() => navigate('/checkout')}>
            {checking ? <Spinner className="size-5" /> : 'Proceed to Checkout'}
          </button>
        </aside>
      </div>
    </div>
  );
}
