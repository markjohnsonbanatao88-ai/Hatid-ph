'use client';

import type { CSSProperties, ReactNode } from 'react';

/**
 * Hatid design-system BottomNav - fixed rider tab bar. The active item is tinted red
 * with a soft red pill; 44px+ targets, translucent-blurred surface, upward nav shadow.
 */

export interface HatidBottomNavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

export interface HatidBottomNavProps {
  items: HatidBottomNavItem[];
  activeId: string;
  onNavigate?: (id: string) => void;
  style?: CSSProperties;
}

export function BottomNav({ items, activeId, onNavigate, style }: HatidBottomNavProps) {
  return (
    <nav
      aria-label="Primary navigation"
      style={{
        borderTop: '1px solid var(--hatid-border)',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '0.5rem 0.75rem calc(1.25rem + env(safe-area-inset-bottom))',
        boxShadow: 'var(--shadow-nav)',
        fontFamily: 'var(--hatid-font-sans)',
        ...style,
      }}
    >
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          maxWidth: '430px',
          marginInline: 'auto',
          alignItems: 'stretch',
          justifyContent: 'space-around',
          gap: '0.25rem',
        }}
      >
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id} style={{ flex: 1 }}>
              <button
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() => onNavigate?.(item.id)}
                style={{
                  display: 'flex',
                  minHeight: '3.5rem',
                  width: '100%',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  borderRadius: 'var(--radius-control)',
                  padding: '0.25rem 0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--text-caption)',
                  fontWeight: 'var(--weight-bold)' as unknown as number,
                  background: active ? 'var(--hatid-primary-50)' : 'transparent',
                  color: active ? 'var(--hatid-primary)' : 'var(--text-muted)',
                }}
              >
                <span style={{ display: 'flex' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
