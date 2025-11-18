import React from 'react';
import { overviewStats } from '../../shared/mocks/overviewStats';
import { activities } from '../../shared/mocks/activity';
import { tips } from '../../shared/mocks/tips';
import { useAuth } from '../../core/auth/AuthContext';
import './overview-disable-animations.css';

/**
 * PUBLIC_INTERFACE
 * StudentOverviewPage: Student dashboard with KPIs and panels (mock data)
 */
export function StudentOverviewPage() {
  const { user } = useAuth();
  const greeting = user?.name ? `Welcome, ${user.name}!` : user?.email ? `Welcome, ${user.email}!` : 'Welcome!';

  return (
    <div className="overview-page" data-page="overview">
      <div className="pageHeader">
        <div>
          <h1>Student Overview</h1>
          <div className="subtitle">
            {greeting} Track your learning at a glance and continue where you left off.
          </div>
        </div>
        {/* Actions removed here; Topbar already provides Home and Logout */}
        <div aria-hidden="true" />
      </div>

      <section className="statsGrid">
        {overviewStats.map((s) => (
          <div key={s.label} className="card statCard reveal">
            <div className="statLabel">{s.label}</div>
            <div className={`statValue ${s.tone === 'accent' ? 'accent' : ''}`}>{s.value}</div>
            {s.subtext && <div className="statSub">{s.subtext}</div>}
          </div>
        ))}
      </section>

      <hr className="divider" />

      <section className="detailsGrid">
        <div className="card panel reveal" style={{ gridColumn: '1 / span 1' }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Progress Trend</div>
          <div style={{
            height: 240,
            borderRadius: 8,
            border: '1px dashed var(--border-subtle)',
            background: 'repeating-linear-gradient(to bottom, #fff, #fff 39px, #f3f4f6 40px)'
          }} />
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>Last 12 Weeks</div>
        </div>

        <div className="card panel reveal">
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Career Distribution</div>
          <div style={{ display: 'grid', gap: 12 }}>
            {['WebDev', 'Data', 'Cloud', 'AI'].map((cat, idx) => (
              <div key={cat} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12, alignItems: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{cat}</div>
                <div style={{ height: 10, background: '#E5E7EB', borderRadius: 9999 }}>
                  <div style={{ width: `${20 + idx * 15}%`, height: 10, background: 'var(--color-primary)', borderRadius: 9999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card panel" style={{ gridColumn: '1 / span 1' }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Recent Activity</div>
          <div>
            {activities.map((a) => (
              <div key={a.title} className="lessonRow">
                <div style={{ fontWeight: 500 }}>{a.title}</div>
                <div className="lessonDuration">{a.timeAgo}</div>
                <button className="lessonPlay" onClick={() => { /* route later */ }}>Open</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card panel">
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Tips</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {tips.map((t, idx) => <li key={idx} style={{ marginBottom: 6 }}>{t}</li>)}
          </ul>
        </div>
      </section>
    </div>
  );
}
