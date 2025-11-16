import React from 'react';

// PUBLIC_INTERFACE
export default function LineChart({ data = [], height = 140, color = 'var(--color-primary)', strokeWidth = 2, label }) {
  /** Simple responsive line chart via inline SVG (no external deps). */
  const width = 320;
  const padding = 16;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const xs = data.map((_, i) => i);
  const ys = data;

  const minY = Math.min(...ys, 0);
  const maxY = Math.max(...ys, 1);

  const toX = (i) => padding + (i / Math.max(xs.length - 1, 1)) * innerW;
  const toY = (v) => padding + innerH - ((v - minY) / Math.max(maxY - minY, 1)) * innerH;

  const d = data
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(2)} ${toY(v).toFixed(2)}`)
    .join(' ');

  return (
    <div role="img" aria-label={label || 'line chart'} style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height }}>
        <rect x="0" y="0" width={width} height={height} fill="transparent" />
        {/* grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={padding}
            x2={padding + innerW}
            y1={padding + innerH * t}
            y2={padding + innerH * t}
            stroke="rgba(17,24,39,0.06)"
            strokeWidth="1"
          />
        ))}
        <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      </svg>
    </div>
  );
}
