'use client';

import { Check, Users, type LucideIcon } from 'lucide-react';
import type { CSSProperties } from 'react';

/**
 * Hatid design-system RideCard - selectable ride option (HatidCar / HatidMoto).
 * Fare/ETA are DISPLAY-ONLY strings passed in; this component never prices, dispatches,
 * or assigns a driver.
 */

export interface HatidRideCardProps {
  id: string;
  rideType: string;
  description?: string;
  eta: string;
  fareEstimate: string;
  capacity: string;
  icon: LucideIcon;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: (id: string) => void;
  style?: CSSProperties;
}

export function RideCard({
  id,
  rideType,
  description,
  eta,
  fareEstimate,
  capacity,
  icon: Icon,
  selected = false,
  disabled = false,
  onSelect,
  style,
}: HatidRideCardProps) {
  return (
    <div
      style={{
        borderRadius: 'var(--radius-card)',
        border: `1px solid ${selected ? 'var(--hatid-primary)' : 'var(--hatid-border)'}`,
        background: 'var(--surface-raised)',
        boxShadow: selected ? '0 0 0 2px rgba(228,0,43,0.15), var(--shadow-card)' : 'var(--shadow-card)',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <button
        type="button"
        disabled={disabled}
        aria-pressed={selected}
        onClick={() => onSelect?.(id)}
        style={{
          display: 'flex',
          minHeight: '7rem',
          width: '100%',
          alignItems: 'center',
          gap: '1rem',
          borderRadius: 'var(--radius-card)',
          padding: '1rem',
          textAlign: 'left',
          background: 'transparent',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--hatid-font-sans)',
        }}
      >
        <span
          style={{
            display: 'flex',
            height: '3.5rem',
            width: '3.5rem',
            flexShrink: 0,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-control)',
            background: selected ? 'var(--hatid-primary)' : 'var(--hatid-primary-50)',
            color: selected ? '#fff' : 'var(--hatid-primary)',
          }}
        >
          <Icon size={22} />
        </span>
        <span style={{ minWidth: 0, flex: 1 }}>
          <span style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
            <span>
              <span style={{ display: 'block', fontSize: 'var(--text-heading-size)', fontWeight: 'var(--weight-black)' as unknown as number, letterSpacing: 'var(--tracking-tight)', color: 'var(--hatid-ink)' }}>{rideType}</span>
              {description ? <span style={{ display: 'block', marginTop: '0.25rem', fontSize: 'var(--text-label)', lineHeight: 1.35, color: 'var(--text-muted)' }}>{description}</span> : null}
            </span>
            {selected ? (
              <Check size={22} color="var(--hatid-primary)" strokeWidth={2.75} style={{ flexShrink: 0 }} />
            ) : (
              <span style={{ height: '1.5rem', width: '1.5rem', flexShrink: 0, borderRadius: 'var(--radius-pill)', border: '2px solid var(--hatid-border-strong)' }} />
            )}
          </span>
          <span style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.75rem' }}>
            <span style={{ display: 'flex', gap: '0.75rem', fontSize: 'var(--text-label)', color: 'var(--text-muted)' }}>
              <span>{eta}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Users size={16} />
                {capacity}
              </span>
            </span>
            <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--weight-black)' as unknown as number, color: 'var(--text-primary)' }}>{fareEstimate}</span>
          </span>
        </span>
      </button>
    </div>
  );
}
