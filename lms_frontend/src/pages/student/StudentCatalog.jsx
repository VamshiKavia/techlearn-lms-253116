import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import Card from '../../components/ui/Card';
import RatingStars from '../../components/ui/RatingStars';
import Pagination from '../../components/ui/Pagination';
import Button from '../../components/ui/Button';

/**
 * PUBLIC_INTERFACE
 * StudentCatalog shows browsable course catalog with category filters and pagination using mock data.
 */
export default function StudentCatalog() {
  const { services } = React.useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = React.useState({ items: [], total: 0, page: 1, pageSize: 6 });
  const [loading, setLoading] = React.useState(true);

  const categories = ['All', 'Full-Stack Development', 'Data Science', 'Software Testing', 'Cloud', 'DevOps', 'AI'];

  const category = searchParams.get('category') || 'All';
  const page = Number(searchParams.get('page') || '1');

  React.useEffect(() => {
    setLoading(true);
    const cat = category === 'All' ? undefined : category;
    services.courses
      .list({ category: cat, page, pageSize: 6 })
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, [services, category, page]);

  function updateCategory(next) {
    const nextParams = new URLSearchParams(searchParams);
    if (next === 'All') nextParams.delete('category');
    else nextParams.set('category', next);
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  }

  function onPageChange(nextPage) {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(nextPage));
    setSearchParams(nextParams);
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <h1 style={{ margin: 0 }}>Catalog</h1>
        <p style={{ color: 'var(--color-secondary)', marginTop: 6 }}>
          Browse courses by category and explore details.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {categories.map((c) => (
          <button
            key={c}
            className={`btn ${c === category ? '' : 'ghost'}`}
            onClick={() => updateCategory(c)}
            aria-pressed={c === category}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {data.items.map((course) => (
              <Card key={course.id}>
                <div style={{ display: 'grid', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ fontWeight: 700 }}>{course.title}</div>
                    <span
                      style={{
                        fontSize: 12,
                        color: 'var(--color-secondary)',
                        background: 'rgba(17,24,39,0.04)',
                        padding: '2px 8px',
                        borderRadius: 999,
                      }}
                    >
                      {course.category}
                    </span>
                  </div>
                  {course.description ? (
                    <div style={{ fontSize: 14, color: 'var(--color-secondary)' }}>{course.description}</div>
                  ) : null}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <RatingStars value={course.rating || 0} />
                    <span style={{ fontSize: 12, color: 'var(--color-secondary)' }}>
                      {course.lessonsCount || 0} lessons
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/student/courses/${course.id}`} className="btn">
                      View
                    </Link>
                    <Button variant="ghost" disabled>
                      Enroll
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={onPageChange} />
        </>
      )}
    </div>
  );
}
