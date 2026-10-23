import { useEffect, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '../lib/useFetch';
import { api } from '../lib/api';
import { rupees, usePageMeta } from '../lib/format';
import { absUrl, breadcrumbLd, DEFAULT_IMAGE, SITE_NAME, SITE_URL } from '../lib/seo';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { ProductImage } from '../components/JarArt';
import { ProductGrid } from '../components/ProductCard';
import { Breadcrumbs, EmptyState, PageLoader, QuantityStepper, SpiceBadge } from '../components/ui';

/** schema.org Product with offers per pack size. No ratings are included until there are genuine reviews. */
function productLd(p: Product) {
  const url = absUrl(`/products/${p.slug}`);
  const offers = p.variants.map((v) => ({
    '@type': 'Offer',
    name: `${p.name} ${v.label}`,
    price: v.price,
    priceCurrency: 'INR',
    availability: v.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    itemCondition: 'https://schema.org/NewCondition',
    url,
    seller: { '@id': `${SITE_URL}/#organization` },
  }));
  return {
    '@type': 'Product',
    name: p.name,
    description: p.description || p.shortDescription,
    image: (p.images.length ? p.images.map((i) => i.url) : [DEFAULT_IMAGE]).map(absUrl),
    brand: { '@type': 'Brand', name: SITE_NAME },
    category: p.category ? `Food > Pickles > ${p.category.name}` : 'Food > Pickles',
    url,
    offers: offers.length === 1 ? offers[0] : { '@type': 'AggregateOffer', priceCurrency: 'INR', lowPrice: Math.min(...p.variants.map((v) => v.price)), highPrice: Math.max(...p.variants.map((v) => v.price)), offerCount: offers.length, offers },
  };
}

function PincodeCheck() {
  const [pin, setPin] = useState('');
  const [result, setResult] = useState<null | { ok: boolean; msg: string }>(null);
  const [loading, setLoading] = useState(false);
  const check = async () => {
    if (!/^[1-9]\d{5}$/.test(pin)) return setResult({ ok: false, msg: 'Enter a valid 6-digit PIN code.' });
    setLoading(true);
    try {
      const r = await api<{ serviceable: boolean; deliveryEstimate?: string }>(`/pincode/${pin}`);
      setResult(r.serviceable ? { ok: true, msg: r.deliveryEstimate || 'We deliver to this PIN code.' } : { ok: false, msg: 'Sorry, we do not deliver to this PIN code yet.' });
    } catch (e) {
      setResult({ ok: false, msg: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="rounded-xl bg-cream-dark/60 p-4">
      <label htmlFor="pin" className="label">Check delivery</label>
      <div className="flex gap-2">
        <input id="pin" inputMode="numeric" maxLength={6} className="input" placeholder="Enter PIN code" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} onKeyDown={(e) => e.key === 'Enter' && check()} />
        <button type="button" className="btn-secondary" onClick={check} disabled={loading}>Check</button>
      </div>
      {result && <p className={`mt-2 text-sm ${result.ok ? 'text-leaf' : 'text-red-700'}`}>{result.msg}</p>}
    </div>
  );
}

function Detail({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group border-b border-cream-dark py-4" open={title === 'Description'}>
      <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
        {title}
        <span className="text-achaar transition group-open:rotate-45">+</span>
      </summary>
      <div className="mt-2 text-ink-soft whitespace-pre-line">{children}</div>
    </details>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useFetch<{ product: Product; related: Product[] }>(`/products/${slug}`);
  const { add, lastAdded } = useCart();
  const { settings } = useSettings();
  const [variantId, setVariantId] = useState<string>();
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  const product = data?.product;
  usePageMeta(
    product ? product.seo.title || `${product.name}: Homemade Achaar Online` : '',
    product ? product.seo.description || `${product.shortDescription} ${product.fromPrice ? `Price from ₹${product.fromPrice}.` : ''} Order homemade achaar online from Acharika.`.trim() : undefined,
    product
      ? {
          path: `/products/${product.slug}`,
          type: 'product',
          image: product.images[0]?.url,
          noindex: false,
          jsonLd: [productLd(product), breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Shop', path: '/shop' }, ...(product.category ? [{ name: product.category.name, path: `/shop?category=${product.category.slug}` }] : []), { name: product.name, path: `/products/${product.slug}` }])],
        }
      : { noindex: Boolean(error) },
  );

  useEffect(() => {
    if (product) {
      setVariantId((product.variants.find((v) => v.inStock) || product.variants[0])?._id);
      setQty(1);
      setImgIdx(0);
    }
  }, [product]);

  if (loading) return <PageLoader />;
  if (error || !product)
    return (
      <EmptyState
        title="Product nahi mila"
        body="Ye product ab available nahi hai ya link galat hai."
        action={<Link to="/shop" className="btn-primary">See All Achaar</Link>}
      />
    );

  const variant = product.variants.find((v) => v._id === variantId) || product.variants[0];
  const addLine = () =>
    variant &&
    add(
      {
        productId: product._id,
        variantId: variant._id,
        slug: product.slug,
        name: product.name,
        variantLabel: variant.label,
        price: variant.price,
        accentColor: product.accentColor,
        image: product.images[0]?.url,
        maxQty: variant.maxQty,
      },
      qty,
    );
  const b = settings.business;

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, ...(product.category ? [{ label: product.category.name, to: `/shop?category=${product.category.slug}` }] : []), { label: product.name }]} />

      <div className="mt-6 grid gap-8 md:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <div>
          <div className="card aspect-square overflow-hidden">
            <ProductImage product={product} index={imgIdx} className="size-full" />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button key={img.url} onClick={() => setImgIdx(i)} className={`size-20 shrink-0 overflow-hidden rounded-xl border-2 ${i === imgIdx ? 'border-achaar' : 'border-transparent'}`} aria-label={`Show image ${i + 1}`}>
                  <img src={img.url} alt="" className="size-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
          <p className="mt-2 text-xs text-ink-soft">Images are for representation; the label on the pack is authoritative.</p>
        </div>

        {/* Buy box */}
        <div>
          {product.isBestseller && <span className="rounded-full bg-haldi px-2.5 py-0.5 text-xs font-bold">Bestseller</span>}
          <h1 className="mt-2 text-3xl leading-tight font-bold sm:text-4xl">{product.name}</h1>
          <p className="mt-2 text-lg text-ink-soft">{product.shortDescription}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <SpiceBadge level={product.spiceLevel} />
            {product.tasteNotes.map((t) => (
              <span key={t} className="rounded-full border border-cream-dark bg-white px-2.5 py-0.5 text-xs capitalize">{t}</span>
            ))}
          </div>

          {variant && (
            <>
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-3xl font-bold">{rupees(variant.price)}</span>
                {variant.mrp && (
                  <>
                    <span className="text-lg text-ink-soft line-through">MRP {rupees(variant.mrp)}</span>
                    <span className="font-semibold text-leaf">Save {rupees(variant.mrp - variant.price)}</span>
                  </>
                )}
              </div>
              <p className="text-sm text-ink-soft">Inclusive of all taxes · Net qty: {variant.netQuantity || variant.label}</p>

              {product.variants.length > 1 && (
                <fieldset className="mt-6">
                  <legend className="label">Pack size</legend>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <label key={v._id} className={`cursor-pointer rounded-xl border-2 px-4 py-2 text-center ${v._id === variant._id ? 'border-achaar bg-achaar/5' : 'border-[#d9c8a8] bg-white'} ${!v.inStock ? 'opacity-50' : ''}`}>
                        <input type="radio" name="variant" className="sr-only" checked={v._id === variant._id} onChange={() => { setVariantId(v._id); setQty(1); }} />
                        <span className="block font-semibold">{v.label}</span>
                        <span className="block text-sm">{v.inStock ? rupees(v.price) : 'Out of stock'}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {variant.inStock && <QuantityStepper value={qty} max={variant.maxQty} onChange={(n) => setQty(Math.max(1, Math.min(n, variant.maxQty)))} />}
                <button className="btn-primary flex-1 text-lg sm:flex-none sm:px-10" disabled={!variant.inStock} onClick={addLine}>
                  {!variant.inStock ? 'Out of stock' : lastAdded === variant._id ? 'Added to cart' : 'Add to Cart'}
                </button>
                {variant.inStock && (
                  <button className="btn-secondary w-full sm:w-auto" onClick={() => { addLine(); navigate('/cart'); }}>
                    Buy Now
                  </button>
                )}
              </div>
              {variant.lowStock && <p className="mt-2 text-sm font-semibold text-achaar">Only a few left in stock</p>}
            </>
          )}

          <div className="mt-6">
            <PincodeCheck />
          </div>

          <div className="mt-6">
            <Detail title="Description">
              {product.description}
              {product.servingIdeas && (
                <>
                  {'\n\n'}
                  <strong className="text-ink">Serving ideas:</strong> {product.servingIdeas}
                </>
              )}
            </Detail>
            <Detail title="Ingredients & allergens">
              <strong className="text-ink">Ingredients:</strong> {product.ingredients || 'See pack label.'}
              {product.allergens && (<>{'\n\n'}<strong className="text-ink">Allergen information:</strong> {product.allergens}</>)}
              {product.dietaryNotes && (<>{'\n\n'}<strong className="text-ink">Dietary notes:</strong> {product.dietaryNotes}</>)}
            </Detail>
            <Detail title="Storage & shelf life">
              {product.storageInstructions || 'Follow the storage instructions on the label.'}
              {product.shelfLife && <>{'\n\n'}{product.shelfLife}</>}
            </Detail>
            <Detail title="Delivery & returns">
              {settings.shipping.processingTime} {settings.shipping.deliveryEstimate}
              {'\n\n'}
              Damaged or leaking pack? See our <Link to="/policies/returns" className="text-achaar underline">returns policy</Link>.
            </Detail>
            <Detail title="Manufacturer & legal information">
              Marketed by: {b.name}
              {b.address && <>{'\n'}{b.address}</>}
              {'\n'}FSSAI Lic./Reg. No.: {b.fssaiNumber || 'shown on pack label'}
              {'\n'}Batch/lot number, date of manufacture/packing, best before and MRP are printed on each pack.
              {(b.supportPhone || b.supportEmail) && <>{'\n'}Customer care: {[b.supportPhone, b.supportEmail].filter(Boolean).join(' · ')}</>}
              {'\n'}Country of origin: India
            </Detail>
          </div>
        </div>
      </div>

      {data.related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold sm:text-3xl">Aapko ye bhi pasand aa sakte hain</h2>
          <div className="mt-6">
            <ProductGrid products={data.related.slice(0, 3)} />
          </div>
        </section>
      )}
    </div>
  );
}
