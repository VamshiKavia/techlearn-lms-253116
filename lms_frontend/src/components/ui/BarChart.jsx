import React from 'react';

// PUBLIC_INTERFACE
export default function BarChart({ data = [], height = 140, color = 'var(--color-primary)', label }) {
  /** Simple responsive bar chart via inline SVG (no external deps). */
  const width = 320;
  const padding = 16;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const maxY = Math.max(...data, 1);
  const barW = innerW / Math.max(data.length, 1) - 8;

  return (
    <div role="img" aria-label={label || 'bar chart'} style={{ width: '100%' }}>
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
        {data.map((v, i) => {
          const h = (v / maxY) * innerH;
          const x = padding + i * (barW + 8);
          const y = padding + innerH - h;
          return <rect key={i} x={x} y={y} width={barW} height={h} fill={color} rx="4" />;
        })}
      </svg>
    </div>
  );
}
