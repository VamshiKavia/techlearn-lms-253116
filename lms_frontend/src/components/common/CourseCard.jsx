import React from 'react';
import { StarRating } from './StarRating';

/**
 * PUBLIC_INTERFACE
 * CourseCard: Displays course info and CTA
 * Ensures shared premium card animations by using `.card` / `[data-card]`
 * and reveal utility class. No changes to props or logic.
 * @param {object} props
 * @param {string} props.title
 * @param {number} props.rating
 * @param {number} props.students
 * @param {string} props.duration
 * @param {() => void} props.onView
 */
export function CourseCard({ title, rating, students, duration, onView }) {
  return (
    <div className="card card--interactive courseCard reveal-on-appear revealed" data-card role="article" aria-label="Course card">
      <div className="courseTitle">{title}</div>
      <div className="metaRow">
        <StarRating value={rating} />
        <span>{(students ?? 0).toLocaleString()} students</span>
        <span>•</span>
        <span>{duration}</span>
      </div>
      <button
        className="btn btn-primary viewBtn"
        onClick={onView}
        aria-label={`View ${title}`}
        style={{ alignSelf: 'flex-start' }}
      >
        View
      </button>
    </div>
  );
}
