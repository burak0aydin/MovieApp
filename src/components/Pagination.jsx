import React from 'react';
import './Pagination.css';

function Pagination({ currentPage, totalItems, pageSize, onPageChange }) {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) {
    return null;
  }

  const goToFirst = () => onPageChange(1);
  const goToLast = () => onPageChange(totalPages);
  const goToPrev = () => onPageChange(Math.max(1, currentPage - 1));
  const goToNext = () => onPageChange(Math.min(totalPages, currentPage + 1));

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="pagination">
      <button 
        onClick={goToFirst} 
        disabled={currentPage === 1}
        className="pagination-btn"
      >
        İlk
      </button>
      
      <button 
        onClick={goToPrev} 
        disabled={currentPage === 1}
        className="pagination-btn"
      >
        Geri
      </button>

      <div className="pagination-numbers">
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="pagination-ellipsis">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <button 
        onClick={goToNext} 
        disabled={currentPage === totalPages}
        className="pagination-btn"
      >
        İleri
      </button>
      
      <button 
        onClick={goToLast} 
        disabled={currentPage === totalPages}
        className="pagination-btn"
      >
        Son
      </button>
    </div>
  );
}

export default Pagination;
