'use client';

import { useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

/**
 * Hatid design-system Card - clean white container, 24px radius, hairline border,
 * restrained single-layer elevation. Presentation only.
 */

const PADDING: Record<'none' | 'sm' | 'md' | 'lg', CSSProperties['padding']> = {
  none: 0,
  sm: '1rem',
  md: '1.25rem',
  lg: '1.5rem',
};

export interface HatidCardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: keyof typeof PADDING;
  interactive?: boolean;
  children?: ReactNode;
}

export function Card({ padding = 'md', interactive = false, style, children, ...props }: HatidCardProps) {
  const [hover, setHover] = useState(false);
  const merged: CSSProperties = {
    borderRadius: 'var(--radius-card)',
    border: `1px solid ${interactive && hover ? 'rgba(228,0,43,0.35)' : 'var(--hatid-border)'}`,
    background: 'var(--surface-raised)',
    color: 'var(--text-primary)',
    boxShadow: 'var(--shadow-card)',
    padding: PADDING[padding],
    transition: interactive ? 'border-color 140ms ease' : undefined,
    ...style,
  };
  return (
    <div
      style={merged}
      onMouseEnter={interactive ? () => setHover(true) : undefined}
      onMouseLeave={interactive ? () => setHover(false) : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ style, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', ...style }} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ style, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      style={{
        margin: 0,
        fontFamily: 'var(--hatid-font-sans)',
        fontSize: 'var(--text-title)',
        fontWeight: 'var(--weight-black)' as unknown as number,
        letterSpacing: 'var(--tracking-tight)',
        color: 'var(--hatid-ink)',
        ...style,
      }}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ style, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      style={{
        margin: 0,
        fontFamily: 'var(--hatid-font-sans)',
        fontSize: 'var(--text-label)',
        lineHeight: 'var(--leading-body)',
        color: 'var(--text-muted)',
        ...style,
      }}
      {...props}
    >
      {children}
    </p>
  );
}
