import { Car, Star } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Hatid design-system DriverCard - assigned-driver identity (initials/photo, name,
 * vehicle, plate, rating). Pure presentation; no driver record, matching, or dispatch.
 */

export interface HatidDriverCardProps {
  name: string;
  vehicle: string;
  plate: string;
  rating?: number;
  statusLabel?: ReactNode;
  action?: ReactNode;
  style?: CSSProperties;
}

export function DriverCard({ name, vehicle, plate, rating, statusLabel, action, style }: HatidDriverCardProps) {
  const initial = (name || '?').slice(0, 1).toUpperCase();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--hatid-border)',
        background: 'var(--surface-raised)',
        boxShadow: 'var(--shadow-card)',
        padding: '1rem',
        fontFamily: 'var(--hatid-font-sans)',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          height: '3.25rem',
          width: '3.25rem',
          flexShrink: 0,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-pill)',
          background: 'var(--hatid-navy-soft)',
          color: 'var(--hatid-navy)',
          fontSize: '1.125rem',
          fontWeight: 'var(--weight-black)' as unknown as number,
        }}
      >
        {initial}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ margin: 0, fontSize: 'var(--text-heading-size)', fontWeight: 'var(--weight-black)' as unknown as number, color: 'var(--hatid-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</h3>
            <p style={{ margin: '0.15rem 0 0', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>
              <Car size={16} />
              {vehicle}
            </p>
          </div>
          {rating != null ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', borderRadius: 'var(--radius-pill)', background: 'rgba(255,209,0,0.16)', color: 'var(--hatid-ink)', padding: '0.25rem 0.6rem', fontSize: 'var(--text-label)', fontWeight: 'var(--weight-bold)' as unknown as number, flexShrink: 0 }}>
              <Star size={14} fill="var(--hatid-yellow)" color="var(--hatid-yellow)" />
              {rating.toFixed(1)}
            </span>
          ) : null}
        </div>
        <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', fontSize: 'var(--text-label)' }}>
          <span style={{ fontWeight: 'var(--weight-bold)' as unknown as number, letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>{plate}</span>
          {statusLabel ? <span style={{ color: 'var(--text-muted)' }}>{statusLabel}</span> : null}
        </div>
      </div>
      {action ? <div style={{ flexShrink: 0 }}>{action}</div> : null}
    </div>
  );
}
