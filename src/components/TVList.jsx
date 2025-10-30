import React from 'react';
import TVCard from './TVCard';
import './TVList.css';

function TVList({ shows, onAddToWatchlist, watchlist, showEmpty = true }) {
  const isInWatchlist = (showId) => {
    return watchlist.some(item => item.id === showId);
  };

  if (shows.length === 0 && showEmpty) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🎬</div>
        <h3>Sonuç bulunamadı</h3>
        <p>Arama kriterlerinize uygun dizi bulunamadı. Lütfen farklı bir arama yapın.</p>
      </div>
    );
  }

  return (
    <div className="tv-list">
      {shows.map((show) => (
        <TVCard
          key={show.id}
          show={show}
          onAddToWatchlist={onAddToWatchlist}
          isInWatchlist={isInWatchlist(show.id)}
        />
      ))}
    </div>
  );
}

export default TVList;
