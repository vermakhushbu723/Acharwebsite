import { useEffect } from 'react';

/** Public site URL used for canonical links and structured data. Set VITE_SITE_URL in production. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/$/, '');
export const SITE_NAME = 'Acharika';
export const DEFAULT_TITLE = 'Acharika | Homemade Achaar Online: Aam, Nimbu, Mirchi Pickle';
export const DEFAULT_DESCRIPTION =
  'Ghar ki rasoi mein bana homemade achaar online kharidein: aam, nimbu, hari mirch, lehsun, adrak, mixed veg aur combo packs. Guest checkout, COD aur order tracking.';
export const DEFAULT_IMAGE = '/og-image.jpg';

export const absUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`);

export type SeoInput = {
  /** Page title without the brand suffix. Empty string = home/default title. */
  title: string;
  description?: string;
  /** Canonical path, e.g. "/shop?category=mango". Defaults to the current path without query. */
  path?: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
  noindex?: boolean;
  /** One or more schema.org objects. */
  jsonLd?: object | object[];
};

function setMeta(attr: 'name' | 'property', key: string, content: string | undefined) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!content) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

function setJsonLd(data: object[] | undefined) {
  document.head.querySelectorAll('script[data-seo="page"]').forEach((s) => s.remove());
  for (const item of data ?? []) {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.dataset.seo = 'page';
    s.textContent = JSON.stringify({ '@context': 'https://schema.org', ...item });
    document.head.appendChild(s);
  }
}

/** Sets title, description, canonical, Open Graph/Twitter tags, robots and JSON-LD for the current page. */
export function useSeo(input: SeoInput) {
  const key = JSON.stringify(input);
  useEffect(() => {
    const { title, description = DEFAULT_DESCRIPTION, image = DEFAULT_IMAGE, type = 'website', noindex = false } = input;
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    const canonical = absUrl(input.path ?? window.location.pathname);
    const img = absUrl(image);

    document.title = fullTitle;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    setCanonical(canonical);

    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:locale', 'en_IN');
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', img);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', img);

    setJsonLd(input.jsonLd ? (Array.isArray(input.jsonLd) ? input.jsonLd : [input.jsonLd]) : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absUrl(it.path) })),
});

export const organizationLd = (b: { name: string; supportPhone?: string; supportEmail?: string; instagram?: string; facebook?: string }) => ({
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: b.name || SITE_NAME,
  url: `${SITE_URL}/`,
  logo: absUrl('/favicon.svg'),
  sameAs: [b.instagram, b.facebook].filter(Boolean),
  ...(b.supportPhone || b.supportEmail
    ? {
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          areaServed: 'IN',
          availableLanguage: ['en', 'hi'],
          ...(b.supportPhone ? { telephone: b.supportPhone } : {}),
          ...(b.supportEmail ? { email: b.supportEmail } : {}),
        },
      }
    : {}),
});

export const websiteLd = () => ({
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  inLanguage: 'en-IN',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/shop?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
});
