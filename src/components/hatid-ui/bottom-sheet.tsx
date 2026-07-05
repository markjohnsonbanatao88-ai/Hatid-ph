import type { CSSProperties, ReactNode } from 'react';

/**
 * Hatid design-system BottomSheet - groups the next rider decision over map context.
 * Visible handle, 32px top radius, restrained reduced-motion-safe slide-up.
 */

export interface HatidBottomSheetProps {
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
}

export function BottomSheet({ title, description, children, style }: HatidBottomSheetProps) {
  return (
    <section
      className="animate-hatid-slide-up"
      style={{
        borderRadius: 'var(--radius-sheet) var(--radius-sheet) 0 0',
        border: '1px solid var(--hatid-border)',
        borderBottom: 'none',
        background: 'var(--surface-raised)',
        padding: '0.75rem 1.25rem max(1.5rem, env(safe-area-inset-bottom))',
        boxShadow: 'var(--shadow-nav)',
        fontFamily: 'var(--hatid-font-sans)',
        ...style,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          margin: '0 auto 1rem',
          height: '0.375rem',
          width: '3rem',
          borderRadius: 'var(--radius-pill)',
          background: 'var(--hatid-border)',
        }}
      />
      {title ? (
        <h2
          style={{
            margin: 0,
            fontSize: 'var(--text-heading-size)',
            fontWeight: 'var(--weight-black)' as unknown as number,
            letterSpacing: 'var(--tracking-tight)',
            color: 'var(--hatid-ink)',
          }}
        >
          {title}
        </h2>
      ) : null}
      {description ? (
        <p
          style={{
            margin: '0.25rem 0 0',
            fontSize: 'var(--text-label)',
            lineHeight: 'var(--leading-body)',
            color: 'var(--text-muted)',
          }}
        >
          {description}
        </p>
      ) : null}
      <div style={{ marginTop: title || description ? '1.25rem' : 0 }}>{children}</div>
    </section>
  );
}
