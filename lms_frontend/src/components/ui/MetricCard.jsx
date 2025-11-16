import React from 'react';
import Card from './Card';

// PUBLIC_INTERFACE
export default function MetricCard({ label, value, trend, hint }) {
  /** Displays a KPI metric with label, value, optional trend and hint in Ocean Professional style. */
  const trendColor =
    (trend ?? 0) > 0 ? 'var(--color-success)' : (trend ?? 0) < 0 ? 'var(--color-error)' : 'var(--color-secondary)';
  const trendPrefix = (trend ?? 0) > 0 ? '+' : '';
  return (
    <Card>
      <div style={{ display: 'grid', gap: 6 }}>
        <div style={{ fontSize: 12, color: 'var(--color-secondary)', letterSpacing: 0.3, textTransform: 'uppercase' }}>
          {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{value}</div>
          {typeof trend === 'number' ? (
            <div style={{ fontSize: 12, color: trendColor }}>{trendPrefix}{trend}%</div>
          ) : null}
        </div>
        {hint ? <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>{hint}</div> : null}
      </div>
    </Card>
  );
}
