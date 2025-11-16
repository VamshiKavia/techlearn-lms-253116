import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';
import EmptyState from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import '../../styles/theme.css';

/**
 * PUBLIC_INTERFACE
 * My Learning page with skeletons and empty state.
 */
export default function StudentMyLearning() {
  const [items, setItems] = useState(null); // null => loading

  useEffect(() => {
    const t = setTimeout(() => setItems([{ id: 1, title: 'Full-Stack React & Node.js', progress: 32 }]), 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <h1 className="h1 mb-4">My Learning</h1>
      {items === null ? (
        <>
          <Skeleton height={68} className="mb-2" />
          <Skeleton height={68} className="mb-2" />
        </>
      ) : items.length === 0 ? (
        <EmptyState
          title="No enrollments yet"
          description="Browse the catalog and start your first course."
          actionLabel="Go to Catalog"
          onAction={() => (window.location.href = '/student/catalog')}
        />
      ) : (
        <div className="grid gap-3">
          {items.map(i => (
            <Card key={i.id}>
              <div className="font-semibold mb-2">{i.title}</div>
              <ProgressBar value={i.progress} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
