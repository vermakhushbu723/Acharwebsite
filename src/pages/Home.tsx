import { Link } from 'react-router-dom';
import { useFetch } from '../lib/useFetch';
import { usePageMeta } from '../lib/format';
import { useSettings } from '../context/SettingsContext';
import type { Category, Product } from '../types';
import { ProductCard, ProductGrid } from '../components/ProductCard';
import { JarArt } from '../components/JarArt';
import { SectionHeading, Spinner } from '../components/ui';
import { categoryArt } from '../lib/categoryArt';
import { organizationLd, websiteLd } from '../lib/seo';
import { FAQS, FaqList } from './ContentPages';

function Hero() {
  const { settings } = useSettings();
  const trust = [
    'Ghar ka bana',
    'Secure checkout',
    ...(settings.cod.enabled ? ['Cash on Delivery'] : []),
    'Dhyaan se packed',
  ];
  return (
    <section className="grain relative overflow-hidden bg-cream">
      {/* decorative Devanagari watermark */}
      <span className="pointer-events-none absolute -top-10 -left-6 font-deva text-[14rem] leading-none text-achaar/[0.06] select-none sm:text-[20rem]" aria-hidden>
        अचार
      </span>
      <div className="absolute top-20 -right-40 size-[34rem] rounded-full bg-haldi/40 blur-3xl" aria-hidden />
      <div className="absolute -bottom-40 left-1/3 size-[26rem] rounded-full bg-saffron/20 blur-3xl" aria-hidden />

      <div className="container-page relative grid items-center gap-12 pt-6 pb-20 md:pt-8 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:pb-28">
        <div className="lg:pt-10">
          <span className="sticker -rotate-2">100% Homemade Achaar</span>
          {/* Always exactly two lines: each line is nowrap and the size scales with the screen width. */}
          <h1 className="mt-6 text-[clamp(2.3rem,11.5vw,4.5rem)] leading-[0.95] font-black lg:text-[4.3rem] xl:text-[5.6rem]">
            <span className="block whitespace-nowrap">Har Bite Mein</span>
            <span className="block whitespace-nowrap">
            Ghar Ka{' '}
            <span className="text-masala relative inline-block italic">
              Swaad
              <svg className="absolute -bottom-2 left-0 w-full text-haldi" viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden>
                <path d="M3 11C40 4 90 2 197 8" stroke="currentColor" strokeWidth="7" strokeLinecap="round" fill="none" />
              </svg>
            </span>
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft sm:text-xl">
            Kachche aam ki khatas, nimbu ki tangy kick aur mirchi ka teekhapan. Ghar ki rasoi mein bana achaar, ab seedha aapki thaali tak.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/shop" className="btn-primary px-8 text-lg">
              Shop All Achaar
            </Link>
            <Link to="/shop?bestseller=1" className="btn-secondary px-8 text-lg">
              Bestsellers
            </Link>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-3 gap-y-2 text-sm font-semibold text-ink">
            {trust.map((t, i) => (
              <li key={t} className="flex items-center gap-3">
                {i > 0 && <span className="size-1.5 rounded-full bg-saffron" aria-hidden />}
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual composition */}
        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[3rem] border-4 border-ink shadow-[12px_12px_0_0_var(--color-achaar)]">
            <img src="/images/spices-hero.webp" alt="Bowls of turmeric, chilli and other spices" width={1000} height={1333} className="size-full object-cover" fetchPriority="high" />
            <div className="absolute inset-0 bg-linear-to-t from-masala/60 via-transparent to-transparent" />
          </div>
          <JarArt color="#E08A1E" name="Mango" className="absolute -bottom-10 -left-8 w-44 animate-float drop-shadow-[0_20px_25px_rgba(43,22,17,0.35)] [--r:-6deg] sm:w-56" />
          <div className="absolute top-8 -right-3 size-28 animate-float overflow-hidden rounded-full border-4 border-cream shadow-xl [--r:8deg] [animation-delay:-2s] sm:-right-8 sm:size-36">
            <img src="/images/chillies-board.webp" alt="" className="size-full object-cover" />
          </div>
          <div className="absolute right-4 -bottom-6 rotate-3 rounded-2xl border-2 border-ink bg-paper px-4 py-3 shadow-[4px_4px_0_0_var(--color-ink)] sm:right-10">
            <p className="font-deva text-lg leading-none text-achaar">चटपटा</p>
            <p className="mt-1 text-xs font-bold text-ink-soft">Khatta · Teekha · Tangy</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Categories({ categories }: { categories: Category[] }) {
  return (
    <section className="container-page pt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Shop by flavour" title="Aaj kis swaad ka mann hai?" />
        <Link to="/shop" className="btn-ghost">
          Sab dekhein
        </Link>
      </div>
      <div className="mt-10 grid auto-rows-[200px] grid-cols-2 gap-4 sm:auto-rows-[240px] md:grid-cols-4">
        {categories.map((c, i) => {
          const art = categoryArt(c.slug);
          const big = i === 0;
          return (
            <Link
              key={c._id}
              to={`/shop?category=${c.slug}`}
              className={`group relative overflow-hidden rounded-[2rem] ${big ? 'col-span-2 md:row-span-2' : ''}`}
            >
              <img src={art.img} alt={art.alt} loading="lazy" className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-110" />
              <div className={`absolute inset-0 bg-linear-to-t ${art.tint} via-black/35 via-45% to-transparent`} />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-5 text-white">
                <div>
                  <p className={`font-deva leading-none text-haldi ${big ? 'text-3xl' : 'text-xl'}`}>{art.hindi}</p>
                  <p className={`mt-1 font-display font-black ${big ? 'text-4xl sm:text-5xl' : 'text-2xl'}`}>{c.name}</p>
                  <p className="text-sm text-white/80">
                    {c.productCount} {c.productCount === 1 ? 'variety' : 'varieties'}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
        {/* Fills the last row of the 4-column grid when it would otherwise have a gap. */}
        {(categories.length + 3) % 4 !== 0 && (
          <Link to="/shop" className="group bg-achaar relative flex flex-col justify-end overflow-hidden rounded-[2rem] p-5 text-cream">
            <p className="font-deva text-xl leading-none text-haldi">सारे अचार</p>
            <p className="mt-1 font-display text-2xl font-black">Shop All Achaar</p>
            <p className="text-sm text-cream/70 transition group-hover:text-haldi">Har flavour dekhein</p>
          </Link>
        )}
      </div>
    </section>
  );
}

function SeoIntro() {
  return (
    <section className="container-page pt-28">
      <div className="grid gap-10 md:grid-cols-[1fr_1.3fr]">
        <div>
          <SectionHeading eyebrow="Homemade achaar online" title="Ghar ka bana achaar, ab online." />
        </div>
        <div className="space-y-4 text-lg leading-relaxed text-ink-soft">
          <p>
            Acharika par aapko milta hai ghar ki rasoi mein bana <strong className="text-ink">homemade achaar</strong>: kachche aam ka khatta-teekha{' '}
            <Link to="/shop?category=mango" className="font-semibold text-achaar underline">aam ka achaar</Link>, tangy{' '}
            <Link to="/shop?category=lemon" className="font-semibold text-achaar underline">nimbu ka achaar</Link>, teekha{' '}
            <Link to="/shop?category=chilli" className="font-semibold text-achaar underline">mirchi ka achaar</Link>, khushbudaar{' '}
            <Link to="/shop?category=garlic" className="font-semibold text-achaar underline">lehsun ka achaar</Link>, zesty{' '}
            <Link to="/shop?category=ginger" className="font-semibold text-achaar underline">adrak ka achaar</Link> aur khatta-meetha{' '}
            <Link to="/shop?category=sweet-achaar" className="font-semibold text-achaar underline">aam ka chunda</Link>.
          </p>
          <p>
            Har product page par ingredients, allergens, net quantity aur storage ki poori jaankari di gayi hai, taaki aap soch-samajh kar chun sakein. Order karna aasaan
            hai: bina account ke guest checkout, PIN code se delivery check, aur order ke baad tracking link.
          </p>
          <p>
            Ghar ke liye roz ka achaar chahiye ya tyohaar par kisi apne ko gift karna ho,{' '}
            <Link to="/shop?category=combo-packs" className="font-semibold text-achaar underline">achaar combo packs</Link> ek desi aur swaadisht tohfa hain.
          </p>
        </div>
      </div>
    </section>
  );
}

function HomeFaq() {
  const items = FAQS.slice(0, 6);
  return (
    <section className="container-page pt-28">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <SectionHeading eyebrow="FAQs" title="Aapke sawaal, hamare jawab." sub="Order, delivery, payment aur storage se jude aam sawaal." />
          <Link to="/faqs" className="btn-secondary mt-8">
            Saare FAQs dekhein
          </Link>
        </div>
        <FaqList items={items} />
      </div>
    </section>
  );
}

const PAIRINGS = [
  ['Aloo Paratha', 'Aam ka Achaar'],
  ['Dal-Chawal', 'Nimbu ka Achaar'],
  ['Khichdi', 'Hari Mirch'],
  ['Puri-Sabzi', 'Bharwa Lal Mirch'],
  ['Curd Rice', 'Nimbu ka Achaar'],
  ['Roti-Sabzi', 'Mixed Veg'],
];

function MealSaathi() {
  return (
    <section className="container-page pt-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <div className="overflow-hidden rounded-[2.5rem] border-4 border-ink shadow-[-12px_12px_0_0_var(--color-haldi)]">
            <img src="/images/thali.webp" alt="A vegetarian thali with rice, roti, dal and a katori of achaar" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </div>
          <span className="sticker absolute -top-4 right-6 rotate-6 bg-saffron text-white">Thaali complete</span>
        </div>
        <div>
          <SectionHeading eyebrow="Har meal ka saathi" title="Ek chammach, aur khaana ban jaaye khaas." sub="Achaar sirf side dish nahi, ghar ke khaane ki yaad hai. Dekhiye kaunsa achaar kis dish ke saath sabse mazedaar lagta hai:" />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {PAIRINGS.map(([dish, achaar]) => (
              <li key={dish + achaar} className="flex items-center gap-3 rounded-2xl border border-cream-dark bg-paper px-4 py-3">
                <span className="text-sm">
                  <strong className="block text-ink">{dish}</strong>
                  <span className="text-ink-soft">+ {achaar}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const tiles = [
    { t: 'Ghar ki rasoi mein bana', d: 'Factory nahi, ghar jaisa tareeka. Har jar mein homemade swaad.', cls: 'bg-achaar text-cream md:col-span-2', h: 'text-cream' },
    { t: 'Saaf-saaf ingredients', d: 'Har product page par poori ingredients aur allergen jaankari.', cls: 'bg-haldi text-ink', h: '' },
    { t: 'Dhyaan se packed', d: 'Achhi sealing aur protective packing, taaki jar safe pahunche.', cls: 'bg-paper text-ink border border-cream-dark', h: '' },
    { t: 'Aasaan ordering', d: 'Bina account ke checkout, order tracking aur WhatsApp support.', cls: 'bg-cream-dark text-ink md:col-span-2', h: '' },
  ];
  return (
    <section className="container-page pt-28">
      <SectionHeading center eyebrow="Why Acharika" title="Swaad bhi, bharosa bhi." sub="Hum wahi promise karte hain jo nibha sakte hain." />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {tiles.map((x) => (
          <div key={x.t} className={`relative overflow-hidden rounded-[2rem] p-8 ${x.cls}`}>
            <h3 className={`text-2xl font-black ${x.h}`}>{x.t}</h3>
            <p className="mt-2 max-w-md opacity-80">{x.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Process() {
  // Generic steps. Edit these to match your exact kitchen process.
  const steps = [
    { n: '01', t: 'Chuni hui sabzi aur phal', d: 'Har batch ke liye achhe kachche aam, nimbu aur mirchi chune jaate hain.', img: '/images/mango-tree.webp', alt: 'Raw mangoes on a tree' },
    { n: '02', t: 'Masale aur tel', d: 'Rai, saunf, methi, haldi aur laal mirch, recipe ke hisaab se sahi maatra mein.', img: '/images/mustard-seeds.webp', alt: 'Mustard seeds in a spoon' },
    { n: '03', t: 'Sabr se tayyar', d: 'Achaar ko apna swaad pakadne ka poora waqt diya jaata hai.', img: '/images/chillies-green.webp', alt: 'Fresh green chillies at a market' },
    { n: '04', t: 'Seal & pack', d: 'Saaf, sookhe jar mein bhar ke seal aur label kiya jaata hai.', img: '/images/lemons.webp', alt: 'Fresh lemons' },
  ];
  return (
    <section className="container-page pt-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Kaise banta hai" title="Rasoi se jar tak" />
        <Link to="/our-process" className="btn-ghost">
          Poora process
        </Link>
      </div>
      <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <li key={s.n} className="group overflow-hidden rounded-[2rem] border border-cream-dark bg-paper">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={s.img} alt={s.alt} loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-110" />
              <span className="absolute top-3 left-3 rounded-full bg-cream px-3 py-1 font-display text-lg font-black text-achaar">{s.n}</span>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold">{s.t}</h3>
              <p className="mt-1 text-sm text-ink-soft">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function HowToOrder() {
  const steps = [
    ['Achaar chuniye', 'Apna favourite flavour aur pack size.'],
    ['Cart mein daaliye', 'Quantity select karke checkout.'],
    ['Address & payment', 'Bina account ke, seedha order.'],
    ['Ghar par delivery', 'Tracking link ke saath updates.'],
  ];
  return (
    <section className="container-page pt-28">
      <div className="rounded-[2.5rem] bg-cream-dark/60 p-8 sm:p-12">
        <SectionHeading center eyebrow="How to order" title="4 steps, aur achaar ghar par." />
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([t, d], i) => (
            <li key={t} className="relative text-center">
              <div className="mx-auto flex size-20 items-center justify-center rounded-full border-2 border-ink bg-paper text-4xl font-display font-black text-achaar shadow-[4px_4px_0_0_var(--color-ink)]">{i + 1}</div>
              <h3 className="mt-1 text-xl font-bold">{t}</h3>
              <p className="mt-1 text-sm text-ink-soft">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function WhatsAppCta() {
  const { settings } = useSettings();
  const wa = settings.business.whatsapp;
  return (
    <section className="container-page pt-24">
      <div className="grain relative overflow-hidden rounded-[2.5rem] bg-haldi px-8 py-12 sm:px-14">
        <span className="pointer-events-none absolute -right-6 -bottom-16 font-deva text-[12rem] leading-none text-achaar/10 select-none" aria-hidden>
          स्वाद
        </span>
        <div className="relative grid items-center gap-6 md:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="text-4xl font-black sm:text-5xl">Bulk ya gifting order?</h2>
            <p className="mt-3 max-w-xl text-lg text-ink/80">Shaadi, tyohaar ya corporate gifting ke liye custom combos. Humse seedha baat karein, hum aapki zaroorat ke hisaab se plan karenge.</p>
          </div>
          <div className="flex md:justify-end">
            {wa ? (
              <a href={`https://wa.me/${wa}?text=${encodeURIComponent('Namaste Acharika! Mujhe bulk/gifting order ke baare mein jaankari chahiye.')}`} target="_blank" rel="noopener noreferrer" className="btn bg-achaar px-7 text-lg text-cream hover:bg-achaar-dark">
                WhatsApp karein
              </a>
            ) : (
              <Link to="/contact" className="btn bg-achaar px-7 text-lg text-cream hover:bg-achaar-dark">
                Humse baat karein
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { settings } = useSettings();
  usePageMeta('', undefined, { path: '/', jsonLd: [organizationLd(settings.business), websiteLd()] });
  const categories = useFetch<Category[]>('/categories');
  const bestsellers = useFetch<{ items: Product[] }>('/products?bestseller=1&limit=8');
  const combos = useFetch<{ items: Product[] }>('/products?category=combo-packs&limit=2');

  return (
    <>
      <Hero />

      {categories.data && categories.data.length > 0 && <Categories categories={categories.data} />}

      <section className="container-page pt-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Bestsellers" title="Sabse zyada pasand kiye gaye" sub="Customers ke favourite flavours. Apna next jar yahin se chuniye." />
          <Link to="/shop" className="btn-secondary">
            View all achaar
          </Link>
        </div>
        <div className="mt-10">
          {bestsellers.loading ? (
            <div className="flex justify-center py-16 text-achaar"><Spinner className="size-8" /></div>
          ) : bestsellers.data?.items.length ? (
            <ProductGrid products={bestsellers.data.items} />
          ) : (
            <p className="text-ink-soft">Products jaldi hi yahan dikhenge.</p>
          )}
        </div>
      </section>

      <MealSaathi />
      <WhyUs />

      {combos.data && combos.data.items.length > 0 && (
        <section className="pt-28">
          <div className="grain relative overflow-hidden bg-masala py-20 text-cream">
            <span className="pointer-events-none absolute top-6 -left-4 font-deva text-[10rem] leading-none text-cream/[0.04] select-none" aria-hidden>
              परिवार
            </span>
            <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1fr_1.4fr]">
              <div>
                <p className="eyebrow text-haldi"><span className="h-0.5 w-6 rounded bg-haldi" aria-hidden />Combo & Family Packs</p>
                <h2 className="mt-2 text-5xl leading-[1.02] font-black text-cream sm:text-6xl">
                  Ek order, <span className="text-haldi italic">kai swaad.</span>
                </h2>
                <p className="mt-4 max-w-md text-lg text-cream/75">Poore parivaar ke liye ya kisi apne ko gift karne ke liye. Combos mein milta hai variety ka maza aur behtar value.</p>
                <Link to="/shop?category=combo-packs" className="btn-haldi mt-8 px-8">
                  Shop Combos
                </Link>
              </div>
              <div className="text-ink">
                <div className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-2 lg:mx-0">{combos.data.items.map((p) => <ProductCard key={p._id} product={p} />)}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Process />
      <HowToOrder />

      {/* Story teaser */}
      <section className="container-page pt-28">
        <div className="grid items-center gap-10 overflow-hidden rounded-[2.5rem] border border-cream-dark bg-paper p-8 sm:p-12 md:grid-cols-[1.3fr_1fr]">
          <div>
            <SectionHeading eyebrow="Hamari kahani" title="Achaar ka swaad, apnapan ke saath." />
            <p className="mt-4 text-lg text-ink-soft">
              Acharika ka idea ek simple baat se aaya: achaar sirf side dish nahi, ghar ke khaane ki yaad hota hai. Isi yaad ko har jar mein bharkar hum aap tak pahunchana chahte hain.
            </p>
            <Link to="/about" className="btn-primary mt-8">
              Hamari kahani padhein
            </Link>
          </div>
          <div className="relative mx-auto flex items-end justify-center gap-0" aria-hidden>
            <JarArt color="#D4A72C" name="Nimbu" className="w-32 -rotate-6 sm:w-40" />
            <JarArt color="#C8231B" name="Lal Mirch" className="z-10 -mx-6 w-40 sm:w-48" />
            <JarArt color="#3F7D3A" name="Hari Mirch" className="w-32 rotate-6 sm:w-40" />
          </div>
        </div>
      </section>

      <SeoIntro />
      <HomeFaq />
      <WhatsAppCta />
    </>
  );
}
