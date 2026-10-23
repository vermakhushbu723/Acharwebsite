import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api, ApiError } from '../lib/api';
import { usePageMeta } from '../lib/format';
import { useSettings } from '../context/SettingsContext';
import { Spinner } from '../components/ui';

export default function Contact() {
  usePageMeta('Contact Us', 'Acharika se sampark karein: order, delivery, bulk ya gifting orders ke liye WhatsApp, phone ya email par baat karein.');
  const { settings } = useSettings();
  const b = settings.business;
  const [form, setForm] = useState({ name: '', contact: '', orderNumber: '', subject: '', message: '', website: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await api('/contact', { body: form });
      setStatus('sent');
    } catch (err) {
      const apiErr = err as ApiError;
      setErrors(apiErr.fields);
      setError(apiErr.status === 429 ? 'Too many messages. Please try again later or contact us on WhatsApp.' : apiErr.message);
      setStatus('idle');
    }
  };

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl font-bold sm:text-5xl">Humse baat karein.</h1>
      <p className="mt-2 text-lg text-ink-soft">Order, delivery ya product: kisi bhi sawaal ke liye hum yahaan hain.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="card p-6">
          {status === 'sent' ? (
            <div className="py-8 text-center">
              <h2 className="text-2xl">Shukriya! Message mil gaya.</h2>
              <p className="mt-2 text-ink-soft">Hum {b.supportHours ? `support hours (${b.supportHours}) mein` : 'jaldi'} aapse contact karenge.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
              <div>
                <label htmlFor="c-name" className="label">Name</label>
                <input id="c-name" className={`input ${errors.name ? 'input-error' : ''}`} value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" />
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="c-contact" className="label">Phone or email</label>
                <input id="c-contact" className={`input ${errors.contact ? 'input-error' : ''}`} value={form.contact} onChange={(e) => set('contact', e.target.value)} />
                {errors.contact && <p className="field-error">{errors.contact}</p>}
              </div>
              <div>
                <label htmlFor="c-order" className="label">Order ID <span className="font-normal text-ink-soft">(optional)</span></label>
                <input id="c-order" className="input font-mono uppercase" value={form.orderNumber} onChange={(e) => set('orderNumber', e.target.value)} />
              </div>
              <div>
                <label htmlFor="c-subject" className="label">Subject</label>
                <select id="c-subject" className="input" value={form.subject} onChange={(e) => set('subject', e.target.value)}>
                  <option value="">Choose a topic</option>
                  <option>Order status</option>
                  <option>Damaged / leaking / wrong item</option>
                  <option>Cancellation or refund</option>
                  <option>Product question</option>
                  <option>Bulk / gifting order</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="c-msg" className="label">Message</label>
                <textarea id="c-msg" rows={5} className={`input ${errors.message ? 'input-error' : ''}`} value={form.message} onChange={(e) => set('message', e.target.value)} />
                {errors.message && <p className="field-error">{errors.message}</p>}
              </div>
              {/* Honeypot for bots: hidden from people and screen readers */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden value={form.website} onChange={(e) => set('website', e.target.value)} />
              <p className="text-xs text-ink-soft sm:col-span-2">
                Aapki details sirf aapke sawaal ka jawab dene ke liye use hongi. See our <Link to="/policies/privacy" className="underline">Privacy Policy</Link>.
              </p>
              {error && <p className="field-error sm:col-span-2" role="alert">{error}</p>}
              <div className="sm:col-span-2">
                <button className="btn-primary" disabled={status === 'sending'}>
                  {status === 'sending' ? <Spinner className="size-5" /> : 'Send message'}
                </button>
              </div>
            </form>
          )}
        </div>

        <aside className="space-y-4">
          {b.whatsapp && (
            <a href={`https://wa.me/${b.whatsapp}`} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-3 p-5 hover:border-leaf">
              <span>
                <span className="block font-semibold">WhatsApp us</span>
                <span className="text-sm text-ink-soft">Fastest way to reach us</span>
              </span>
            </a>
          )}
          <div className="card space-y-2 p-5 text-sm">
            {b.supportPhone && <p><strong>Phone:</strong> <a href={`tel:${b.supportPhone}`} className="text-achaar">{b.supportPhone}</a></p>}
            {b.supportEmail && <p><strong>Email:</strong> <a href={`mailto:${b.supportEmail}`} className="text-achaar">{b.supportEmail}</a></p>}
            {b.supportHours && <p><strong>Support hours:</strong> {b.supportHours}</p>}
            {b.address && <p><strong>Address:</strong> {b.address}</p>}
            {!b.supportPhone && !b.supportEmail && !b.whatsapp && <p className="text-ink-soft">Use the form and we'll get back to you.</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
