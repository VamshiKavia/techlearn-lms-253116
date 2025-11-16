import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import RatingStars from '../../components/ui/RatingStars';
import EmptyState from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { mockCourses, mockUserProfile, getRecommendedCourses } from '../../services/mockData';
import '../../styles/theme.css';

/**
 * PUBLIC_INTERFACE
 * Student course catalog with advanced filters, sorting, saved searches (mock), and recommendations.
 * No backend calls; all data is mocked.
 */
export default function StudentCatalog() {
  const CATEGORIES = ['All', 'Full-Stack', 'Data Science', 'Cloud', 'DevOps', 'Software Testing', 'AI'];
  const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const DURATION = ['All', '0-2h', '2-10h', '10h+'];
  const RATINGS = ['All', '4.0+', '4.5+'];
  const SORTS = ['Relevance', 'Newest', 'Highest Rated'];

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Filters
  const [activeCategory, setActiveCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [duration, setDuration] = useState('All');
  const [rating, setRating] = useState('All');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('Relevance');

  // Saved searches (mock local state)
  const [savedSearches, setSavedSearches] = useState([]);

  // Aggregate all tags from mock data
  const allTags = useMemo(() => {
    const set = new Set();
    mockCourses.forEach(c => (c.tags || []).forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, []);

  // Recompute filtered items
  const filteredCourses = useMemo(() => {
    let list = [...mockCourses];

    // Category
    if (activeCategory !== 'All') {
      list = list.filter(c => c.category === activeCategory);
    }
    // Level
    if (level !== 'All') {
      list = list.filter(c => (c.level || '').toLowerCase() === level.toLowerCase());
    }
    // Duration
    const toMinutesRange = (bucket) => {
      if (bucket === '0-2h') return [0, 120];
      if (bucket === '2-10h') return [120, 600];
      if (bucket === '10h+') return [600, Infinity];
      return null;
    };
    if (duration !== 'All') {
      const range = toMinutesRange(duration);
      list = list.filter(c => {
        const d = Number(c.durationMinutes || 0);
        return d >= range[0] && d < range[1];
      });
    }
    // Rating
    if (rating === '4.0+') list = list.filter(c => (c.rating || 0) >= 4.0);
    if (rating === '4.5+') list = list.filter(c => (c.rating || 0) >= 4.5);

    // Tags (AND semantics)
    if (selectedTags.length > 0) {
      list = list.filter(c => {
        const tags = c.tags || [];
        return selectedTags.every(t => tags.includes(t));
      });
    }

    // Sorting
    if (sortBy === 'Highest Rated') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'Newest') {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else {
      // Relevance: boost courses matching user profile interests/categories
      const user = mockUserProfile;
      list.sort((a, b) => {
        const aScore =
          (user.enrolledCategories.includes(a.category) ? 2 : 0) +
          ((a.tags || []).filter(t => user.interests.includes(t)).length);
        const bScore =
          (user.enrolledCategories.includes(b.category) ? 2 : 0) +
          ((b.tags || []).filter(t => user.interests.includes(t)).length);
        return bScore - aScore;
      });
    }

    return list;
  }, [activeCategory, level, duration, rating, selectedTags, sortBy]);

  // Loading simulation on filter changes
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [activeCategory, level, duration, rating, selectedTags, sortBy]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [activeCategory, level, duration, rating, selectedTags, sortBy]);

  const pageSize = 6;
  const pageItems = filteredCourses.slice((page - 1) * pageSize, page * pageSize);

  const toggleTag = (t) => {
    setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : prev.concat(t));
  };

  const saveSearch = () => {
    const saved = {
      id: `s_${Date.now()}`,
      label: `${activeCategory} • ${level} • ${duration} • ${rating} • ${sortBy} • ${selectedTags.join(',')}`,
      state: { activeCategory, level, duration, rating, selectedTags, sortBy },
    };
    setSavedSearches(prev => [saved, ...prev].slice(0, 5));
  };

  const applySaved = (s) => {
    setActiveCategory(s.state.activeCategory);
    setLevel(s.state.level);
    setDuration(s.state.duration);
    setRating(s.state.rating);
    setSelectedTags(s.state.selectedTags);
    setSortBy(s.state.sortBy);
  };

  const clearAll = () => {
    setActiveCategory('All');
    setLevel('All');
    setDuration('All');
    setRating('All');
    setSelectedTags([]);
    setSortBy('Relevance');
  };

  const recommendations = useMemo(() => getRecommendedCourses(mockUserProfile, mockCourses, 8), []);

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

      <Card>
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <label className="subtle" htmlFor="level-select">Level</label>
            {LEVELS.map(l => (
              <Button
                key={l}
                ariaLabel={`Level ${l}`}
                variant={level === l ? 'primary' : 'secondary'}
                onClick={() => setLevel(l)}
              >
                {l}
              </Button>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <label className="subtle" htmlFor="duration-select">Duration</label>
            {DURATION.map(d => (
              <Button
                key={d}
                ariaLabel={`Duration ${d}`}
                variant={duration === d ? 'primary' : 'secondary'}
                onClick={() => setDuration(d)}
              >
                {d}
              </Button>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <label className="subtle" htmlFor="rating-select">Ratings</label>
            {RATINGS.map(r => (
              <Button
                key={r}
                ariaLabel={`Rating ${r}`}
                variant={rating === r ? 'primary' : 'secondary'}
                onClick={() => setRating(r)}
              >
                {r}
              </Button>
            ))}
          </div>

          <div>
            <div className="subtle" style={{ marginBottom: 6 }}>Tags / Prerequisites</div>
            <div role="listbox" aria-label="Tags" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {allTags.map(t => (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  aria-pressed={selectedTags.includes(t)}
                  aria-label={`Tag ${t}`}
                  className={`btn ${selectedTags.includes(t) ? '' : 'secondary'}`}
                  style={{ padding: '6px 10px', fontSize: 12 }}
                  type="button"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
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
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="secondary" ariaLabel="Clear all filters" onClick={clearAll}>Clear</Button>
              <Button ariaLabel="Save this search" onClick={saveSearch}>Save this search</Button>
            </div>
          </div>

          {savedSearches.length > 0 && (
            <div>
              <div className="subtle" style={{ marginBottom: 6 }}>Saved searches</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {savedSearches.map(s => (
                  <Button key={s.id} variant="ghost" ariaLabel={`Apply saved search ${s.label}`} onClick={() => applySaved(s)}>
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div style={{ display: 'grid', gap: 8 }}>
          <div className="h3">Recommended for you</div>
          <div className="subtle" style={{ fontSize: 12 }}>Based on your enrolled categories and interests</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {recommendations.map((c) => (
              <Card key={`rec-${c.id}`} role="article">
                <div style={{ display: 'grid', gap: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{c.title}</div>
                  <div className="subtle" style={{ fontSize: 12 }}>{c.category} • {c.level}</div>
                  <RatingStars value={c.rating} size={12} />
                </div>
              </Card>
            ))}
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
          description="Try adjusting filters or check back later."
          actionLabel="Reset filters"
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
                    {(Math.round((c.durationMinutes || 0) / 60 * 10) / 10)}h • {(c.tags || []).slice(0,3).join(', ')}
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
