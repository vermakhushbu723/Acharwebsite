import { useId } from 'react';

/** Picks a readable short name for the jar label, e.g. "Traditional Mango Achaar" -> "Mango". */
function shortName(name = '') {
  const skip = /^(traditional|achaar|achar|pickle|family|combo:?|the)$/i;
  const words = name.replace(/[:+]/g, ' ').split(/\s+/).filter((w) => w && !skip.test(w));
  return (words.slice(0, 2).join(' ') || name).slice(0, 14);
}

/**
 * Illustrated achaar jar used until real product photos are uploaded.
 * Deliberately an illustration (not a fake photo) so customers aren't misled.
 * Traditional "kapda-bandh" look: glass jar, cloth-covered lid tied with twine, kraft label.
 */
export function JarArt({ color = '#B5562B', label, name, className = '' }: { color?: string; label?: string; name?: string; className?: string }) {
  const id = useId().replace(/:/g, '');
  const text = name ? shortName(name) : '';
  return (
    <svg viewBox="0 0 220 260" className={className} role="img" aria-label={label ? `${label} jar illustration` : 'Achaar jar illustration'}>
      <defs>
        <linearGradient id={`glass-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".18" stopColor="#fff" stopOpacity=".08" />
          <stop offset=".8" stopColor="#000" stopOpacity=".04" />
          <stop offset="1" stopColor="#000" stopOpacity=".2" />
        </linearGradient>
        <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".85" />
          <stop offset="1" stopColor={color} />
        </linearGradient>
        <clipPath id={`clip-${id}`}>
          <path d="M44 86c0-10 8-16 18-16h96c10 0 18 6 18 16v128c0 14-11 24-25 24H69c-14 0-25-10-25-24Z" />
        </clipPath>
      </defs>

      <ellipse cx="110" cy="246" rx="74" ry="9" fill="#2B1611" opacity=".12" />

      {/* contents: oil layer + chunks */}
      <g clipPath={`url(#clip-${id})`}>
        <rect x="40" y="70" width="140" height="180" fill="#FFF3DD" />
        <rect x="40" y="96" width="140" height="160" fill={`url(#fill-${id})`} />
        <rect x="40" y="96" width="140" height="10" fill="#E9A63A" opacity=".55" />
        {[
          [62, 128, 16, 12, -20], [96, 120, 18, 11, 15], [134, 132, 17, 12, -8], [76, 160, 19, 12, 25],
          [118, 166, 16, 13, -30], [150, 172, 14, 10, 10], [58, 196, 17, 11, 5], [98, 202, 19, 12, -15],
          [138, 208, 16, 11, 20], [80, 226, 15, 10, -5], [122, 232, 17, 11, 12],
        ].map(([x, y, rx, ry, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} transform={`rotate(${r} ${x} ${y})`} fill="#fff" opacity={i % 3 === 0 ? 0.28 : 0.16} />
        ))}
        {[[70, 142], [112, 148], [148, 150], [90, 182], [132, 190], [66, 214], [110, 220], [152, 228]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.2" fill="#2B1611" opacity=".45" />
        ))}
      </g>

      {/* glass */}
      <path d="M44 86c0-10 8-16 18-16h96c10 0 18 6 18 16v128c0 14-11 24-25 24H69c-14 0-25-10-25-24Z" fill={`url(#glass-${id})`} stroke="#2B1611" strokeOpacity=".18" strokeWidth="2" />
      <path d="M58 92c0-4 3-7 7-7h4v138h-2c-5 0-9-4-9-9Z" fill="#fff" opacity=".45" />

      {/* neck + cloth cover */}
      <rect x="66" y="52" width="88" height="22" rx="6" fill="#E9DCC4" stroke="#2B1611" strokeOpacity=".15" />
      <path d="M52 50c6-22 30-30 58-30s52 8 58 30l-8 14c-4 6-6 2-10 7-5-5-8 1-13-3-5 4-9-2-14 2-5-4-9 2-13-2-5 4-9-2-14 2-4-5-8 1-12-4-5 4-7-2-11-3Z" fill="#2E0D0A" />
      <path d="M52 50c6-22 30-30 58-30s52 8 58 30" fill="none" stroke="#140403" strokeWidth="2" opacity=".5" />
      {[[80, 34], [110, 30], [140, 36], [95, 46], [125, 46], [68, 50], [152, 52]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.2" fill="#FFB627" />
      ))}
      <path d="M58 62c34 8 70 8 104 0" fill="none" stroke="#C89B5E" strokeWidth="5" strokeLinecap="round" />
      <path d="M104 64c-6 10-12 14-18 16M112 64c4 10 10 14 18 15" fill="none" stroke="#C89B5E" strokeWidth="3.5" strokeLinecap="round" />

      {/* kraft label */}
      <g>
        <rect x="58" y="122" width="104" height="74" rx="10" fill="#F3E2C3" stroke="#2B1611" strokeOpacity=".2" />
        <rect x="64" y="128" width="92" height="62" rx="7" fill="none" stroke="#2E0D0A" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="110" y="146" textAnchor="middle" fontFamily="Yatra One, serif" fontSize="15" fill="#2E0D0A">अचारिका</text>
        {text && (
          <text x="110" y="168" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="800" fontSize={text.length <= 6 ? 16 : text.length <= 9 ? 13 : 11} fill="#2B1611">
            {text}
          </text>
        )}
        <text x="110" y="183" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="6.5" letterSpacing="0.8" fill="#73554C">
          HOMEMADE ACHAAR
        </text>
      </g>
    </svg>
  );
}

export function ProductImage({
  product,
  className = '',
  index = 0,
}: {
  product: { name: string; accentColor: string; images: { url: string; alt: string }[] };
  className?: string;
  index?: number;
}) {
  const img = product.images[index];
  if (img) {
    return <img src={img.url} alt={img.alt || product.name} loading="lazy" decoding="async" className={`object-cover ${className}`} />;
  }
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: `radial-gradient(120% 90% at 50% 100%, ${product.accentColor}33 0%, transparent 60%), linear-gradient(180deg, #FFF6EA 0%, #F6E3C8 100%)` }}
    >
      <span className="absolute -right-10 -bottom-10 size-40 rounded-full opacity-20" style={{ background: product.accentColor }} aria-hidden />
      <JarArt color={product.accentColor} label={product.name} name={product.name} className="relative h-[82%] w-[82%] drop-shadow-[0_18px_20px_rgba(43,22,17,0.18)]" />
    </div>
  );
}
