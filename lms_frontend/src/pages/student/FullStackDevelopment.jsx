import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fullStackSections } from '../../shared/mocks/fullStack';

/**
 * PUBLIC_INTERFACE
 * FullStackDevelopment: Student-facing track landing with three sections (Frontend, Backend, Database),
 * each rendering a grid of topic panels and video lesson rows. Uses local mock data only.
 */
export function FullStackDevelopment() {
  const navigate = useNavigate();

  const renderTopicPanel = (panel) => (
    <div key={panel.title} className="card topicPanel">
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
          <div key={`${panel.title}-${l.title}-${li}`} className="lessonRow">
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
  );

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1>Full Stack Development</h1>
          <div className="subtitle">
            Build production-ready applications across the stack — from modern frontends to scalable backends and databases.
          </div>
        </div>
        <div aria-hidden="true" />
      </div>

      {/* Frontend Section */}
      <section style={{ marginTop: 8, marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Frontend</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>UI, UX, and client-side patterns</div>
        </div>
        <div className="topicGrid">
          {fullStackSections.frontend.map(renderTopicPanel)}
        </div>
      </section>

      {/* Backend Section */}
      <section style={{ marginTop: 16, marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Backend</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>APIs, auth, and integrations</div>
        </div>
        <div className="topicGrid">
          {fullStackSections.backend.map(renderTopicPanel)}
        </div>
      </section>

      {/* Database Section */}
      <section style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Database</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Modeling, querying, and operations</div>
        </div>
        <div className="topicGrid">
          {fullStackSections.database.map(renderTopicPanel)}
        </div>
      </section>
    </div>
  );
}
