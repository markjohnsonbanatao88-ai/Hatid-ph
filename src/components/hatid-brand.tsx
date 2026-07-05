import type { CSSProperties, ReactNode } from 'react';

/**
 * Hatid brand marks, re-themed to the design-system direction:
 * navy wordmark with a red "id", a yellow underline accent, and the red "H" tile
 * as the only mark. No fake logo asset, no emoji. Presentation only.
 */

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export type HatidWordmarkProps = {
  light?: boolean;
  large?: boolean;
  compact?: boolean;
  tagline?: ReactNode;
};

export function HatidWordmark({ light = false, large = false, compact = false, tagline }: HatidWordmarkProps) {
  const wordColor = light ? 'var(--text-inverse)' : 'var(--hatid-ink)';
  return (
    <div className={cn('inline-flex items-center gap-2.5', compact && 'gap-2')} aria-label="Hatid">
      <span
        className={cn('grid place-items-center font-black tracking-tight shadow-sm', large ? 'h-12 w-12 text-[23px]' : 'h-9 w-9 text-[17px]')}
        style={{ borderRadius: 'var(--radius-control)', background: 'var(--hatid-primary)', color: '#fff' }}
      >
        H
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn('font-black tracking-[-0.045em]', large ? 'text-4xl' : 'text-2xl')} style={{ color: wordColor }}>
          <span>Hat</span>
          <span style={{ color: 'var(--hatid-primary)' }}>id</span>
          <span
            aria-hidden="true"
            style={{
              display: 'block',
              marginTop: '0.15rem',
              height: '0.2rem',
              width: large ? '2.75rem' : '2rem',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--hatid-yellow)',
            }}
          />
        </span>
        {tagline && (
          <span
            className="mt-2 text-[10px] font-semibold tracking-wide"
            style={{ color: light ? 'rgba(255,255,255,0.82)' : 'var(--text-muted)' }}
          >
            {tagline}
          </span>
        )}
      </span>
    </div>
  );
}

export type HatidTrustTone = 'blue' | 'navy' | 'green' | 'slate' | 'red';

const TRUST_TONES: Record<HatidTrustTone, CSSProperties> = {
  // "blue" kept for API compatibility; re-themed to the navy trust tint.
  blue: { background: 'var(--hatid-navy-soft)', color: 'var(--hatid-navy)', borderColor: '#D5DFF3' },
  navy: { background: 'var(--hatid-navy-soft)', color: 'var(--hatid-navy)', borderColor: '#D5DFF3' },
  green: { background: 'var(--hatid-success-bg)', color: 'var(--hatid-success)', borderColor: 'rgba(21,128,61,0.2)' },
  slate: { background: 'var(--surface-muted)', color: 'var(--text-secondary)', borderColor: 'var(--hatid-border)' },
  red: { background: 'var(--hatid-primary-50)', color: 'var(--hatid-primary)', borderColor: 'rgba(228,0,43,0.2)' },
};

export function HatidTrustPill({ children, tone = 'blue' }: { children: ReactNode; tone?: HatidTrustTone }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold leading-none"
      style={{ borderStyle: 'solid', ...TRUST_TONES[tone] }}
    >
      {children}
    </span>
  );
}

export function HatidIconTile({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className="grid h-11 w-11 place-items-center transition-colors"
      style={{
        borderRadius: 'var(--radius-control)',
        border: '1px solid',
        borderColor: active ? 'rgba(228,0,43,0.2)' : 'var(--hatid-border)',
        background: active ? 'var(--hatid-primary-50)' : 'var(--surface-muted)',
        color: active ? 'var(--hatid-primary)' : 'var(--text-muted)',
      }}
    >
      {children}
    </span>
  );
}
