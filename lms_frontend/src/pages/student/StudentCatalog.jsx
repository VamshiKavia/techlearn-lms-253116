import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import RatingStars from '../../components/ui/RatingStars';
import EmptyState from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { mockCourses } from '../../services/mockData';
import '../../styles/theme.css';

/**
 * PUBLIC_INTERFACE
 * Student course catalog with category filters, skeleton loading, and pagination.
 */
export default function StudentCatalog() {
  const CATEGORIES = ['All', 'Full-Stack', 'Data Science', 'Cloud', 'DevOps', 'Software Testing', 'AI'];

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      const filtered = activeCategory === 'All'
        ? mockCourses
        : mockCourses.filter(c => c.category === activeCategory);
      setCourses(filtered);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, [activeCategory]);

  useEffect(() => { setPage(1); }, [activeCategory]);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(courses.length / pageSize));
  const pageItems = courses.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div className="flex justify-between items-center">
        <h1 className="h1">Catalog</h1>
        <div className="flex gap-2" role="tablist" aria-label="Course categories">
          {CATEGORIES.map(cat => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'primary' : 'secondary'}
              onClick={() => setActiveCategory(cat)}
              ariaLabel={`Filter by ${cat}`}
              className="whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" aria-live="polite">
          {Array.from({ length: 6 }).map((_, idx) => <CardSkeleton key={idx} />)}
        </div>
      ) : pageItems.length === 0 ? (
        <EmptyState
          title="No courses found"
          description="Try switching categories or check back later."
          actionLabel="Reset filters"
          onAction={() => setActiveCategory('All')}
        />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {pageItems.map((c) => (
              <Card key={c.id} role="article">
                <div style={{ display: 'grid', gap: 8 }}>
                  <div style={{ fontWeight: 700 }}>{c.title}</div>
                  <div className="subtle text-sm">{c.category} • {c.level || 'Level'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <RatingStars value={c.rating} />
                  </div>
                  <div className="subtle text-sm">{(c.students || 0).toLocaleString()} students</div>
                  <div style={{ marginTop: 8 }}>
                    <Button ariaLabel={`View details for ${c.title}`}>View</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-6">
            <Pagination page={page} pageSize={pageSize} total={courses.length} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}
