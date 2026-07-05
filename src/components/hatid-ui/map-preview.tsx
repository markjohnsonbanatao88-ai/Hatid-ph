import type { CSSProperties, ReactNode } from 'react';

/**
 * Hatid design-system MapPreview - an ABSTRACT map surface: soft navy radial tint with
 * rounded land/water blocks and an optional static navy pickup marker.
 *
 * Deliberate product boundary (per the design system + prototype honesty): NO fake roads,
 * traffic, route lines, or driver pins. It is a visual shell, not live routing or dispatch.
 */

export interface HatidMapPreviewProps {
  children?: ReactNode;
  showPickupMarker?: boolean;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export function MapPreview({
  children,
  showPickupMarker = true,
  label = 'Prototype map - not live routing or dispatch',
  className,
  style,
}: HatidMapPreviewProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(120% 90% at 50% 15%, var(--hatid-navy-soft) 0%, var(--surface-muted) 60%, var(--surface-muted) 100%)',
        fontFamily: 'var(--hatid-font-sans)',
        ...style,
      }}
    >
      {/* Abstract land / water blocks - no roads, routes, traffic, or driver pins. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-8%', top: '18%', height: '38%', width: '46%', borderRadius: '2rem', background: 'rgba(255,255,255,0.55)' }} />
      <div aria-hidden="true" style={{ position: 'absolute', right: '-6%', top: '46%', height: '34%', width: '40%', borderRadius: '2rem', background: 'rgba(255,255,255,0.45)' }} />
      <div aria-hidden="true" style={{ position: 'absolute', left: '22%', bottom: '-10%', height: '34%', width: '52%', borderRadius: '2rem', background: 'rgba(0,47,135,0.06)' }} />

      {showPickupMarker ? (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            height: '1.15rem',
            width: '1.15rem',
            transform: 'translate(-50%, -50%)',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--hatid-navy)',
            border: '4px solid #fff',
            boxShadow: 'var(--shadow-card)',
          }}
        />
      ) : null}

      <span
        style={{
          position: 'absolute',
          left: '0.75rem',
          bottom: '0.75rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          borderRadius: 'var(--radius-pill)',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          padding: '0.3rem 0.7rem',
          fontSize: 'var(--text-caption)',
          fontWeight: 'var(--weight-bold)' as unknown as number,
          color: 'var(--text-muted)',
          border: '1px solid var(--hatid-border)',
        }}
      >
        {label}
      </span>

      {children}
    </div>
  );
}
