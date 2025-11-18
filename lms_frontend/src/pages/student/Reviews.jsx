import React, { useMemo, useState } from 'react';
import { reviews as mockReviews } from '../../shared/mocks/reviews';
import { StarRating } from '../../components/common/StarRating';

/**
 * PUBLIC_INTERFACE
 * Reviews: Student reviews page rendering summary stats and a reviews list.
 * Frontend-only with local state and mock data; no backend calls are made.
 */
export function Reviews() {
  // Filters: by rating (All, 5, 4+, 3+, etc.) and simple text search
  const ratingFilters = ['All', '5', '4+', '3+'];
  const [ratingFilter, setRatingFilter] = useState('All');
  const [q, setQ] = useState('');

  const stats = useMemo(() => {
    const total = mockReviews.length || 0;
    const avg =
      total === 0
        ? 0
        : mockReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / total;
    return {
      average: Number.isFinite(avg) ? avg : 0,
      total,
    };
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return mockReviews.filter((r) => {
      const ratingOk =
        ratingFilter === 'All' ||
        (ratingFilter === '5' && r.rating === 5) ||
        (ratingFilter === '4+' && r.rating >= 4) ||
        (ratingFilter === '3+' && r.rating >= 3);

      const qOk =
        !query ||
        r.courseTitle.toLowerCase().includes(query) ||
        r.reviewer.toLowerCase().includes(query) ||
        r.comment.toLowerCase().includes(query);

      return ratingOk && qOk;
    });
  }, [ratingFilter, q]);

  const formatDate = (d) => {
    try {
      const date = new Date(d);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return d;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="pageHeader">
        <div>
          <h1>Reviews</h1>
          <div className="subtitle">
            Read what learners say about our courses. Filter by rating or search by course, reviewer, or text.
          </div>
        </div>
        {/* Right-side summary stats badge group */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div
            className="card reveal"
            style={{
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderRadius: 10,
            }}
            aria-label={`Average rating ${stats.average.toFixed(1)} out of 5`}
          >
            <StarRating value={Math.round(stats.average)} />
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              {stats.average.toFixed(1)} avg
            </div>
          </div>
          <div
            className="card"
            style={{
              padding: '10px 12px',
              borderRadius: 10,
              fontSize: 14,
              color: 'var(--text-secondary)',
            }}
            aria-label={`Total reviews ${stats.total}`}
          >
            {stats.total} reviews
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters" role="group" aria-label="Review filters">
        {ratingFilters.map((rf) => {
          const active = rf === ratingFilter;
          return (
            <button
              key={rf}
              className={`btn btn-outline btn-chip ${active ? 'active' : ''}`}
              onClick={() => setRatingFilter(rf)}
              aria-pressed={active}
            >
              {rf}
            </button>
          );
        })}
        <input
          aria-label="Search reviews"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search reviews…"
          style={{
            height: 40,
            padding: '8px 12px',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            width: '100%',
            maxWidth: 360,
            marginLeft: 4,
          }}
        />
      </div>

      {/* Reviews list */}
      <section
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: '1fr',
        }}
        aria-label="Reviews list"
      >
        {filtered.map((r) => (
          <article
            key={r.id}
            className="card reveal"
            style={{ padding: 16, borderRadius: 12 }}
          >
            <header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 6,
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <StarRating value={r.rating} />
                <div
                  style={{
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {r.rating}.0
                </div>
              </div>
              <div
                style={{ fontSize: 12, color: 'var(--text-muted)' }}
                aria-label={`Review date ${formatDate(r.date)}`}
              >
                {formatDate(r.date)}
              </div>
            </header>

            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 6,
              }}
            >
              {r.courseTitle}
            </div>

            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              {r.comment}
            </p>

            <footer
              style={{
                marginTop: 10,
                fontSize: 13,
                color: 'var(--text-muted)',
              }}
            >
              — {r.reviewer}
            </footer>
          </article>
        ))}
        {filtered.length === 0 && (
          <div
            className="card"
            style={{
              padding: 16,
              borderRadius: 12,
              color: 'var(--text-secondary)',
            }}
          >
            No reviews match your filters.
          </div>
        )}
      </section>
    </div>
  );
}
