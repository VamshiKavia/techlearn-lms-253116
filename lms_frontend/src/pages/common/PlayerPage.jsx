import React from 'react';
import { useParams } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * PlayerPage: basic HTML5 player placeholder with lesson title.
 */
export function PlayerPage() {
  const { lessonId } = useParams();
  const title = decodeURIComponent(lessonId || '');

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1>Player</h1>
          <div className="subtitle">{title}</div>
        </div>
      </div>
      <div className="card panel">
        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#0b1220', borderRadius: 8 }}>
          {/* Placeholder player box */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'white'
          }}>
            Video player placeholder
          </div>
        </div>
      </div>
    </div>
  );
}
