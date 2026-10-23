import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePageMeta, rupees } from '../lib/format';
import { useSettings } from '../context/SettingsContext';
import type { PublicSettings } from '../types';
import { NotFound } from './ContentPages';

/*
 * DRAFT POLICIES. These are starting templates, not legal advice.
 * Have them reviewed by a qualified professional and edit them to match how you actually operate
 * before launch. Text in [brackets] must be filled in.
 */

type Policy = { title: string; body: (s: PublicSettings) => ReactNode };

const lastUpdated = '11 October 2026';

const POLICIES: Record<string, Policy> = {
  shipping: {
    title: 'Shipping Policy',
    body: (s) => (
      <>
        <h2>Processing time</h2>
        <p>{s.shipping.processingTime || 'Orders are usually packed within [X] working days.'} Orders placed on Sundays or public holidays are processed the next working day.</p>
        <h2>Delivery areas</h2>
        <p>We deliver to the PIN codes accepted at checkout. Enter your PIN code on any product page or at checkout to confirm.</p>
        <h2>Delivery time</h2>
        <p>{s.shipping.deliveryEstimate || 'Delivery usually takes [X–Y] working days after dispatch.'} Delivery estimates are not guaranteed and may be affected by courier delays, weather, holidays or local restrictions.</p>
        <h2>Shipping charges</h2>
        <ul>
          <li>Standard delivery: {rupees(s.shipping.flatRate)} per order.</li>
          {s.shipping.freeShippingThreshold > 0 && <li>Free delivery on orders of {rupees(s.shipping.freeShippingThreshold)} or more.</li>}
          {s.cod.enabled && s.cod.fee > 0 && <li>Cash on Delivery fee: {rupees(s.cod.fee)}.</li>}
          <li>All charges are shown at checkout before you place the order.</li>
        </ul>
        <h2>Tracking</h2>
        <p>Once dispatched, courier and tracking details appear on your order tracking page.</p>
        <h2>Incorrect address & failed delivery</h2>
        <p>Please check your address and phone number carefully. If a delivery fails because of an incorrect address or because the recipient is unreachable, [describe re-delivery / return-to-origin charges and refund handling].</p>
      </>
    ),
  },
  returns: {
    title: 'Cancellation, Returns & Refund Policy',
    body: () => (
      <>
        <p>Because achaar is a food product, we cannot accept returns of opened or used packs for hygiene reasons. We will always help if something goes wrong with your order.</p>
        <h2>Cancellation</h2>
        <ul>
          <li>You can request cancellation before your order is dispatched by contacting support with your order ID.</li>
          <li>Once dispatched, an order cannot be cancelled.</li>
          <li>For prepaid orders cancelled before dispatch, the full amount is refunded to the original payment method.</li>
        </ul>
        <h2>Damaged, leaking, wrong or missing items</h2>
        <ul>
          <li>Contact us within [48 hours] of delivery with your order ID and clear photos/video of the outer package, the product and the label.</li>
          <li>After verification, we will offer a replacement or refund for the affected item(s).</li>
          <li>We will respond to complaints within [2 working days].</li>
        </ul>
        <h2>Refund timelines</h2>
        <p>Approved refunds are initiated within [5–7 working days]. Your bank or payment provider may take additional time to credit the amount. COD refunds are made via [UPI / bank transfer] after we confirm your details.</p>
        <h2>Contact</h2>
        <p>For any issue, reach us through the <Link to="/contact">Contact page</Link>.</p>
      </>
    ),
  },
  privacy: {
    title: 'Privacy Policy',
    body: (s) => (
      <>
        <p>This policy explains how {s.business.name} collects and uses your personal information when you use this website.</p>
        <h2>What we collect</h2>
        <ul>
          <li>Order details: name, mobile number, email (optional), delivery address and items ordered.</li>
          <li>Payment status from our payment partner. We never see or store your full card, UPI PIN or bank login details.</li>
          <li>Messages you send through the contact form.</li>
          <li>Your cart and checkout draft are stored only in your own browser.</li>
        </ul>
        <h2>How we use it</h2>
        <ul>
          <li>To process, deliver and support your orders.</li>
          <li>To contact you about your order.</li>
          <li>To send offers and updates only if you opted in. You can opt out at any time.</li>
        </ul>
        <h2>Who we share it with</h2>
        <p>Only with service providers needed to fulfil your order: our payment gateway (Razorpay), courier/delivery partners, and hosting/database providers. We do not sell your personal data.</p>
        <h2>Retention & security</h2>
        <p>We keep order records for as long as needed for accounting and legal requirements [specify period]. Data is transmitted over HTTPS and access is limited to authorised staff.</p>
        <h2>Your rights</h2>
        <p>You can ask us to access, correct or delete your personal data, subject to legal record-keeping requirements. Contact us via the <Link to="/contact">Contact page</Link>{s.business.supportEmail && <> or at {s.business.supportEmail}</>}.</p>
        <h2>Cookies & analytics</h2>
        <p>[Describe any analytics or cookies you use. If none, say so.]</p>
      </>
    ),
  },
  terms: {
    title: 'Terms & Conditions',
    body: (s) => (
      <>
        <p>By placing an order on this website you agree to these terms.</p>
        <h2>Products & descriptions</h2>
        <p>We try to describe products accurately. Product photos and illustrations are for representation; the label on the pack is authoritative for ingredients, net quantity, dates and MRP.</p>
        <h2>Prices & payment</h2>
        <p>Prices are in Indian Rupees and include applicable taxes unless stated otherwise. Delivery and any COD fee are shown at checkout. Prices may change, but the price shown at checkout is the price you pay for that order.</p>
        <h2>Order acceptance</h2>
        <p>An order is accepted once it is confirmed (and, for online payment, once payment is verified). We may cancel an order with a full refund if an item becomes unavailable, the address is not serviceable, or we suspect misuse or fraud.</p>
        <h2>Liability</h2>
        <p>Please read ingredient and allergen information before consuming. To the extent permitted by law, our liability for any order is limited to the amount paid for that order.</p>
        <h2>Governing law & contact</h2>
        <p>These terms are governed by the laws of India. Disputes are subject to the courts of [city]. Contact: {s.business.supportEmail || 'see Contact page'}.</p>
      </>
    ),
  },
  'food-safety': {
    title: 'Food Safety & Allergen Information',
    body: (s) => (
      <>
        <h2>Licence</h2>
        <p>FSSAI Lic./Reg. No.: {s.business.fssaiNumber || '[to be added]'}. The number is also printed on every pack.</p>
        <h2>Allergens</h2>
        <p>Many of our achaar contain <strong>mustard</strong> (seeds and/or oil). Product pages list allergen information for each item. Please check the label carefully if you have allergies.</p>
        <h2>Storage</h2>
        <ul>
          <li>Store in a cool, dry place away from direct sunlight.</li>
          <li>Always use a clean, dry spoon. Moisture can spoil achaar.</li>
          <li>Keep the lid tightly closed. Follow any refrigeration instructions on the label.</li>
        </ul>
        <h2>Label information</h2>
        <p>Each pack carries ingredients, net quantity, batch/lot number, date of manufacture or packing, best-before date, MRP and customer care details.</p>
        <h2>Health claims</h2>
        <p>We do not make medical or health claims about our products.</p>
      </>
    ),
  },
};

export default function PolicyPage() {
  const { slug = '' } = useParams();
  const { settings } = useSettings();
  const policy = POLICIES[slug];
  usePageMeta(policy?.title || 'Policy', policy ? `Acharika ${policy.title}: homemade achaar orders ke liye shipping, payment, refunds, privacy aur food safety ki poori jaankari.` : undefined, { noindex: !policy });
  if (!policy) return <NotFound />;
  return (
    <div className="container-page max-w-3xl py-10">
      <h1 className="text-4xl font-bold">{policy.title}</h1>
      <p className="mt-2 text-sm text-ink-soft">Last updated: {lastUpdated}</p>
      <div className="prose-policy mt-6 [&_a]:text-achaar [&_a]:underline">{policy.body(settings)}</div>
    </div>
  );
}
