import { ShieldCheck } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Hatid design-system SafetyCard - trust & safety note with stronger visual priority.
 * `info` (navy) or `urgent` (red) tone. Presentation only: it does not create, escalate,
 * or resolve safety incidents.
 */

export interface HatidSafetyCardProps {
  title: ReactNode;
  children: ReactNode;
  tone?: 'info' | 'urgent';
  icon?: ReactNode;
  action?: ReactNode;
  style?: CSSProperties;
}

export function SafetyCard({ title, children, tone = 'info', icon, action, style }: HatidSafetyCardProps) {
  const urgent = tone === 'urgent';
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.75rem',
        borderRadius: 'var(--radius-card)',
        border: `1px solid ${urgent ? 'rgba(185,28,28,0.28)' : '#D5DFF3'}`,
        background: urgent ? 'var(--hatid-danger-bg)' : 'rgba(233,239,251,0.8)',
        padding: '1.25rem',
        fontFamily: 'var(--hatid-font-sans)',
        ...style,
      }}
    >
      <span
        style={{
          display: 'flex',
          height: 'var(--touch-target)',
          width: 'var(--touch-target)',
          flexShrink: 0,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-control)',
          background: 'var(--surface-raised)',
          boxShadow: '0 1px 2px rgb(15 23 42 / 0.06)',
          color: urgent ? 'var(--hatid-danger)' : 'var(--hatid-navy)',
        }}
      >
        {icon ?? <ShieldCheck size={20} />}
      </span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <h3 style={{ margin: 0, fontWeight: 'var(--weight-black)' as unknown as number, color: 'var(--hatid-ink)' }}>{title}</h3>
        <div style={{ marginTop: '0.25rem', fontSize: 'var(--text-label)', lineHeight: 'var(--leading-body)', color: 'var(--text-secondary)' }}>{children}</div>
        {action ? <div style={{ marginTop: '0.75rem' }}>{action}</div> : null}
      </div>
    </div>
  );
}
