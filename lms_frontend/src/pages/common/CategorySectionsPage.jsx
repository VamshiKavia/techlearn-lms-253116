import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categorySections } from '../../shared/mocks/categorySections';

/**
 * PUBLIC_INTERFACE
 * CategorySectionsPage: shows topic panels and lessons for selected category.
 */
export function CategorySectionsPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const data = categorySections[category] || [];

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1>{(category || '').replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())}</h1>
          <div className="subtitle">Curated topics and lessons in this category.</div>
        </div>
      </div>

      <section className="topicGrid">
        {data.map((panel, idx) => (
          <div key={`${panel.title}-${idx}`} className="card topicPanel">
            <div className="topicHeader">
              <div style={{ fontSize: 18, fontWeight: 600 }}>{panel.title}</div>
              <div style={{ color: 'var(--text-muted)' }}>⭐ {panel.rating?.toFixed?.(1) ?? '5.0'}</div>
            </div>

            <div className="progressLabel">Progress</div>
            <div className="progressTrack">
              <div className="progressFill" style={{ width: `${panel.progress ?? 40}%` }} />
            </div>

            <div className="videoLessonsTitle">Video Lessons</div>
            <div>
              {panel.lessons.map((l, li) => (
                <div key={l.title} className="lessonRow">
                  <div>{l.title}</div>
                  <div className="lessonDuration">{l.duration ?? ''}</div>
                  <button
                    className="lessonPlay"
                    onClick={() => {
                      if (l.type === 'pdf' || l.type === 'link') {
                        if (l.href) window.open(l.href, '_blank', 'noopener');
                      } else {
                        navigate(`/player/${encodeURIComponent(l.title)}`);
                      }
                    }}
                  >
                    {l.type === 'pdf' || l.type === 'link' ? 'Open' : 'Play'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
