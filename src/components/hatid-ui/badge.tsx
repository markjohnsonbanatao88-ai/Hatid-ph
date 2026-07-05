import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

/**
 * Hatid design-system Badge / status chip. Pill-shaped. Status tones are used
 * sparingly and paired with text, never color alone.
 */

export type HatidBadgeVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'rating';

const VARIANTS: Record<HatidBadgeVariant, CSSProperties> = {
  default: { background: 'var(--hatid-primary)', color: 'var(--text-inverse)' },
  secondary: { background: 'var(--surface-muted)', color: 'var(--text-secondary)' },
  outline: { background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--hatid-border)' },
  success: { background: 'var(--hatid-success-bg)', color: 'var(--hatid-success)' },
  warning: { background: 'var(--hatid-warning-bg)', color: 'var(--hatid-warning)' },
  danger: { background: 'var(--hatid-danger-bg)', color: 'var(--hatid-danger)' },
  info: { background: 'var(--hatid-navy-soft)', color: 'var(--hatid-navy)' },
  rating: { background: 'rgba(255,209,0,0.16)', color: 'var(--hatid-ink)' },
};

export interface HatidBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: HatidBadgeVariant;
  children?: ReactNode;
}

export function Badge({ variant = 'default', style, children, ...props }: HatidBadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        borderRadius: 'var(--radius-pill)',
        padding: '0.2rem 0.7rem',
        fontFamily: 'var(--hatid-font-sans)',
        fontSize: 'var(--text-caption)',
        fontWeight: 'var(--weight-bold)' as unknown as number,
        lineHeight: 1.5,
        border: '1px solid transparent',
        ...VARIANTS[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
