import React, { useEffect, useMemo, useState } from 'react';
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
 * Minimal student course catalog: category filter, search, simple sort (Newest/Rating), and pagination.
 * No backend calls; all data is mocked.
 */
export default function StudentCatalog() {
  const CATEGORIES = ['All', 'Full-Stack', 'Data Science', 'Cloud', 'DevOps', 'Software Testing', 'AI'];
  const SORTS = ['Newest', 'Highest Rated'];

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [query, setQuery] = useState('');

  // Compute filtered items (category + search + simple sort)
  const filteredCourses = useMemo(() => {
    let list = [...mockCourses];

    if (activeCategory !== 'All') {
      list = list.filter(c => c.category === activeCategory);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(c =>
        (c.title || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q)
      );
    }

    if (sortBy === 'Highest Rated') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // Newest
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return list;
  }, [activeCategory, sortBy, query]);

  // Loading simulation on filter changes
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, [activeCategory, sortBy, query]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [activeCategory, sortBy, query]);

  const pageSize = 8;
  const pageItems = filteredCourses.slice((page - 1) * pageSize, page * pageSize);

  const clearAll = () => {
    setActiveCategory('All');
    setSortBy('Newest');
    setQuery('');
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="h1">Catalog</h1>
        <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Course categories">
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

      <Card>
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <label htmlFor="catalog-search" className="subtle">Search</label>
            <input
              id="catalog-search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search courses..."
              className="input"
              aria-label="Search courses"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="subtle">Sort</span>
            {SORTS.map(s => (
              <Button
                key={s}
                ariaLabel={`Sort by ${s}`}
                variant={sortBy === s ? 'primary' : 'secondary'}
                onClick={() => setSortBy(s)}
              >
                {s}
              </Button>
            ))}
            <Button variant="secondary" ariaLabel="Clear all" onClick={clearAll}>Clear</Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" aria-live="polite">
          {Array.from({ length: 6 }).map((_, idx) => <CardSkeleton key={idx} />)}
        </div>
      ) : filteredCourses.length === 0 ? (
        <EmptyState
          title="No courses found"
          description="Try another keyword or category."
          actionLabel="Reset"
          onAction={clearAll}
        />
      ) : (
        <>
          <div aria-label="catalog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {pageItems.map((c) => (
              <Card key={c.id} role="article">
                <div style={{ display: 'grid', gap: 8 }}>
                  <div style={{ fontWeight: 700 }}>{c.title}</div>
                  <div className="subtle text-sm">{c.category} • {c.level || 'Level'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <RatingStars value={c.rating} />
                  </div>
                  <div className="subtle text-sm">{(c.students || 0).toLocaleString()} students</div>
                  <div className="subtle text-sm">
                    {(Math.round((c.durationMinutes || 0) / 60 * 10) / 10)}h
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Button ariaLabel={`View details for ${c.title}`}>View</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-6">
            <Pagination page={page} pageSize={pageSize} total={filteredCourses.length} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}
