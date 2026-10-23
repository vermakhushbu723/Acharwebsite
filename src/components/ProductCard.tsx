import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { Product } from '../types';
import { rupees } from '../lib/format';
import { useCart } from '../context/CartContext';
import { ProductImage } from './JarArt';
import { SpiceBadge } from './ui';

export function ProductCard({ product }: { product: Product }) {
  const { add, lastAdded } = useCart();
  const firstAvailable = product.variants.find((v) => v.inStock) || product.variants[0];
  const [variantId, setVariantId] = useState(firstAvailable?._id);
  const variant = product.variants.find((v) => v._id === variantId) || firstAvailable;
  const justAdded = variant && lastAdded === variant._id;
  const off = variant?.mrp ? Math.round(((variant.mrp - variant.price) / variant.mrp) * 100) : 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-cream-dark bg-paper transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_-24px_rgba(43,22,17,0.45)]">
      <Link to={`/products/${product.slug}`} className="relative m-2 block aspect-[4/4.2] overflow-hidden rounded-[1.4rem]">
        <ProductImage product={product} className="size-full transition duration-500 group-hover:scale-[1.06]" />
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {product.isBestseller && <span className="sticker -rotate-3">Bestseller</span>}
          {off > 0 && <span className="rounded-full bg-leaf px-2.5 py-1 text-xs font-extrabold text-white">{off}% OFF</span>}
        </div>
        {!product.inStock && (
          <span className="absolute inset-x-3 bottom-3 rounded-full bg-masala/85 py-1.5 text-center text-xs font-bold tracking-wide text-cream uppercase backdrop-blur">Out of stock</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 px-5 pt-2 pb-5">
        <div className="flex items-center justify-between gap-2">
          {product.category && <span className="text-xs font-bold tracking-widest text-saffron uppercase">{product.category.name}</span>}
          <SpiceBadge level={product.spiceLevel} compact />
        </div>
        <h3 className="text-xl leading-snug font-bold">
          <Link to={`/products/${product.slug}`} className="hover:text-achaar">
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-ink-soft">{product.shortDescription}</p>

        {variant && (
          <div className="mt-auto pt-3">
            {product.variants.length > 1 && (
              <div className="mb-3 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Pack size">
                {product.variants.map((v) => (
                  <button
                    key={v._id}
                    type="button"
                    role="radio"
                    aria-checked={v._id === variant._id}
                    onClick={() => setVariantId(v._id)}
                    className={`rounded-full border-2 px-3 py-1 text-xs font-bold transition ${
                      v._id === variant._id ? 'border-ink bg-achaar text-cream' : 'border-cream-dark bg-white hover:border-ink'
                    } ${!v.inStock ? 'line-through opacity-50' : ''}`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-end justify-between gap-2">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl font-black">{rupees(variant.price)}</span>
                  {variant.mrp && <span className="text-sm text-ink-soft line-through">{rupees(variant.mrp)}</span>}
                </div>
                <p className="text-xs text-ink-soft">{variant.netQuantity || variant.label}</p>
              </div>
              <button
                type="button"
                className={`btn min-h-11 px-5 text-sm ${justAdded ? 'bg-leaf text-white' : 'bg-achaar text-white hover:bg-achaar-dark'}`}
                disabled={!variant.inStock}
                aria-label={variant.inStock ? `Add ${product.name} ${variant.label} to cart` : 'Sold out'}
                onClick={() =>
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
                    1,
                  )
                }
              >
                {!variant.inStock ? 'Sold out' : justAdded ? 'Added' : '+ Add'}
              </button>
            </div>
            {variant.lowStock && <p className="mt-2 text-xs font-bold text-achaar">Bas kuch hi jar bache hain</p>}
          </div>
        )}
      </div>
    </article>
  );
}

export function ProductGrid({ products, cols = 3 }: { products: Product[]; cols?: 3 | 4 }) {
  return (
    <div className={`grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 sm:gap-6 ${cols === 4 ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-3'}`}>
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
