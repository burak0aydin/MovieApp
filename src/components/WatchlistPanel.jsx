import React from 'react';
import './WatchlistPanel.css';

function WatchlistPanel({ watchlist, onRemove, onClear }) {
  return (
    <div className="watchlist-panel">
      <div className="watchlist-header">
        <h2>Gösterime Girecekler ({watchlist.length})</h2>
        {watchlist.length > 0 && (
          <button onClick={onClear} className="btn-clear">
            Listeyi Temizle
          </button>
        )}
      </div>

      {watchlist.length === 0 ? (
        <div className="watchlist-empty">
          <p>Listeye eklenmiş yapım yok.</p>
        </div>
      ) : (
        <div className="watchlist-items">
          {watchlist.map((show) => (
            <div key={show.id} className="watchlist-item">
              <div className="watchlist-item-image">
                {show.image?.medium ? (
                  <img src={show.image.medium} alt={show.name} />
                ) : (
                  <div className="no-image-small">?</div>
                )}
              </div>
              <div className="watchlist-item-info">
                <h4>{show.name}</h4>
                <div className="watchlist-item-meta">
                  {show.genres && show.genres[0] && (
                    <span className="genre-small">{show.genres[0]}</span>
                  )}
                  {show.rating?.average && (
                    <span className="rating-small">⭐ {show.rating.average}</span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => onRemove(show.id)} 
                className="btn-remove-item"
                title="Listeden çıkar"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WatchlistPanel;
