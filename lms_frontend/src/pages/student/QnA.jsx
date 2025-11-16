import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import Input from '../../components/ui/Input';
import { sanitizeString } from '../../utils/sanitize';
import { AuthContext } from '../../providers/AuthProvider';

/**
 * PUBLIC_INTERFACE
 * QnA page to view and ask questions for courses using mock services.
 */
export default function QnA() {
  const { services } = React.useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const courseId = searchParams.get('courseId') || '';

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [data, setData] = React.useState({ items: [], total: 0, page: 1, pageSize: 5 });

  const [newQ, setNewQ] = React.useState({ courseId: '', title: '', body: '' });
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    setError('');
    services.qna
      .list({ page, pageSize: 5, courseId: courseId || undefined })
      .then((res) => setData(res))
      .catch(() => setError('Failed to load Q&A'))
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
      await services.qna.ask({
        courseId: sanitizeString(newQ.courseId),
        title: sanitizeString(newQ.title),
        body: sanitizeString(newQ.body),
      });
      setNewQ({ courseId: '', title: '', body: '' });
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('page', '1');
      setSearchParams(nextParams);
    } catch {
      setError('Failed to post question');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <h1 style={{ margin: 0 }}>Q&amp;A</h1>
          <p style={{ color: 'var(--color-secondary)', marginTop: 6 }}>
            Ask questions and view answers from instructors and peers.
          </p>
        </div>
        <Link to="/student/catalog" className="btn ghost">Catalog</Link>
      </div>

      <Card>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          <div style={{ fontWeight: 700 }}>Ask a Question</div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <Input
              label="Course ID"
              placeholder="e.g., c-fs-1"
              value={newQ.courseId}
              onChange={(e) => setNewQ((s) => ({ ...s, courseId: e.target.value }))}
              required
            />
            <Input
              label="Title"
              placeholder="Brief title"
              value={newQ.title}
              onChange={(e) => setNewQ((s) => ({ ...s, title: e.target.value }))}
              required
            />
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            <label style={{ fontSize: 14 }}>Question</label>
            <textarea
              className="input"
              rows={4}
              placeholder="Provide details so others can help..."
              value={newQ.body}
              onChange={(e) => setNewQ((s) => ({ ...s, body: e.target.value }))}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="submit" disabled={submitting}>{submitting ? 'Posting...' : 'Post Question'}</Button>
            <Button type="button" variant="ghost" onClick={() => setNewQ({ courseId: '', title: '', body: '' })}>
              Reset
            </Button>
          </div>
          {error ? <div style={{ color: 'var(--color-error)' }}>{error}</div> : null}
        </form>
      </Card>

      <Card>
        <div style={{ display: 'grid', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ fontWeight: 700 }}>Latest Questions</div>
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
              style={{ marginLeft: 'auto', maxWidth: 220 }}
            />
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : data.items.length === 0 ? (
            <div style={{ fontSize: 14, color: 'var(--color-secondary)' }}>No questions yet.</div>
          ) : (
            <>
              <ul style={{ display: 'grid', gap: 10 }}>
                {data.items.map((q) => (
                  <li
                    key={q.id}
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
                      <div style={{ fontWeight: 600 }}>{q.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>
                        {new Date(q.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>
                      Course: {q.courseTitle} ({q.courseId}) • Asked by {q.author || 'Student'}
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{q.body}</div>
                    {q.answers?.length ? (
                      <div style={{ marginTop: 6 }}>
                        <div style={{ fontSize: 12, color: 'var(--color-secondary)', marginBottom: 4 }}>
                          Answers ({q.answers.length})
                        </div>
                        <ul style={{ display: 'grid', gap: 6 }}>
                          {q.answers.map((a) => (
                            <li
                              key={a.id}
                              style={{
                                border: '1px solid rgba(17,24,39,0.06)',
                                borderRadius: 6,
                                padding: 8,
                                background: 'var(--color-surface)',
                              }}
                            >
                              <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>
                                By {a.author || 'Instructor'} • {new Date(a.createdAt).toLocaleString()}
                              </div>
                              <div style={{ whiteSpace: 'pre-wrap' }}>{a.body}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
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
