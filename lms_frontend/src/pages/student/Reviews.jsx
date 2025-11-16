import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import RatingStars from '../../components/ui/RatingStars';
import Pagination from '../../components/ui/Pagination';
import Input from '../../components/ui/Input';
import { sanitizeString } from '../../utils/sanitize';
import { AuthContext } from '../../providers/AuthProvider';

/**
 * PUBLIC_INTERFACE
 * Reviews page for students to browse/add course reviews using mock services.
 * Uses Ocean Professional theme components and does not call backend.
 */
export default function Reviews() {
  const { services } = React.useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState({ items: [], total: 0, page: 1, pageSize: 5 });
  const [error, setError] = React.useState('');

  const page = Number(searchParams.get('page') || '1');
  const courseId = searchParams.get('courseId') || '';

  const [newReview, setNewReview] = React.useState({ courseId: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    setError('');
    services.reviews
      .list({ page, pageSize: 5, courseId: courseId || undefined })
      .then((res) => setData(res))
      .catch(() => setError('Failed to load reviews'))
      .finally(() => setLoading(false));
  }, [services, page, courseId]);

  function onPageChange(next) {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(next));
    setSearchParams(nextParams);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        courseId: sanitizeString(newReview.courseId),
        rating: Number(newReview.rating) || 0,
        comment: sanitizeString(newReview.comment),
      };
      await services.reviews.add(payload);
      // reload first page and reset form
      setNewReview({ courseId: '', rating: 5, comment: '' });
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('page', '1');
      setSearchParams(nextParams);
    } catch {
      setError('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <h1 style={{ margin: 0 }}>Reviews</h1>
          <p style={{ color: 'var(--color-secondary)', marginTop: 6 }}>
            Browse recent course reviews and share your feedback.
          </p>
        </div>
        <Link to="/student/catalog" className="btn ghost">Catalog</Link>
      </div>

      <Card>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          <div style={{ fontWeight: 700 }}>Add a Review</div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <Input
              label="Course ID"
              placeholder="e.g., c-fs-1"
              value={newReview.courseId}
              onChange={(e) => setNewReview((s) => ({ ...s, courseId: e.target.value }))}
              required
            />
            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 14 }}>Rating</label>
              <select
                className="input"
                value={newReview.rating}
                onChange={(e) => setNewReview((s) => ({ ...s, rating: Number(e.target.value) }))}
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            <label style={{ fontSize: 14 }}>Comment</label>
            <textarea
              className="input"
              rows={4}
              placeholder="Share your experience..."
              value={newReview.comment}
              onChange={(e) => setNewReview((s) => ({ ...s, comment: e.target.value }))}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Review'}</Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setNewReview({ courseId: '', rating: 5, comment: '' })}
            >
              Reset
            </Button>
          </div>
          {error ? <div style={{ color: 'var(--color-error)' }}>{error}</div> : null}
        </form>
      </Card>

      <Card>
        <div style={{ display: 'grid', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ fontWeight: 700 }}>Recent Reviews</div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <input
                className="input"
                placeholder="Filter by Course ID..."
                value={courseId}
                onChange={(e) => {
                  const nextParams = new URLSearchParams(searchParams);
                  const v = sanitizeString(e.target.value);
                  if (v) nextParams.set('courseId', v);
                  else nextParams.delete('courseId');
                  nextParams.set('page', '1');
                  setSearchParams(nextParams);
                }}
                style={{ maxWidth: 220 }}
              />
            </div>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : data.items.length === 0 ? (
            <div style={{ fontSize: 14, color: 'var(--color-secondary)' }}>No reviews yet.</div>
          ) : (
            <>
              <ul style={{ display: 'grid', gap: 10 }}>
                {data.items.map((r) => (
                  <li
                    key={r.id}
                    style={{
                      padding: 12,
                      border: '1px solid rgba(17,24,39,0.06)',
                      borderRadius: 8,
                      background: '#fff',
                      display: 'grid',
                      gap: 6,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ fontWeight: 600 }}>{r.courseTitle} <span style={{ fontSize: 12, color: 'var(--color-secondary)' }}>({r.courseId})</span></div>
                      <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>{new Date(r.createdAt).toLocaleString()}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <RatingStars value={r.rating} />
                      <span style={{ fontSize: 12, color: 'var(--color-secondary)' }}>By {r.author || 'Anonymous'}</span>
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{r.comment}</div>
                  </li>
                ))}
              </ul>
              <Pagination
                page={data.page}
                pageSize={data.pageSize}
                total={data.total}
                onPageChange={onPageChange}
              />
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
