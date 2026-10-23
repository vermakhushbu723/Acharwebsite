import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { api, ApiError } from '../lib/api';
import { payWithRazorpay } from '../lib/razorpay';
import { rupees, usePageMeta } from '../lib/format';
import type { Quote, RazorpayPayload } from '../types';
import { EmptyState, Spinner } from '../components/ui';

const STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

type Form = {
  name: string; phone: string; email: string;
  line1: string; line2: string; landmark: string; city: string; state: string; pincode: string;
  note: string; terms: boolean; marketing: boolean;
};

const EMPTY: Form = { name: '', phone: '', email: '', line1: '', line2: '', landmark: '', city: '', state: '', pincode: '', note: '', terms: false, marketing: false };
const DRAFT_KEY = 'acharika_checkout_draft';

function loadDraft(): Form {
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
    return { ...EMPTY, ...d, terms: false, marketing: false };
  } catch {
    return EMPTY;
  }
}

function Field({ id, label, error, optional, children }: { id: string; label: string; error?: string; optional?: boolean; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label} {optional && <span className="font-normal text-ink-soft">(optional)</span>}
      </label>
      {children}
      {error && <p id={`${id}-err`} className="field-error">{error}</p>}
    </div>
  );
}

export default function Checkout() {
  usePageMeta('Checkout', undefined, { noindex: true });
  const { lines, clear } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>(loadDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [method, setMethod] = useState<'cod' | 'razorpay' | ''>('');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteError, setQuoteError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const requestId = useRef(crypto.randomUUID());

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  // Remember contact/address (not consent) so a refresh doesn't lose typing.
  useEffect(() => {
    const { terms, marketing, ...rest } = form;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
    } catch {
      /* ignore */
    }
  }, [form]);

  // Default payment method once settings load.
  useEffect(() => {
    if (method) return;
    if (settings.onlinePayment) setMethod('razorpay');
    else if (settings.cod.enabled) setMethod('cod');
  }, [settings, method]);

  // Server quote: re-run when cart, PIN code or payment method changes.
  const pinValid = /^[1-9]\d{5}$/.test(form.pincode);
  const cartKey = lines.map((l) => `${l.variantId}:${l.quantity}`).join(',');
  useEffect(() => {
    if (!lines.length) return;
    const ctrl = new AbortController();
    setQuoteError('');
    api<Quote>('/cart/validate', {
      body: {
        items: lines.map((l) => ({ productId: l.productId, variantId: l.variantId, quantity: l.quantity })),
        pincode: pinValid ? form.pincode : '',
        paymentMethod: method || undefined,
      },
      signal: ctrl.signal,
    })
      .then(setQuote)
      .catch((e) => e.name !== 'AbortError' && setQuoteError(e.message));
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartKey, pinValid ? form.pincode : '', method]);

  // If COD becomes unavailable for this cart, switch away from it.
  useEffect(() => {
    if (method === 'cod' && quote && !quote.codAvailable) setMethod(settings.onlinePayment ? 'razorpay' : '');
  }, [quote, method, settings.onlinePayment]);

  if (!lines.length && !submitting) {
    return (
      <div className="container-page py-8">
        <EmptyState title="Aapka cart khaali hai" action={<Link to="/shop" className="btn-primary">Shop All Achaar</Link>} />
      </div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = 'Please enter your full name';
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, '').slice(-10))) e.phone = 'Enter a valid 10-digit mobile number';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (form.line1.trim().length < 3) e.line1 = 'House / flat details are required';
    if (form.line2.trim().length < 3) e.line2 = 'Street / locality is required';
    if (form.city.trim().length < 2) e.city = 'City is required';
    if (!form.state) e.state = 'Please select your state';
    if (!pinValid) e.pincode = 'Enter a valid 6-digit PIN code';
    else if (quote && quote.serviceable === false) e.pincode = 'Sorry, we do not deliver to this PIN code yet';
    if (!method) e.method = 'Please choose a payment method';
    if (!form.terms) e.terms = 'Please accept the Terms and Privacy Policy to continue';
    return e;
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (submitting) return;
    const e = validate();
    setErrors(e);
    setFormError('');
    if (Object.values(e).some(Boolean)) {
      document.getElementById(Object.keys(e).find((k) => e[k])!)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const res = await api<{ orderNumber: string; accessKey: string; status: string; payment: RazorpayPayload | null }>('/orders', {
        body: {
          clientRequestId: requestId.current,
          items: lines.map((l) => ({ productId: l.productId, variantId: l.variantId, quantity: l.quantity })),
          customer: { name: form.name, phone: form.phone, email: form.email },
          address: { line1: form.line1, line2: form.line2, landmark: form.landmark, city: form.city, state: form.state, pincode: form.pincode },
          paymentMethod: method,
          note: form.note,
          consent: { terms: form.terms, marketing: form.marketing },
        },
      });
      const orderUrl = `/order/${res.orderNumber}?k=${encodeURIComponent(res.accessKey)}`;
      // The order exists now (stock is held), so the cart can be cleared.
      clear();
      if (res.payment) {
        try {
          const outcome = await payWithRazorpay(res.payment, res);
          navigate(outcome === 'paid' ? `${orderUrl}&new=1` : orderUrl, { replace: true });
        } catch {
          navigate(orderUrl, { replace: true });
        }
      } else {
        navigate(`${orderUrl}&new=1`, { replace: true });
      }
    } catch (err) {
      const apiErr = err as ApiError;
      // A network failure might still have created the order: keep the same request id so a retry is safe.
      if (apiErr.status !== 0) requestId.current = crypto.randomUUID();
      const fieldMap: Record<string, string> = {};
      for (const [k, v] of Object.entries(apiErr.fields || {})) fieldMap[k.split('.').pop()!] = v;
      setErrors(fieldMap);
      setFormError(apiErr.status === 409 ? `${apiErr.message} ` : apiErr.message);
      setSubmitting(false);
    }
  };

  const p = quote?.pricing;
  const inputCls = (k: string) => `input ${errors[k] ? 'input-error' : ''}`;

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-bold sm:text-4xl">Checkout</h1>
      <p className="mt-1 text-ink-soft">Guest checkout: no account needed.</p>

      <form onSubmit={submit} noValidate className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="card p-5">
            <h2 className="text-xl font-semibold">Contact details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field id="name" label="Full name" error={errors.name}>
                <input id="name" className={inputCls('name')} autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} />
              </Field>
              <Field id="phone" label="Mobile number" error={errors.phone}>
                <div className="flex">
                  <span className="flex items-center rounded-l-xl border border-r-0 border-[#d9c8a8] bg-cream-dark px-3 text-sm">+91</span>
                  <input id="phone" type="tel" inputMode="numeric" maxLength={10} className={`${inputCls('phone')} rounded-l-none`} autoComplete="tel-national" value={form.phone} onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))} />
                </div>
              </Field>
              <div className="sm:col-span-2">
                <Field id="email" label="Email" optional error={errors.email}>
                  <input id="email" type="email" className={inputCls('email')} autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="For order updates" />
                </Field>
              </div>
            </div>
          </section>

          <section className="card p-5">
            <h2 className="text-xl font-semibold">Delivery address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field id="line1" label="House / flat / building" error={errors.line1}>
                  <input id="line1" className={inputCls('line1')} autoComplete="address-line1" value={form.line1} onChange={(e) => set('line1', e.target.value)} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field id="line2" label="Street / area / locality" error={errors.line2}>
                  <input id="line2" className={inputCls('line2')} autoComplete="address-line2" value={form.line2} onChange={(e) => set('line2', e.target.value)} />
                </Field>
              </div>
              <Field id="landmark" label="Landmark" optional>
                <input id="landmark" className="input" value={form.landmark} onChange={(e) => set('landmark', e.target.value)} />
              </Field>
              <Field id="pincode" label="PIN code" error={errors.pincode}>
                <input id="pincode" inputMode="numeric" maxLength={6} className={inputCls('pincode')} autoComplete="postal-code" value={form.pincode} onChange={(e) => set('pincode', e.target.value.replace(/\D/g, ''))} />
                {pinValid && quote?.serviceable === true && !errors.pincode && <p className="mt-1 text-sm text-leaf">We deliver here</p>}
                {pinValid && quote?.serviceable === false && !errors.pincode && <p className="field-error">Sorry, we do not deliver to this PIN code yet.</p>}
              </Field>
              <Field id="city" label="City / town" error={errors.city}>
                <input id="city" className={inputCls('city')} autoComplete="address-level2" value={form.city} onChange={(e) => set('city', e.target.value)} />
              </Field>
              <Field id="state" label="State" error={errors.state}>
                <select id="state" className={inputCls('state')} autoComplete="address-level1" value={form.state} onChange={(e) => set('state', e.target.value)}>
                  <option value="">Select state</option>
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field id="note" label="Delivery note" optional>
                  <input id="note" className="input" maxLength={300} value={form.note} onChange={(e) => set('note', e.target.value)} placeholder="e.g. call before delivery" />
                </Field>
              </div>
            </div>
            {settings.shipping.deliveryEstimate && <p className="mt-4 text-sm text-ink-soft">{settings.shipping.processingTime} {settings.shipping.deliveryEstimate}</p>}
          </section>

          <section className="card p-5">
            <h2 className="text-xl font-semibold" id="method">Payment</h2>
            <div className="mt-4 space-y-3" role="radiogroup" aria-labelledby="method">
              {settings.onlinePayment && (
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 ${method === 'razorpay' ? 'border-achaar bg-achaar/5' : 'border-[#d9c8a8]'}`}>
                  <input type="radio" name="method" className="mt-1 accent-achaar" checked={method === 'razorpay'} onChange={() => setMethod('razorpay')} />
                  <span>
                    <span className="block font-semibold">Pay online: UPI, cards, net banking</span>
                    <span className="text-sm text-ink-soft">Secure payment via Razorpay.</span>
                  </span>
                </label>
              )}
              {settings.cod.enabled && (
                <label className={`flex items-start gap-3 rounded-xl border-2 p-4 ${quote && !quote.codAvailable ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${method === 'cod' ? 'border-achaar bg-achaar/5' : 'border-[#d9c8a8]'}`}>
                  <input type="radio" name="method" className="mt-1 accent-achaar" checked={method === 'cod'} disabled={Boolean(quote && !quote.codAvailable)} onChange={() => setMethod('cod')} />
                  <span>
                    <span className="block font-semibold">Cash on Delivery {settings.cod.fee > 0 && <span className="font-normal">(+{rupees(settings.cod.fee)} fee)</span>}</span>
                    <span className="text-sm text-ink-soft">
                      {quote && !quote.codAvailable ? `Not available for orders above ${rupees(settings.cod.maxOrderValue)}.` : 'Pay in cash or UPI when your order arrives.'}
                    </span>
                  </span>
                </label>
              )}
              {!settings.onlinePayment && !settings.cod.enabled && <p className="text-red-700">Ordering is temporarily unavailable. Please contact us.</p>}
              {errors.method && <p className="field-error">{errors.method}</p>}
            </div>
          </section>
        </div>

        <aside className="card h-fit p-5 lg:sticky lg:top-28">
          <h2 className="text-xl font-semibold">Order summary</h2>
          <ul className="mt-4 divide-y divide-cream-dark text-sm">
            {(quote?.lines ?? []).map((l) => (
              <li key={l.variantId} className="flex justify-between gap-3 py-2">
                <span>{l.name} <span className="text-ink-soft">({l.variantLabel}) × {l.quantity}</span></span>
                <span className="font-semibold">{rupees(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          {quoteError && <p className="mt-2 text-sm text-red-700">{quoteError}</p>}
          {quote?.issues.length ? (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
              {quote.issues.map((i) => i.message).join(' ')} <Link to="/cart" className="underline">Update cart</Link>
            </p>
          ) : null}
          <dl className="mt-3 space-y-1.5 border-t border-cream-dark pt-3 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{p ? rupees(p.subtotal) : '…'}</dd></div>
            <div className="flex justify-between"><dt>Delivery</dt><dd>{p ? (p.shipping ? rupees(p.shipping) : 'Free') : '…'}</dd></div>
            {p && p.codFee > 0 && <div className="flex justify-between"><dt>COD fee</dt><dd>{rupees(p.codFee)}</dd></div>}
            <div className="flex justify-between border-t border-cream-dark pt-2 text-lg font-bold"><dt>Total</dt><dd>{p ? rupees(p.total) : '…'}</dd></div>
            <p className="text-xs text-ink-soft">Inclusive of all taxes.</p>
          </dl>

          <div className="mt-5 space-y-3 text-sm">
            <label className="flex items-start gap-2">
              <input id="terms" type="checkbox" className="mt-1 size-4 accent-achaar" checked={form.terms} onChange={(e) => set('terms', e.target.checked)} />
              <span>
                I agree to the <Link to="/policies/terms" target="_blank" className="text-achaar underline">Terms & Conditions</Link>, <Link to="/policies/privacy" target="_blank" className="text-achaar underline">Privacy Policy</Link> and <Link to="/policies/returns" target="_blank" className="text-achaar underline">Refund Policy</Link>.
              </span>
            </label>
            {errors.terms && <p className="field-error">{errors.terms}</p>}
            <label className="flex items-start gap-2 text-ink-soft">
              <input type="checkbox" className="mt-1 size-4 accent-achaar" checked={form.marketing} onChange={(e) => set('marketing', e.target.checked)} />
              <span>Send me offers and new-flavour updates on WhatsApp/email (optional).</span>
            </label>
          </div>

          {formError && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{formError}{formError.includes('cart') && <Link to="/cart" className="underline">Review cart</Link>}</p>}

          <button type="submit" className="btn-primary mt-5 w-full text-lg" disabled={submitting || !quote || Boolean(quote.issues.length)}>
            {submitting ? (<><Spinner className="size-5" /> Placing order…</>) : method === 'razorpay' ? `Pay ${p ? rupees(p.total) : ''}` : 'Place Order'}
          </button>
          <p className="mt-2 text-center text-xs text-ink-soft">Secure checkout</p>
        </aside>
      </form>
    </div>
  );
}
