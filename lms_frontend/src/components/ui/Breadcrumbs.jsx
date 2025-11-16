import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Breadcrumbs with ARIA nav landmark and keyboard focus styles.
 */
const Breadcrumbs = ({ items = [], ...rest }) => {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs mb-4" role="navigation" {...rest}>
      {items.map((it, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={idx} className="inline-flex items-center">
            {idx > 0 && <span aria-hidden="true" className="mx-2">/</span>}
            {isLast ? (
              <span aria-current="page">{it.label}</span>
            ) : (
              <Link to={it.to} className="hover:underline focus:outline-none focus:ring-2 focus:ring-gray-400">
                {it.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
