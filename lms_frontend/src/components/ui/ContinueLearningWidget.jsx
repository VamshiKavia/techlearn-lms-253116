import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import Button from './Button';
import ProgressBar from './ProgressBar';
import RatingStars from './RatingStars';

// PUBLIC_INTERFACE
export default function ContinueLearningWidget({ items }) {
  /** Displays "Continue Learning" cards for enrolled courses with next lesson. */
  if (!items || items.length === 0) {
    return (
      <Card
        role="region"
        aria-label="Continue learning empty state"
        className="bg-white rounded-lg border border-gray-200 p-4"
      >
        <div className="text-sm text-gray-500">No courses in progress yet.</div>
      </Card>
    );
  }

  return (
    <div
      className="grid md:grid-cols-2 gap-4"
      role="region"
      aria-label="Continue learning"
    >
      {items.map((it) => (
        <Card
          key={it.courseId}
          className="bg-white rounded-lg border border-gray-200 p-4 focus-within:ring-2 focus-within:ring-gray-400"
          tabIndex={-1}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-800" aria-label={`Course ${it.courseTitle}`}>
              {it.courseTitle}
            </h3>
            <div className="ml-2">
              <RatingStars rating={4} aria-label="Course rating" />
            </div>
          </div>
          <div className="text-xs text-gray-600 mb-2">
            Next lesson: {it.nextLesson?.title || 'Completed'}
          </div>
          <ProgressBar value={it.progress} aria-label={`Progress ${it.progress}%`} />
          <div className="mt-3">
            {it.nextLesson ? (
              <Link
                to={`/student/lesson/${it.nextLesson.id}`}
                aria-label={`Resume ${it.nextLesson.title}`}
              >
                <Button variant="primary" className="px-3 py-1">
                  Resume
                </Button>
              </Link>
            ) : (
              <span className="text-xs text-gray-500">All lessons completed</span>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
