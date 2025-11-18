import React from 'react';
import { StarRating } from './StarRating';

/**
 * PUBLIC_INTERFACE
 * CourseCard: Displays course info and CTA
 * @param {object} props
 * @param {string} props.title
 * @param {number} props.rating
 * @param {number} props.students
 * @param {string} props.duration
 * @param {() => void} props.onView
 */
export function CourseCard({ title, rating, students, duration, onView }) {
  return (
    <div className="card card--interactive courseCard" data-card role="article">
      <div className="courseTitle">{title}</div>
      <div className="metaRow">
        <StarRating value={rating} />
        <span>{students.toLocaleString()} students</span>
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
      <div style={{
        height: '2px',
        background: 'linear-gradient(90deg, var(--neon-primary), var(--neon-accent))',
        opacity: 0.9,
        marginTop: '0.75rem',
        borderRadius: '2px'
      }} />
    </div>
  );
}
