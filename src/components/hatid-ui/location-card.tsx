'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import { MapPin } from 'lucide-react';

/**
 * Hatid design-system LocationCard - saved / suggested place row. Presentation only;
 * no geocoding, routing, or dispatch.
 */

export interface HatidLocationCardProps {
  label: ReactNode;
  address: ReactNode;
  note?: ReactNode;
  icon?: ReactNode;
  selected?: boolean;
  onSelect?: () => void;
  style?: CSSProperties;
}

export function LocationCard({ label, address, note, icon, selected = false, onSelect, style }: HatidLocationCardProps) {
  const [hover, setHover] = useState(false);
  const inner: CSSProperties = {
    display: 'flex',
    minHeight: '5rem',
    width: '100%',
    alignItems: 'center',
    gap: '0.75rem',
    borderRadius: 'var(--radius-card)',
    padding: '1rem',
    textAlign: 'left',
    fontFamily: 'var(--hatid-font-sans)',
  };
  const content = (
    <>
      <span
        style={{
          display: 'flex',
          height: 'var(--touch-target)',
          width: 'var(--touch-target)',
          flexShrink: 0,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-control)',
          background: selected ? 'var(--hatid-primary)' : 'var(--hatid-primary-50)',
          color: selected ? '#fff' : 'var(--hatid-primary)',
        }}
      >
        {icon ?? <MapPin size={20} />}
      </span>
      <span style={{ minWidth: 0, flex: 1 }}>
        <span style={{ display: 'block', fontWeight: 'var(--weight-black)' as unknown as number, color: 'var(--hatid-ink)' }}>{label}</span>
        <span style={{ display: 'block', marginTop: '0.1rem', fontSize: 'var(--text-label)', lineHeight: 1.35, color: 'var(--text-muted)' }}>{address}</span>
        {note ? <span style={{ display: 'block', marginTop: '0.25rem', fontSize: 'var(--text-caption)', color: 'var(--text-faint)' }}>{note}</span> : null}
      </span>
    </>
  );
  return (
    <div
      onMouseEnter={onSelect ? () => setHover(true) : undefined}
      onMouseLeave={onSelect ? () => setHover(false) : undefined}
      style={{
        borderRadius: 'var(--radius-card)',
        border: `1px solid ${selected ? 'var(--hatid-primary)' : hover ? 'rgba(228,0,43,0.35)' : 'var(--hatid-border)'}`,
        background: 'var(--surface-raised)',
        boxShadow: 'var(--shadow-card)',
        transition: 'border-color 140ms ease',
        ...style,
      }}
    >
      {onSelect ? (
        <button type="button" onClick={onSelect} style={{ ...inner, background: 'transparent', border: 'none', cursor: 'pointer' }}>
          {content}
        </button>
      ) : (
        <div style={inner}>{content}</div>
      )}
    </div>
  );
}
