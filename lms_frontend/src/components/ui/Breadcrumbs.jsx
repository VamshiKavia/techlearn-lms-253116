import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Breadcrumbs with ARIA nav landmark.
 */
const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs mb-4">
      {items.map((it, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={idx} className="flex items-center">
            {idx > 0 && <span aria-hidden="true" className="mx-2">/</span>}
            {isLast ? (
              <a aria-current="page" href={it.to || '#'} onClick={(e)=>e.preventDefault()}>{it.label}</a>
            ) : (
              <Link to={it.to} className="hover:underline">{it.label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
