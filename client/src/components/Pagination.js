// Pagination.js
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div>
      <span>
        {pageNumbers.map((page) => (
          <button key={page} onClick={() => onPageChange(page)} className={currentPage === page ? 'active' : ''}>
            {page}
          </button>
        ))}
      </span>
    </div>
  );
};

export default Pagination;
