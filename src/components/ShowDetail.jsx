import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from './Footer';
import './ShowDetail.css';

function ShowDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchShowDetails = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const [showResponse, episodesResponse] = await Promise.all([
          axios.get(`https://api.tvmaze.com/shows/${id}`),
          axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)
        ]);

        setShow(showResponse.data);
        setEpisodes(episodesResponse.data);
      } catch (error) {
        setIsError(true);
        setErrorMessage(error.message || 'Dizi detayları yüklenirken bir hata oluştu.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShowDetails();
  }, [id]);

  const stripHtml = (html) => {
    if (!html) return 'Açıklama bulunamadı.';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const groupEpisodesBySeason = () => {
    const seasons = {};
    episodes.forEach(episode => {
      if (!seasons[episode.season]) {
        seasons[episode.season] = [];
      }
      seasons[episode.season].push(episode);
    });
    return seasons;
  };

  if (isLoading) {
    return (
      <div className="show-detail">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="show-detail">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Bir Hata Oluştu</h3>
          <p>{errorMessage}</p>
          <button onClick={() => navigate('/')} className="btn-retry">
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  if (!show) {
    return null;
  }

  const seasonEpisodes = groupEpisodesBySeason();

  return (
    <div className="show-detail">
      <header className="detail-header">
        <button onClick={() => navigate('/')} className="btn-back">
          ← Geri
        </button>
      </header>

      <div className="detail-hero">
        <div className="detail-hero-image">
          {show.image?.original ? (
            <img src={show.image.original} alt={show.name} />
          ) : (
            <div className="no-image-large">Poster Yok</div>
          )}
        </div>

        <div className="detail-hero-content">
          <h1>{show.name}</h1>
          
          <div className="detail-meta">
            {show.genres && show.genres.length > 0 && (
              <div className="detail-genres">
                {show.genres.map((genre, index) => (
                  <span key={index} className="genre-badge">{genre}</span>
                ))}
              </div>
            )}

            <div className="detail-info-grid">
              {show.language && (
                <div className="info-item">
                  <span className="info-label">Dil:</span>
                  <span className="info-value">🌐 {show.language}</span>
                </div>
              )}
              {show.rating?.average && (
                <div className="info-item">
                  <span className="info-label">Puan:</span>
                  <span className="info-value">⭐ {show.rating.average}</span>
                </div>
              )}
              {show.premiered && (
                <div className="info-item">
                  <span className="info-label">İlk Gösterim:</span>
                  <span className="info-value">📅 {show.premiered}</span>
                </div>
              )}
              {show.status && (
                <div className="info-item">
                  <span className="info-label">Durum:</span>
                  <span className="info-value">{show.status}</span>
                </div>
              )}
              {show.network?.name && (
                <div className="info-item">
                  <span className="info-label">Kanal:</span>
                  <span className="info-value">📺 {show.network.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="detail-summary">
            <h2>Özet</h2>
            <p>{stripHtml(show.summary)}</p>
          </div>
        </div>
      </div>

      <div className="detail-episodes">
        <h2>Bölümler</h2>
        
        {Object.keys(seasonEpisodes).length === 0 ? (
          <p className="no-episodes">Bölüm bilgisi bulunamadı.</p>
        ) : (
          Object.keys(seasonEpisodes).sort((a, b) => a - b).map(season => (
            <div key={season} className="season-group">
              <h3 className="season-title">S{season} · Sezon {season}</h3>
              <div className="episodes-list">
                {seasonEpisodes[season].map(episode => (
                  <div key={episode.id} className="episode-card">
                    <div className="episode-number">
                      # {episode.number}
                    </div>
                    <div className="episode-info">
                      <h4 className="episode-name">
                        S{episode.season}E{episode.number} · {episode.name || 'İsimsiz Bölüm'}
                      </h4>
                      {episode.airdate && (
                        <span className="episode-date">📅 {episode.airdate}</span>
                      )}
                      {episode.runtime && (
                        <span className="episode-runtime">⏱️ {episode.runtime} dk</span>
                      )}
                      {episode.summary && (
                        <p className="episode-summary">
                          {stripHtml(episode.summary).substring(0, 150)}...
                        </p>
                      )}
                    </div>
                    <div className="episode-action">
                      <a 
                        href={episode.url || `https://www.tvmaze.com/episodes/${episode.id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-watch"
                      >
                        Kaynak
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
}

export default ShowDetail;
