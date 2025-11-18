import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseCard } from '../../components/common/CourseCard';
import { FilterChips } from '../../components/common/FilterChips';
import { SearchInput } from '../../components/common/SearchInput';
import { catalogCourses } from '../../shared/mocks/catalogCourses';

/**
 * PUBLIC_INTERFACE
 * CatalogPage: course list with filters and search (mock data)
 */
export function CatalogPage() {
  const navigate = useNavigate();
  const categories = ['All', 'Full Stack', 'Data Science', 'Cloud', 'DevOps', 'Software Testing', 'AI'];
  const [category, setCategory] = useState('All');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return catalogCourses.filter((c) => {
      const catMatch = category === 'All' || c.category === category;
      const qMatch = !ql || c.title.toLowerCase().includes(ql);
      return catMatch && qMatch;
    });
  }, [category, q]);

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1>Catalog</h1>
          <div className="subtitle">Explore courses across technology categories.</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <SearchInput value={q} onChange={setQ} />
        </div>
      </div>

      <FilterChips options={categories} value={category} onChange={setCategory} />

      <section className="courseGrid">
        {filtered.map((c) => (
          <CourseCard
            key={c.id}
            title={c.title}
            rating={c.rating}
            students={c.students}
            duration={c.duration}
            onView={() => {
              const slug = (c.category || 'all').toLowerCase().replace(/\s+/g, '-');
              navigate(`/catalog/${slug}`);
            }}
          />
        ))}
      </section>
    </div>
  );
}
