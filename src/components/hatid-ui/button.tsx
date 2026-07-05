'use client';

import { useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';

/**
 * Hatid design-system Button (native React port of the bundle primitive).
 * Red primary CTA, restrained secondary/ghost/outline/danger/link variants.
 * Uses only --hatid-* / surface / radius / shadow tokens; no product behavior.
 */

export type HatidButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'outline'
  | 'danger'
  | 'link';

export type HatidButtonSize = 'sm' | 'default' | 'md' | 'lg' | 'icon';

const BASE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  whiteSpace: 'nowrap',
  borderRadius: 'var(--radius-control)',
  fontFamily: 'var(--hatid-font-sans)',
  fontWeight: 'var(--weight-bold)' as unknown as number,
  lineHeight: 1,
  cursor: 'pointer',
  border: '1px solid transparent',
  transition: 'background-color 140ms ease, border-color 140ms ease, box-shadow 140ms ease',
  outline: 'none',
};

const VARIANTS: Record<HatidButtonVariant, CSSProperties & { '--hover-bg'?: string }> = {
  primary: {
    background: 'var(--hatid-primary)',
    color: 'var(--text-inverse)',
    boxShadow: 'var(--shadow-primary)',
    '--hover-bg': 'var(--hatid-primary-hover)',
  },
  secondary: {
    background: 'var(--surface-raised)',
    color: 'var(--hatid-ink)',
    border: '1px solid var(--hatid-border)',
    boxShadow: '0 1px 2px rgb(15 23 42 / 0.06)',
    '--hover-bg': 'var(--hatid-primary-soft)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--hatid-ink)',
    '--hover-bg': 'var(--surface-muted)',
  },
  outline: {
    background: 'var(--surface-raised)',
    color: 'var(--hatid-ink)',
    border: '1px solid var(--hatid-border)',
    '--hover-bg': 'var(--surface-muted)',
  },
  danger: {
    background: 'var(--hatid-danger)',
    color: 'var(--text-inverse)',
    '--hover-bg': '#991B1B',
  },
  link: {
    background: 'transparent',
    color: 'var(--hatid-primary)',
    textUnderlineOffset: '4px',
    '--hover-bg': 'transparent',
  },
};

const SIZES: Record<HatidButtonSize, CSSProperties> = {
  sm: { minHeight: 'var(--touch-target)', padding: '0.5rem 1rem', fontSize: 'var(--text-label)' },
  default: { minHeight: 'var(--touch-target)', padding: '0.5rem 1rem', fontSize: 'var(--text-label)' },
  md: { minHeight: '3rem', padding: '0.75rem 1.25rem', fontSize: 'var(--text-body)' },
  lg: { minHeight: '3.5rem', padding: '0.875rem 1.5rem', fontSize: 'var(--text-body)' },
  icon: { height: 'var(--touch-target)', width: 'var(--touch-target)', padding: 0 },
};

export interface HatidButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: HatidButtonVariant;
  size?: HatidButtonSize;
  fullWidth?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'default',
  fullWidth = false,
  disabled = false,
  style,
  children,
  onFocus,
  onBlur,
  ...props
}: HatidButtonProps) {
  const [hover, setHover] = useState(false);
  const v = VARIANTS[variant];
  const { ['--hover-bg']: hoverBg, ...variantStyle } = v;
  const merged: CSSProperties = {
    ...BASE,
    ...variantStyle,
    ...SIZES[size],
    ...(fullWidth ? { width: '100%' } : null),
    ...(disabled ? { opacity: 0.5, pointerEvents: 'none' } : null),
    ...(hover && hoverBg && hoverBg !== 'transparent' ? { background: hoverBg } : null),
    ...(hover && variant === 'link' ? { textDecoration: 'underline' } : null),
    ...style,
  };
  return (
    <button
      type="button"
      disabled={disabled}
      style={merged}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={(event) => {
        event.currentTarget.style.boxShadow = 'var(--shadow-focus)';
        onFocus?.(event);
      }}
      onBlur={(event) => {
        event.currentTarget.style.boxShadow = (merged.boxShadow as string) || 'none';
        onBlur?.(event);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
