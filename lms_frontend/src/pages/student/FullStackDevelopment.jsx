import React from 'react';

/**
 * PUBLIC_INTERFACE
 * FullStackDevelopment: Student-facing track landing with placeholder content.
 * No backend calls; styled to match Ocean Professional theme.
 */
export function FullStackDevelopment() {
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

      <section className="detailsGrid">
        <div className="card panel" style={{ gridColumn: '1 / span 1' }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>About this Track</div>
          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            The Full Stack Development track focuses on practical skills across client and server development.
            You will learn React fundamentals and patterns, API design with Node.js, authentication, data modeling,
            and deployment workflows. As you progress, you&apos;ll build end-to-end projects that reinforce key concepts.
          </div>
        </div>

        <div className="card panel">
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Suggested Starting Points</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text-secondary)' }}>
            <li style={{ marginBottom: 6 }}>Foundations: HTML, CSS, and Modern JavaScript (ES6+)</li>
            <li style={{ marginBottom: 6 }}>Frontend: React components, routing, and state management</li>
            <li style={{ marginBottom: 6 }}>Backend: Node.js with REST APIs and authentication basics</li>
            <li style={{ marginBottom: 6 }}>Databases: Relational schemas and query fundamentals</li>
            <li style={{ marginBottom: 6 }}>DevOps: Environments, deployments, and observability</li>
          </ul>
        </div>

        <div className="card panel" style={{ gridColumn: '1 / span 2' }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>What You&apos;ll Build</div>
          <div style={{
            height: 180,
            borderRadius: 8,
            border: '1px dashed var(--border-subtle)',
            background: 'repeating-linear-gradient(to bottom, #fff, #fff 39px, #f3f4f6 40px)'
          }} />
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
            Placeholder project gallery area — examples: course catalog app, authenticated notes API, reviews & ratings module.
          </div>
        </div>
      </section>
    </div>
  );
}
