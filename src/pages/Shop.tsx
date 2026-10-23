import { Link, useSearchParams } from 'react-router-dom';
import { useFetch } from '../lib/useFetch';
import { usePageMeta } from '../lib/format';
import { absUrl, breadcrumbLd } from '../lib/seo';
import { categoryArt } from '../lib/categoryArt';
import type { Category, Product } from '../types';
import { ProductGrid } from '../components/ProductCard';
import { Breadcrumbs, EmptyState, ErrorBlock, PageLoader } from '../components/ui';

const SORTS = [
  { v: 'popular', l: 'Popular' },
  { v: 'price_asc', l: 'Price: Low to High' },
  { v: 'price_desc', l: 'Price: High to Low' },
  { v: 'newest', l: 'Newest' },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const q = params.get('q') || '';
  const spice = params.get('spice') || '';
  const bestseller = params.get('bestseller') || '';
  const sort = params.get('sort') || 'popular';
  const page = Number(params.get('page') || 1);

  const categories = useFetch<Category[]>('/categories');
  const query = new URLSearchParams({ sort, page: String(page), limit: '12' });
  if (category) query.set('category', category);
  if (q) query.set('q', q);
  if (spice) query.set('spice', spice);
  if (bestseller) query.set('bestseller', '1');
  const products = useFetch<{ items: Product[]; total: number; page: number; pages: number }>(`/products?${query}`);

  const activeCat = categories.data?.find((c) => c.slug === category);
  const art = category ? categoryArt(category) : null;
  const title = q ? `Search: “${q}”` : activeCat ? `${activeCat.name} Achaar` : bestseller ? 'Bestsellers' : 'Shop All Achaar';

  const canonicalPath = category ? `/shop?category=${encodeURIComponent(category)}` : bestseller ? '/shop?bestseller=1' : '/shop';
  const seoTitle = q
    ? `Search results for “${q}”`
    : art?.seoTitle || (activeCat ? `${activeCat.name} Achaar Online` : bestseller ? 'Bestseller Achaar: Customer Favourites' : 'Buy Homemade Achaar Online: All Pickles');
  const seoDescription =
    activeCat?.description ||
    (bestseller
      ? 'Acharika ke sabse pasandida homemade achaar: aam, nimbu, mirchi aur meetha chunda. Abhi order karein.'
      : 'Homemade achaar online kharidein: aam, nimbu, hari mirch, laal mirch, lehsun, adrak, mixed veg, meetha achaar aur combo packs. Guest checkout aur COD.');
  usePageMeta(seoTitle, seoDescription, {
    path: canonicalPath,
    // Search and filtered/sorted/paginated variants are not separate pages for Google.
    noindex: Boolean(q || spice || page > 1 || params.get('sort')),
    image: art?.img,
    jsonLd: [
      breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Shop', path: '/shop' }, ...(activeCat ? [{ name: activeCat.name, path: canonicalPath }] : [])]),
      ...(products.data?.items.length
        ? [
            {
              '@type': 'ItemList',
              name: title,
              itemListElement: products.data.items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: absUrl(`/products/${p.slug}`), name: p.name })),
            },
          ]
        : []),
    ],
  });

  const update = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) (v ? next.set(k, v) : next.delete(k));
    if (!('page' in patch)) next.delete('page');
    setParams(next);
  };

  const chip = (active: boolean) =>
    `shrink-0 rounded-full border-2 px-4 py-2 text-sm font-bold transition ${active ? 'border-ink bg-achaar text-cream' : 'border-cream-dark bg-paper hover:border-ink'}`;

  const banner = art?.img || '/images/spices-hero.webp';

  return (
    <div className="container-page py-8">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-masala text-cream">
        <img src={banner} alt="" className="absolute inset-0 size-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-linear-to-r from-masala via-masala/70 to-transparent" />
        <div className="relative px-6 py-10 sm:px-12 sm:py-14">
          <div className="[&_a]:text-cream/80 [&_a:hover]:text-haldi [&_nav]:text-cream/70 [&_span[aria-current]]:text-haldi">
            <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: q ? 'Search' : 'Shop', to: q || activeCat ? '/shop' : undefined }, ...(activeCat ? [{ label: activeCat.name }] : [])]} />
          </div>
          <h1 className="mt-4 text-4xl font-black text-cream sm:text-6xl">{title}</h1>
          <p className="mt-3 max-w-lg text-lg text-cream/80">
            {q ? (products.data ? `${products.data.total} result${products.data.total === 1 ? '' : 's'} mile` : ' ') : activeCat?.description || 'Apne meal ke saath perfect chatpata companion chuniye.'}
          </p>
        </div>
      </div>

      {/* Category chips: horizontal scroll on mobile */}
      <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        <button className={chip(!category && !bestseller)} onClick={() => update({ category: '', bestseller: '' })}>
          All
        </button>
        <button className={chip(Boolean(bestseller))} onClick={() => update({ bestseller: bestseller ? '' : '1', category: '' })}>
          Bestsellers
        </button>
        {categories.data?.map((c) => (
          <button key={c._id} className={chip(c.slug === category)} onClick={() => update({ category: c.slug, bestseller: '' })}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-cream-dark bg-paper px-4 py-3">
        <label className="flex items-center gap-2 text-sm">
          <span className="font-semibold">Spice</span>
          <select className="input w-auto py-1.5" value={spice} onChange={(e) => update({ spice: e.target.value })}>
            <option value="">Any</option>
            <option value="mild">Mild</option>
            <option value="medium">Medium</option>
            <option value="hot">Extra teekha</option>
          </select>
        </label>
        <label className="ml-auto flex items-center gap-2 text-sm">
          <span className="font-semibold">Sort</span>
          <select className="input w-auto py-1.5" value={sort} onChange={(e) => update({ sort: e.target.value })}>
            {SORTS.map((s) => (
              <option key={s.v} value={s.v}>
                {s.l}
              </option>
            ))}
          </select>
        </label>
        {q && (
          <button className="btn-ghost min-h-0 py-1.5 text-sm" onClick={() => update({ q: '' })}>
            Clear search
          </button>
        )}
      </div>

      <div className="mt-6">
        {products.loading ? (
          <PageLoader />
        ) : products.error ? (
          <ErrorBlock message={products.error.message} retry={() => window.location.reload()} />
        ) : !products.data?.items.length ? (
          <EmptyState
            title={q ? 'Koi matching achaar nahi mila.' : 'Abhi products available nahi hain.'}
            body={q ? 'Spelling check karein ya All Achaar dekhein.' : 'Is category mein abhi products available nahi hain. All Achaar explore karein.'}
            action={
              <Link to="/shop" className="btn-primary">
                See All Achaar
              </Link>
            }
          />
        ) : (
          <>
            <ProductGrid products={products.data.items} />
            {products.data.pages > 1 && (
              <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
                <button className="btn-secondary min-h-10 px-4" disabled={page <= 1} onClick={() => update({ page: String(page - 1) })}>
                  Prev
                </button>
                <span className="px-3 text-sm">
                  Page {page} of {products.data.pages}
                </span>
                <button className="btn-secondary min-h-10 px-4" disabled={page >= products.data.pages} onClick={() => update({ page: String(page + 1) })}>
                  Next
                </button>
              </nav>
            )}
          </>
        )}
      </div>

      {art?.about && activeCat && !q && (
        <section className="mt-16 grid gap-6 rounded-[2rem] border border-cream-dark bg-paper p-8 md:grid-cols-[1fr_2fr] md:p-10">
          <div>
            <p className="font-deva text-3xl text-saffron">{art.hindi}</p>
            <h2 className="mt-1 text-3xl font-black">{activeCat.name} achaar ke baare mein</h2>
          </div>
          <div className="space-y-3 text-lg text-ink-soft">
            <p>{art.about}</p>
            <p>
              Acharika ka har achaar ghar ki rasoi mein banta hai. Ingredients, allergens aur storage ki poori jaankari har product page par di gayi hai. Delivery check karne ke liye product page par apna PIN code daalein.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
