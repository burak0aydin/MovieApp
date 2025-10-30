import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TVCard.css';

function TVCard({ show, onAddToWatchlist, isInWatchlist }) {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    navigate(`/show/${show.id}`);
  };

  const stripHtml = (html) => {
    if (!html) return 'Açıklama bulunamadı.';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const getGenres = () => {
    if (!show.genres || show.genres.length === 0) return null;
    return show.genres.slice(0, 3);
  };

  const getRating = () => {
    return show.rating?.average || '—';
  };

  return (
    <div className="tv-card">
      <div className="tv-card-image">
        {show.image?.medium ? (
          <img src={show.image.medium} alt={show.name} />
        ) : (
          <div className="no-image">Poster Yok</div>
        )}
      </div>
      
      <div className="tv-card-content">
        <h3 className="tv-card-title">{show.name}</h3>
        
        <div className="tv-card-meta">
          {getGenres() && (
            <div className="tv-card-genres">
              {getGenres().map((genre, index) => (
                <span key={index} className="genre-badge">{genre}</span>
              ))}
            </div>
          )}
          
          <div className="tv-card-info">
            {show.language && (
              <span className="info-badge language">
                🌐 {show.language}
              </span>
            )}
            <span className="info-badge rating">
              ⭐ {getRating()}
            </span>
          </div>
        </div>

        <p className="tv-card-summary">
          {stripHtml(show.summary).substring(0, 150)}...
        </p>

        <div className="tv-card-actions">
          <button onClick={handleDetailClick} className="btn btn-detail">
            Detay
          </button>
          <button 
            onClick={() => onAddToWatchlist(show)} 
            className={`btn ${isInWatchlist ? 'btn-remove' : 'btn-add'}`}
            disabled={isInWatchlist}
          >
            {isInWatchlist ? 'Gösterime Ekle' : 'Gösterime Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TVCard;
