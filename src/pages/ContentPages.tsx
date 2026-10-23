import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../lib/format';
import { breadcrumbLd } from '../lib/seo';
import { JarArt } from '../components/JarArt';
import { EmptyState } from '../components/ui';

/*
 * NOTE FOR THE OWNER: the story and process text below are drafts from the PRD.
 * Personalise them with your real journey, recipes and kitchen process before launch.
 * Do not publish any legacy, sourcing or hygiene claim that isn't true.
 */

function PageHero({ eyebrow, title, sub, img, alt, hindi }: { eyebrow: string; title: ReactNode; sub: string; img: string; alt: string; hindi: string }) {
  return (
    <section className="grain relative overflow-hidden bg-cream">
      <span className="pointer-events-none absolute -top-8 right-0 font-deva text-[11rem] leading-none text-achaar/[0.06] select-none sm:text-[16rem]" aria-hidden>
        {hindi}
      </span>
      <div className="container-page relative grid items-center gap-10 py-14 lg:grid-cols-[1.2fr_1fr] lg:py-20">
        <div>
          <p className="eyebrow"><span className="h-0.5 w-6 rounded bg-saffron" aria-hidden />{eyebrow}</p>
          <h1 className="mt-3 text-5xl leading-[1] font-black sm:text-6xl">{title}</h1>
          <p className="mt-5 max-w-xl text-lg text-ink-soft sm:text-xl">{sub}</p>
        </div>
        <div className="overflow-hidden rounded-[2.5rem] border-4 border-ink shadow-[12px_12px_0_0_var(--color-haldi)]">
          <img src={img} alt={alt} className="aspect-[4/3] w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

export function About() {
  usePageMeta('About Us: Homemade Achaar Ki Kahani', 'Acharika ki kahani: ghar ki rasoi mein bana homemade achaar, apnapan aur saaf-safai ke saath. Jaaniye hum kaun hain aur kya promise karte hain.', { jsonLd: breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'About Us', path: '/about' }]) });
  const values = [
    { t: 'Ghar jaisa', d: 'Homemade tareeke se bana, jaise apni rasoi mein banta hai.' },
    { t: 'Sach-sach jaankari', d: 'Ingredients, allergens aur storage: sab kuch label aur website par saaf.' },
    { t: 'Bharosa pehle', d: 'Hum wahi promise karte hain jo nibha sakein. Koi jhoothe claims nahi.' },
  ];
  return (
    <>
      <PageHero
        eyebrow="Hamari kahani"
        title={<>Achaar ka swaad, <span className="text-achaar italic">apnapan</span> ke saath.</>}
        sub="Achaar sirf side dish nahi, ghar ke khaane ki yaad hota hai. Dal-chawal ho, garam paratha ho ya safar ka tiffin, ek chammach achaar poore khaane ka swaad badal deta hai."
        img="/images/thali.webp"
        alt="A vegetarian thali with achaar on the side"
        hindi="कहानी"
      />
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1fr_1.2fr]">
        <div className="relative mx-auto flex items-end" aria-hidden>
          <JarArt color="#E08A1E" name="Mango" className="w-40 -rotate-6 sm:w-52" />
          <JarArt color="#C8231B" name="Lal Mirch" className="z-10 -ml-10 w-44 rotate-3 sm:w-56" />
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
          <h2 className="text-4xl font-black text-ink">Ek simple si soch se shuruaat</h2>
          <p>
            Acharika ka idea isi baat se aaya ki bazaar ke achaar mein wo baat nahi hoti jo ghar ke bane achaar mein hoti hai. Wahi khatas, wahi masalon ki
            khushboo aur wahi tel mein ghula hua swaad.
          </p>
          <p>
            Isliye humne ghar ki rasoi mein achaar banana shuru kiya: aam, nimbu, hari aur laal mirch, mixed veg. Har variety ko utne hi pyaar aur dhyaan se
            tayyar kiya jaata hai jitna apne parivaar ke liye.
          </p>
          <p>Aaj hum yahi homemade achaar aap tak pahunchate hain, taaki aap bhi har meal mein apna favourite chatpata swaad enjoy kar sakein.</p>
        </div>
      </div>
      <section className="container-page">
        <div className="grid gap-4 md:grid-cols-3">
          {values.map((v, i) => (
            <div key={v.t} className={`rounded-[2rem] p-8 ${['bg-achaar text-cream', 'bg-haldi text-ink', 'bg-cream-dark text-ink'][i]}`}>
              <h3 className={`text-2xl font-black ${i === 0 ? 'text-cream' : ''}`}>{v.t}</h3>
              <p className="mt-2 opacity-80">{v.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link to="/shop" className="btn-primary px-8">Shop All Achaar</Link>
          <Link to="/our-process" className="btn-secondary px-8">Dekhiye kaise banta hai</Link>
        </div>
      </section>
    </>
  );
}

export function Process() {
  usePageMeta('Our Process: Homemade Achaar Kaise Banta Hai', 'Rasoi se jar tak: Acharika ka homemade achaar kaise chuna, masaledaar banaya, seal aur pack kiya jaata hai.', { jsonLd: breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Our Process', path: '/our-process' }]) });
  // Generic, honest steps. Edit them to describe your exact kitchen process (and add real kitchen photos).
  const steps = [
    { t: 'Chuni hui sabzi aur phal', d: 'Har batch ke liye kachche aam, nimbu, mirchi aur sabziyan chuni, dhoyi aur achhi tarah sukhaayi jaati hain, kyunki achaar mein nami dushman hai.', img: '/images/mango-tree.webp', alt: 'Raw mangoes on a tree' },
    { t: 'Masale aur tel', d: 'Rai, saunf, methi, kalonji, haldi aur laal mirch: har recipe ke hisaab se sahi maatra mein, tel ke saath milaaye jaate hain.', img: '/images/mustard-seeds.webp', alt: 'Mustard seeds spilling from a spoon' },
    { t: 'Sabr se tayyar', d: 'Achaar ko apna swaad pakadne ka poora waqt diya jaata hai. Jaldbaazi nahi, isliye swaad gehra aata hai.', img: '/images/chillies-green.webp', alt: 'Fresh green chillies' },
    { t: 'Saaf-safai', d: 'Saaf bartan, sookhe haath aur sookha chammach. Ghar ki rasoi ke wahi niyam jo achaar ko lamba chalaate hain.', img: '/images/lemons.webp', alt: 'Fresh lemons' },
    { t: 'Seal, label & pack', d: 'Saaf jar mein bharkar seal kiya jaata hai. Har pack par batch, best-before aur ingredients ki jaankari hoti hai, phir dhyaan se pack karke dispatch.', img: '/images/chillies-board.webp', alt: 'Red chillies on a board' },
  ];
  return (
    <>
      <PageHero
        eyebrow="Our process"
        title={<>Rasoi se <span className="text-achaar italic">jar</span> tak.</>}
        sub="Ek jar aap tak pahunchne se pehle in steps se guzarta hai. Simple, ghar jaisa aur dhyaan se."
        img="/images/spices-hero.webp"
        alt="Bowls of turmeric, chilli and other spices"
        hindi="विधि"
      />
      <div className="container-page py-16">
        <ol className="space-y-6">
          {steps.map((s, i) => (
            <li key={s.t} className={`grid items-center gap-6 overflow-hidden rounded-[2rem] border border-cream-dark bg-paper md:grid-cols-2 ${i % 2 ? 'md:[&>div:first-child]:order-2' : ''}`}>
              <div className="aspect-[16/10] overflow-hidden md:aspect-auto md:h-full">
                <img src={s.img} alt={s.alt} loading="lazy" className="size-full object-cover" />
              </div>
              <div className="p-8 md:p-10">
                <span className="font-display text-6xl font-black text-haldi">0{i + 1}</span>
                <h2 className="mt-2 text-3xl font-black">{s.t}</h2>
                <p className="mt-3 text-lg text-ink-soft">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

/** Plain-text answers (also used for FAQPage structured data) plus an optional helpful link. */
export const FAQS: { q: string; a: string; link?: { to: string; label: string } }[] = [
  { q: 'Kya aapka achaar sach mein homemade hai?', a: 'Haan. Hamara achaar ghar ki rasoi mein, ghar jaise tareeke se banaya jaata hai.' },
  { q: 'Kaun-kaun se achaar available hain?', a: 'Aam, nimbu, hari mirch, bharwa laal mirch, lehsun, adrak, mixed veg, meetha aam chunda aur combo packs. Current stock Shop page par dekhein.', link: { to: '/shop', label: 'Shop All Achaar' } },
  { q: 'Kaun se pack sizes milte hain?', a: 'Har product page par available pack sizes (jaise 200 g, 250 g, 500 g) aur net quantity likhi hai.' },
  { q: 'Delivery kitne din mein hogi?', a: 'Delivery aapke PIN code, order processing aur courier par depend karti hai. Estimate product page aur checkout par PIN code daalne par milta hai.' },
  { q: 'Kya aap meri jagah deliver karte hain?', a: 'Kisi bhi product page par "Check delivery" mein apna 6-digit PIN code daalkar turant check karein.' },
  { q: 'Payment kaise kar sakte hain?', a: 'Checkout par jo options available hon: online payment (UPI, cards, net banking) aur/ya Cash on Delivery.' },
  { q: 'Kya order karne ke liye account banana zaroori hai?', a: 'Nahi. Aap guest checkout se seedha order kar sakte hain. Sirf naam, mobile number aur address chahiye.' },
  { q: 'Order track kaise karein?', a: 'Order confirmation page ka tracking link use karein, ya Track Order page par order ID aur mobile number daalein.', link: { to: '/track-order', label: 'Track Order' } },
  { q: 'Order cancel kaise karein?', a: 'Order dispatch hone se pehle support se contact karein. Poori jaankari Cancellation & Refund Policy mein hai.', link: { to: '/policies/returns', label: 'Refund Policy' } },
  { q: 'Achaar kholne ke baad kaise store karein?', a: 'Label par di gayi storage instructions follow karein. Hamesha saaf aur sookha chammach use karein aur dhakkan achhi tarah band rakhein.' },
  { q: 'Ingredients aur allergens kahan dekhein?', a: 'Har product page ke "Ingredients & allergens" section mein aur jar ke label par. Kai achaar mein sarson (mustard) hoti hai.' },
  { q: 'Damaged ya leaking package aaye to kya karein?', a: 'Package aur label ki photos ke saath policy ke time window mein support ko contact karein. Hum verify karke replacement ya refund karenge.', link: { to: '/contact', label: 'Contact support' } },
  { q: 'Bulk ya gifting order kar sakte hain?', a: 'Haan. Shaadi, tyohaar ya corporate gifting ke liye Contact page ya WhatsApp par humse baat karein.', link: { to: '/contact', label: 'Contact us' } },
];

export const faqLd = (items: typeof FAQS) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export function FaqList({ items }: { items: typeof FAQS }) {
  return (
    <div className="divide-y divide-cream-dark rounded-3xl border border-cream-dark bg-paper">
      {items.map((f) => (
        <details key={f.q} className="group p-5 sm:p-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold">
            <h3 className="font-sans text-lg font-bold">{f.q}</h3>
            <span className="text-2xl text-achaar transition group-open:rotate-45" aria-hidden>+</span>
          </summary>
          <p className="mt-2 text-ink-soft">
            {f.a}{' '}
            {f.link && (
              <Link to={f.link.to} className="font-semibold text-achaar underline">
                {f.link.label}
              </Link>
            )}
          </p>
        </details>
      ))}
    </div>
  );
}

export function Faqs() {
  usePageMeta('FAQs: Achaar Order, Delivery aur Storage', 'Homemade achaar order, delivery, payment, COD, storage, allergens aur returns ke baare mein aksar puche jaane wale sawaal aur jawab.', {
    jsonLd: [faqLd(FAQS), breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'FAQs', path: '/faqs' }])],
  });
  return (
    <div className="container-page max-w-3xl py-12">
      <p className="eyebrow"><span className="h-0.5 w-6 rounded bg-saffron" aria-hidden />FAQs</p>
      <h1 className="mt-2 text-4xl font-black sm:text-5xl">Aksar puche jaane wale sawaal</h1>
      <div className="mt-8">
        <FaqList items={FAQS} />
      </div>
      <p className="mt-8 text-center text-ink-soft">
        Aur sawaal? <Link to="/contact" className="font-semibold text-achaar underline">Humse baat karein</Link>.
      </p>
    </div>
  );
}

export function NotFound() {
  usePageMeta('Page not found', undefined, { noindex: true });
  return (
    <div className="container-page py-10">
      <EmptyState title="Ye page nahi mila" body="Link galat ho sakta hai ya page hata diya gaya hai." action={<Link to="/" className="btn-primary">Go to Home</Link>} />
    </div>
  );
}
