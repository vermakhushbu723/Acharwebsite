import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SPICE_LABEL } from '../lib/format';

export function Spinner({ className = 'size-6' }: { className?: string }) {
  return <span className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${className}`} role="status" aria-label="Loading" />;
}

export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-achaar">
      <Spinner className="size-8" />
    </div>
  );
}

export function ErrorBlock({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div className="mx-auto my-12 max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="text-red-800">{message}</p>
      {retry && (
        <button className="btn-secondary mt-4" onClick={retry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="mx-auto my-12 max-w-md text-center">
      <h2 className="text-2xl">{title}</h2>
      {body && <p className="mt-2 text-ink-soft">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function QuantityStepper({ value, max, onChange, size = 'md' }: { value: number; max: number; onChange: (n: number) => void; size?: 'sm' | 'md' }) {
  const btn = size === 'sm' ? 'size-9' : 'size-11';
  return (
    <div className="inline-flex items-center rounded-full border border-[#d9c8a8] bg-white">
      <button type="button" className={`${btn} rounded-full text-xl font-semibold text-achaar disabled:opacity-30`} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        −
      </button>
      <span className="min-w-8 text-center font-semibold" aria-live="polite">
        {value}
      </span>
      <button type="button" className={`${btn} rounded-full text-xl font-semibold text-achaar disabled:opacity-30`} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}

export function SpiceBadge({ level, compact = false }: { level: '' | 'mild' | 'medium' | 'hot'; compact?: boolean }) {
  if (!level) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full text-xs font-bold text-achaar ${compact ? '' : 'bg-achaar/10 px-3 py-1'}`}
      title={SPICE_LABEL[level]}
      aria-label={`Spice level: ${SPICE_LABEL[level]}`}
    >
      {SPICE_LABEL[level]}
    </span>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden>/</span>}
            {it.to ? (
              <Link to={it.to} className="hover:text-achaar hover:underline">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function SectionHeading({ eyebrow, title, sub, center }: { eyebrow?: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={center ? 'text-center' : ''}>
      {eyebrow && (
        <p className="eyebrow">
          <span className="h-0.5 w-6 rounded bg-saffron" aria-hidden />
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-4xl leading-[1.05] font-black sm:text-5xl">{title}</h2>
      {sub && <p className={`mt-3 text-lg text-ink-soft ${center ? 'mx-auto max-w-xl' : 'max-w-xl'}`}>{sub}</p>}
    </div>
  );
}
