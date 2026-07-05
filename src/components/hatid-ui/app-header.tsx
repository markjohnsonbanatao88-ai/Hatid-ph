'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowLeft, Bell } from 'lucide-react';

/**
 * Hatid design-system AppHeader - top bar with title/subtitle. Optional back button
 * (left) and notification button (right). With no back button it shows the red "H" tile.
 */

function IconButton({ label, onClick, children }: { label: string; onClick?: () => void; children: ReactNode }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        height: 'var(--touch-target)',
        width: 'var(--touch-target)',
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-pill)',
        border: '1px solid var(--hatid-border)',
        background: hover ? 'var(--hatid-primary-soft)' : 'var(--surface-raised)',
        color: 'var(--hatid-ink)',
        cursor: 'pointer',
        boxShadow: '0 1px 2px rgb(15 23 42 / 0.06)',
      }}
    >
      {children}
    </button>
  );
}

export interface HatidAppHeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  onNotifications?: () => void;
  style?: CSSProperties;
}

export function AppHeader({ title = 'Hatid', subtitle, onBack, onNotifications, style }: HatidAppHeaderProps) {
  return (
    <header
      style={{
        display: 'flex',
        minHeight: '5rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        padding: '2.5rem 1.25rem 1rem',
        fontFamily: 'var(--hatid-font-sans)',
        background: 'var(--surface-raised)',
        borderBottom: '1px solid var(--hatid-border)',
        ...style,
      }}
    >
      <div style={{ display: 'flex', flex: 1, minWidth: 0, alignItems: 'center', gap: '0.75rem' }}>
        {onBack ? (
          <IconButton label="Go back" onClick={onBack}>
            <ArrowLeft size={20} />
          </IconButton>
        ) : (
          <span
            aria-hidden="true"
            style={{
              display: 'flex',
              height: 'var(--touch-target)',
              width: 'var(--touch-target)',
              flexShrink: 0,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-control)',
              background: 'var(--hatid-primary)',
              color: '#fff',
              fontSize: '1.125rem',
              fontWeight: 'var(--weight-black)' as unknown as number,
            }}
          >
            H
          </span>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: 'var(--text-title)',
              fontWeight: 'var(--weight-black)' as unknown as number,
              lineHeight: 1.1,
              letterSpacing: 'var(--tracking-tight)',
              color: 'var(--hatid-ink)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </p>
          {subtitle ? (
            <p
              style={{
                margin: 0,
                fontSize: 'var(--text-label)',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      {onNotifications ? (
        <IconButton label="Notifications" onClick={onNotifications}>
          <Bell size={20} />
        </IconButton>
      ) : null}
    </header>
  );
}
