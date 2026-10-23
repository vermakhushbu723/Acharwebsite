import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useFetch } from '../lib/useFetch';
import { categoryArt } from '../lib/categoryArt';
import type { Category } from '../types';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { CartIcon, CloseIcon, MenuIcon, SearchIcon } from './Icons';

const NAV: { to: string; label: string; mega?: boolean }[] = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop', mega: true },
  { to: '/shop?category=combo-packs', label: 'Combos' },
  { to: '/about', label: 'Our Story' },
  { to: '/track-order', label: 'Track Order' },
  { to: '/contact', label: 'Contact' },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="Acharika home">
      <svg viewBox="0 0 64 64" className={`size-10 rounded-[11px] transition group-hover:-rotate-6 ${light ? 'bg-haldi' : 'bg-achaar'}`} aria-hidden>
        <path d="M20 14h24l-2 6H22z" fill={light ? '#2E0D0A' : '#FFB627'} />
        <path d="M18 22c0-1 1-2 2-2h24c1 0 2 1 2 2v28c0 3-2 5-5 5H23c-3 0-5-2-5-5z" fill="#FFF6EA" />
        <path d="M32 30c5 0 8 3 8 7s-4 9-8 9-8-5-8-9 3-7 8-7z" fill="#F26B1D" />
        <path d="M32 30c1-3 3-5 6-5-1 3-3 4-6 5z" fill="#3F7D3A" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.65rem] font-black tracking-tight ${light ? 'text-cream' : 'text-masala'}`}>Acharika</span>
        <span className={`font-deva text-[0.7rem] ${light ? 'text-haldi' : 'text-saffron'}`}>घर का स्वाद</span>
      </span>
    </Link>
  );
}

function SearchBox({ onDone, autoFocus }: { onDone?: () => void; autoFocus?: boolean }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/shop?q=${encodeURIComponent(term)}` : '/shop');
    onDone?.();
  };
  return (
    <form onSubmit={submit} role="search" className="relative w-full">
      <label htmlFor="site-search" className="sr-only">
        Search achaar
      </label>
      <input
        id="site-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Aam, nimbu, mirchi…"
        className="input rounded-full border-transparent bg-cream-dark/70 py-2.5 pr-12 focus:bg-white"
        autoFocus={autoFocus}
      />
      <button type="submit" className="absolute top-1/2 right-1.5 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-achaar text-white" aria-label="Search">
        <SearchIcon className="size-4" />
      </button>
    </form>
  );
}

function Header() {
  const { count } = useCart();
  const { settings } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const categories = useFetch<Category[]>('/categories');
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const openMega = () => {
    window.clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMegaSoon = () => {
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 180);
  };

  useEffect(() => {
    setMegaOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMegaOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [megaOpen]);

  const isActive = (to: string) => {
    const [path, qs] = to.split('?');
    if (path === '/') return location.pathname === '/';
    if (qs) return location.pathname === path && location.search.includes(qs);
    return location.pathname === path && !location.search.includes('category=combo');
  };
  const pill = (active: boolean) => `rounded-full px-4 py-2 text-[0.95rem] font-semibold transition ${active ? 'bg-achaar text-cream' : 'hover:bg-achaar hover:text-cream'}`;

  return (
    <header className={`sticky top-0 z-40 transition-shadow ${scrolled ? 'shadow-[0_10px_30px_-20px_rgba(43,22,17,0.45)]' : ''}`}>
      {settings.announcement && (
        <div className="bg-masala px-4 py-2 text-center text-xs font-semibold tracking-wide text-haldi sm:text-sm">
          {settings.announcement}
        </div>
      )}
      <div className="border-b border-cream-dark bg-cream/90 backdrop-blur-md">
        <div className="container-page flex h-[72px] items-center gap-3">
          <button className="-ml-2 flex size-11 items-center justify-center rounded-full hover:bg-achaar hover:text-cream lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <MenuIcon className="size-6" />
          </button>
          <Logo />
          <nav className="ml-6 hidden items-center gap-0.5 lg:flex" aria-label="Main">
            {NAV.map((n) =>
              n.mega ? (
                <div key={n.to} onMouseEnter={openMega} onMouseLeave={closeMegaSoon}>
                  <button
                    type="button"
                    className={`${pill(isActive(n.to) || megaOpen)} inline-flex items-center gap-1`}
                    aria-expanded={megaOpen}
                    aria-controls="shop-menu"
                    onClick={() => setMegaOpen((o) => !o)}
                  >
                    {n.label}
                    <svg viewBox="0 0 20 20" className={`size-4 transition ${megaOpen ? 'rotate-180' : ''}`} fill="currentColor" aria-hidden>
                      <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
                    </svg>
                  </button>
                  {megaOpen && (
                    <div id="shop-menu" className="absolute inset-x-0 top-full border-b border-cream-dark bg-cream shadow-[0_30px_40px_-30px_rgba(43,22,17,0.5)]">
                      <div className="container-page grid gap-4 py-6 lg:grid-cols-[220px_1fr]">
                        <div className="flex flex-col justify-between rounded-3xl bg-achaar p-6 text-cream">
                          <div>
                            <p className="font-deva text-2xl text-haldi">सारे अचार</p>
                            <p className="mt-1 font-display text-2xl font-black">Shop All Achaar</p>
                            <p className="mt-2 text-sm text-cream/80">Har flavour, har pack size, ek hi jagah.</p>
                          </div>
                          <Link to="/shop" className="btn-haldi mt-6 min-h-10 px-4 text-sm">
                            Sab dekhein
                          </Link>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                          {(categories.data ?? []).map((c) => {
                            const art = categoryArt(c.slug);
                            return (
                              <Link key={c._id} to={`/shop?category=${c.slug}`} className="group relative h-36 overflow-hidden rounded-3xl">
                                <img src={art.img} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-110" />
                                <div className={`absolute inset-0 bg-linear-to-t ${art.tint} via-black/35 via-45% to-transparent`} />
                                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                                  <p className="font-deva text-lg leading-none text-haldi">{art.hindi}</p>
                                  <p className="mt-1 font-display text-xl font-black">{c.name}</p>
                                  <p className="text-xs text-white/80">
                                    {c.productCount} {c.productCount === 1 ? 'variety' : 'varieties'}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link key={n.to} to={n.to} className={pill(isActive(n.to))}>
                  {n.label}
                </Link>
              ),
            )}
          </nav>
          <div className="ml-auto hidden w-60 xl:block">
            <SearchBox />
          </div>
          <div className="ml-auto flex items-center gap-1 xl:ml-3">
            <button className="flex size-11 items-center justify-center rounded-full hover:bg-achaar hover:text-cream xl:hidden" onClick={() => setSearchOpen((s) => !s)} aria-label="Search" aria-expanded={searchOpen}>
              <SearchIcon className="size-6" />
            </button>
            <Link to="/cart" className="relative flex h-11 items-center gap-2 rounded-full bg-achaar pr-4 pl-3 font-bold text-white transition hover:bg-achaar-dark" aria-label={`Cart, ${count} items`}>
              <CartIcon className="size-5" />
              <span className="hidden sm:inline">Cart</span>
              <span className="flex min-w-6 items-center justify-center rounded-full bg-haldi px-1.5 text-xs font-extrabold text-ink">{count}</span>
            </Link>
          </div>
        </div>
        {searchOpen && (
          <div className="container-page pb-3 xl:hidden">
            <SearchBox autoFocus onDone={() => setSearchOpen(false)} />
          </div>
        )}
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-masala/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[88%] flex-col overflow-y-auto bg-cream p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <Logo />
              <button className="flex size-11 items-center justify-center rounded-full hover:bg-achaar hover:text-cream" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <CloseIcon className="size-6" />
              </button>
            </div>
            <nav className="mt-6 flex flex-col gap-0.5" aria-label="Mobile">
              {[...NAV, { to: '/faqs', label: 'FAQs' }].map((n) => (
                <Link key={n.to} to={n.to} className={`rounded-2xl px-4 py-2.5 font-display text-xl font-bold ${isActive(n.to) ? 'bg-achaar text-cream' : 'hover:bg-achaar hover:text-cream'}`}>
                  {n.label}
                </Link>
              ))}
            </nav>
            {categories.data && categories.data.length > 0 && (
              <>
                <p className="eyebrow mt-6 px-1">Shop by flavour</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {categories.data.map((c) => {
                    const art = categoryArt(c.slug);
                    return (
                      <Link key={c._id} to={`/shop?category=${c.slug}`} className="relative h-28 overflow-hidden rounded-2xl">
                        <img src={art.img} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
                        <div className={`absolute inset-0 bg-linear-to-t ${art.tint} via-black/35 via-45% to-transparent`} />
                        <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                          <p className="font-deva text-sm leading-none text-haldi">{art.hindi}</p>
                          <p className="font-display text-base leading-tight font-black">{c.name}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
            <Link to="/shop" className="btn-primary mt-6 w-full">
              Shop All Achaar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const { settings } = useSettings();
  const b = settings.business;
  return (
    <footer className="relative mt-20 overflow-hidden bg-masala text-cream/85">
      {/* wavy top edge */}
      <svg className="absolute -top-px left-0 w-full text-cream" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden>
        <path d="M0 0h1440v12c-120 22-240 22-360 0s-240-22-360 0-240 22-360 0-240-22-360 0Z" fill="currentColor" />
      </svg>

      <div className="container-page pt-14 pb-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="col-span-2 md:col-span-1">
            <Logo light />
            <p className="mt-4 max-w-xs text-cream/70">Ghar ki rasoi se aapki thaali tak. Har jar mein wahi ghar jaisa, chatpata swaad.</p>
            {b.whatsapp && (
              <a href={`https://wa.me/${b.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn mt-6 bg-[#25D366] text-white hover:brightness-110">
                Order on WhatsApp
              </a>
            )}
          </div>
          <div>
            <h3 className="mb-3 font-sans text-xs font-extrabold tracking-[0.2em] text-haldi uppercase">Shop</h3>
            <ul className="space-y-1.5 text-sm">
              <li><Link to="/shop" className="hover:text-haldi">All Achaar</Link></li>
              <li><Link to="/shop?bestseller=1" className="hover:text-haldi">Bestsellers</Link></li>
              <li><Link to="/shop?category=mango" className="hover:text-haldi">Aam ka Achaar</Link></li>
              <li><Link to="/shop?category=chilli" className="hover:text-haldi">Mirchi ka Achaar</Link></li>
              <li><Link to="/shop?category=combo-packs" className="hover:text-haldi">Combo Packs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-sans text-xs font-extrabold tracking-[0.2em] text-haldi uppercase">Help</h3>
            <ul className="space-y-1.5 text-sm">
              <li><Link to="/track-order" className="hover:text-haldi">Track Order</Link></li>
              <li><Link to="/faqs" className="hover:text-haldi">FAQs</Link></li>
              <li><Link to="/policies/shipping" className="hover:text-haldi">Shipping Policy</Link></li>
              <li><Link to="/policies/returns" className="hover:text-haldi">Returns & Refunds</Link></li>
              <li><Link to="/policies/privacy" className="hover:text-haldi">Privacy Policy</Link></li>
              <li><Link to="/policies/terms" className="hover:text-haldi">Terms & Conditions</Link></li>
                            <li><Link to="/policies/food-safety" className="hover:text-haldi">Food Safety & Allergens</Link></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-3 font-sans text-xs font-extrabold tracking-[0.2em] text-haldi uppercase">Get in touch</h3>
            <ul className="space-y-1.5 text-sm">
              {b.supportPhone && <li><a href={`tel:${b.supportPhone}`} className="hover:text-haldi">{b.supportPhone}</a></li>}
              {b.supportEmail && <li><a href={`mailto:${b.supportEmail}`} className="hover:text-haldi">{b.supportEmail}</a></li>}
              {b.supportHours && <li className="text-cream/60">{b.supportHours}</li>}
              <li><Link to="/contact" className="font-semibold text-haldi hover:underline">Send us a message</Link></li>
            </ul>
            <div className="mt-5 flex gap-2">
              {b.instagram && <a href={b.instagram} target="_blank" rel="noopener noreferrer" className="rounded-full border border-cream/20 px-4 py-1.5 text-sm hover:border-haldi hover:text-haldi">Instagram</a>}
              {b.facebook && <a href={b.facebook} target="_blank" rel="noopener noreferrer" className="rounded-full border border-cream/20 px-4 py-1.5 text-sm hover:border-haldi hover:text-haldi">Facebook</a>}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-cream/10 pt-5 text-xs text-cream/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {b.name}. {b.tagline}.</p>
          <p>
            {b.fssaiNumber ? `FSSAI Lic./Reg. No. ${b.fssaiNumber} · ` : ''}Made in India
          </p>
        </div>
      </div>
    </footer>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  // Braces matter: newer browsers return a Promise from scrollTo, and an effect may only return a cleanup function.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
