import React, { useReducer, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import SearchBox from './SearchBox';
import Filters from './Filters';
import TVList from './TVList';
import WatchlistPanel from './WatchlistPanel';
import Pagination from './Pagination';
import Footer from './Footer';
import { 
  showsReducer, 
  initialState,
  FETCH_INIT,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  SET_QUERY,
  SET_FILTERS,
  ADD_WATCHLIST,
  REMOVE_WATCHLIST,
  CLEAR_WATCHLIST,
  SET_PAGE,
  LOAD_MORE_INIT,
  LOAD_MORE_SUCCESS,
  LOAD_MORE_FAILURE,
  SET_WATCHLIST,
  APPLY_FILTERS
} from '../reducer';
import './Home.css';

function Home() {
  const [state, dispatch] = useReducer(showsReducer, initialState);
  const observerTarget = useRef(null);
  const isInitialMount = useRef(true);
  const isFetchingRef = useRef(false);

  // LocalStorage'dan watchlist'i yükle
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) {
      try {
        const watchlist = JSON.parse(savedWatchlist);
        dispatch({ type: SET_WATCHLIST, payload: watchlist });
      } catch (error) {
        console.error('Watchlist yüklenirken hata:', error);
      }
    }
  }, []);

  // Watchlist değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (!isInitialMount.current) {
      localStorage.setItem('watchlist', JSON.stringify(state.watchlist));
    } else {
      isInitialMount.current = false;
    }
  }, [state.watchlist]);

  // Rastgele diziler için show ID'leri
  const fetchRandomShows = useCallback(async () => {
    // Eğer zaten fetching yapılıyorsa, return et
    if (isFetchingRef.current) {
      return;
    }
    
    isFetchingRef.current = true;
    dispatch({ type: LOAD_MORE_INIT });
    
    try {
      // TVMaze'de show ID'leri 1'den başlıyor, rastgele ID'ler seç
      const randomIds = [];
      const startId = state.currentShowPage * 20;
      for (let i = 0; i < 20; i++) {
        randomIds.push(startId + i + 1);
      }

      const promises = randomIds.map(id => 
        axios.get(`https://api.tvmaze.com/shows/${id}`).catch(() => null)
      );
      
      const results = await Promise.all(promises);
      const shows = results.filter(result => result !== null).map(result => result.data);
      
      dispatch({ 
        type: LOAD_MORE_SUCCESS, 
        payload: { 
          shows, 
          page: state.currentShowPage + 1 
        } 
      });
    } catch (error) {
      dispatch({ 
        type: LOAD_MORE_FAILURE, 
        payload: error.message || 'Diziler yüklenirken bir hata oluştu!' 
      });
    } finally {
      isFetchingRef.current = false;
    }
  }, [state.currentShowPage]);

  // Fetch shows from API
  useEffect(() => {
    const fetchShows = async () => {
      dispatch({ type: FETCH_INIT });
      
      try {
        const result = await axios.get(
          `https://api.tvmaze.com/search/shows?q=${state.query}`
        );
        
        const shows = result.data.map(item => item.show);
        dispatch({ type: FETCH_SUCCESS, payload: shows });
      } catch (error) {
        dispatch({ 
          type: FETCH_FAILURE, 
          payload: error.message || 'Bir hata oluştu!' 
        });
      }
    };

    if (state.query) {
      fetchShows();
    }
  }, [state.query]);

  // İlk yükleme - rastgele diziler göster
  useEffect(() => {
    if (!state.query && state.shows.length === 0 && !state.isLoading && !state.isLoadingMore) {
      fetchRandomShows();
    }
  }, [state.query, state.shows.length, state.isLoading, state.isLoadingMore, fetchRandomShows]);

  // Infinite scroll için IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !state.isLoadingMore && state.hasMore && !state.query) {
          fetchRandomShows();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [state.isLoadingMore, state.hasMore, state.query, fetchRandomShows]);

  // Filter shows - appliedFilters kullan
  const getFilteredShows = () => {
    let filtered = [...state.shows];

    if (state.appliedFilters.genre) {
      filtered = filtered.filter(show => 
        show.genres && show.genres.includes(state.appliedFilters.genre)
      );
    }

    if (state.appliedFilters.language) {
      filtered = filtered.filter(show => 
        show.language === state.appliedFilters.language
      );
    }

    if (state.appliedFilters.minRating > 0) {
      filtered = filtered.filter(show => 
        show.rating?.average && show.rating.average >= state.appliedFilters.minRating
      );
    }

    // Puanı en yüksekten en düşüğe sırala
    filtered.sort((a, b) => {
      const ratingA = a.rating?.average || 0;
      const ratingB = b.rating?.average || 0;
      return ratingB - ratingA;
    });

    return filtered;
  };

  // Pagination
  const getPaginatedShows = () => {
    const filtered = getFilteredShows();
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const endIndex = startIndex + state.pageSize;
    return filtered.slice(startIndex, endIndex);
  };

  const handleSearch = (query) => {
    // Ara butonuna basıldığında hem query'yi set et hem filtreleri uygula
    dispatch({ type: SET_QUERY, payload: query });
    dispatch({ type: APPLY_FILTERS });
  };

  const handleReset = () => {
    // Tüm state'i sıfırla
    dispatch({ type: SET_QUERY, payload: '' });
    dispatch({ type: SET_FILTERS, payload: { genre: '', language: '', minRating: 0 } });
    dispatch({ type: APPLY_FILTERS });
    dispatch({ type: FETCH_SUCCESS, payload: [] });
    // Yeni rastgele diziler yükle
    setTimeout(() => {
      fetchRandomShows();
    }, 100);
  };

  const handleFilterChange = (newFilters) => {
    // Sadece filter state'ini güncelle, uygulamaz
    dispatch({ type: SET_FILTERS, payload: newFilters });
  };

  const handleApplyFilters = () => {
    // Filtreleri uygula
    dispatch({ type: APPLY_FILTERS });
  };

  const handleAddToWatchlist = (show) => {
    dispatch({ type: ADD_WATCHLIST, payload: show });
  };

  const handleRemoveFromWatchlist = (showId) => {
    dispatch({ type: REMOVE_WATCHLIST, payload: showId });
  };

  const handleClearWatchlist = () => {
    dispatch({ type: CLEAR_WATCHLIST });
  };

  const handlePageChange = (page) => {
    dispatch({ type: SET_PAGE, payload: page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    dispatch({ type: SET_QUERY, payload: state.query });
  };

  const filteredShows = getFilteredShows();
  const paginatedShows = getPaginatedShows();

  // Arama modu mu yoksa rastgele mod mu?
  const isSearchMode = state.query !== '';
  
  // Filtre aktif mi kontrolü - appliedFilters kullan
  const hasActiveFilters = state.appliedFilters.genre || state.appliedFilters.language || state.appliedFilters.minRating > 0;

  return (
    <div className="home">
      <header className="header">
        <div className="header-content">
          <h1>🎬 Kampüs Film Kulübü</h1>
          <p className="header-subtitle">Ana Sayfa</p>
        </div>
      </header>

      <div className="container">
        <div className="main-content">
          <div className="controls">
            <SearchBox query={state.query} onSearch={handleSearch} onReset={handleReset} />
            <Filters filters={state.filters} onFilterChange={handleFilterChange} onApplyFilters={handleApplyFilters} />
          </div>

          {state.isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Diziler yükleniyor...</p>
            </div>
          ) : state.isError ? (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <h3>Bir Hata Oluştu</h3>
              <p>{state.errorMessage}</p>
              <button onClick={handleRetry} className="btn-retry">
                Tekrar Dene
              </button>
            </div>
          ) : (
            <>
              {/* Arama modu */}
              {isSearchMode ? (
                <>
                  {filteredShows.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">🎬</div>
                      <h3>Sonuç bulunamadı</h3>
                      <p>Arama kriterlerinize uygun dizi bulunamadı. Lütfen farklı bir arama yapın.</p>
                    </div>
                  ) : (
                    <>
                      <TVList 
                        shows={paginatedShows} 
                        onAddToWatchlist={handleAddToWatchlist}
                        watchlist={state.watchlist}
                      />
                      
                      <Pagination
                        currentPage={state.currentPage}
                        totalItems={filteredShows.length}
                        pageSize={state.pageSize}
                        onPageChange={handlePageChange}
                      />
                    </>
                  )}
                </>
              ) : (
                /* Rastgele mod - Infinite scroll veya Filtrelenmiş */
                <>
                  {filteredShows.length === 0 && hasActiveFilters ? (
                    <div className="empty-state">
                      <div className="empty-icon">🔍</div>
                      <h3>Filtre Sonucu Bulunamadı</h3>
                      <p>Seçtiğiniz filtrelere uygun dizi bulunamadı. Lütfen filtre seçimlerinizi değiştirin.</p>
                    </div>
                  ) : (
                    <>
                      <TVList 
                        shows={filteredShows} 
                        onAddToWatchlist={handleAddToWatchlist}
                        watchlist={state.watchlist}
                      />
                      
                      {/* Infinite scroll için observer target - sadece filtre yoksa */}
                      {!hasActiveFilters && (
                        <div ref={observerTarget} className="observer-target">
                          {state.isLoadingMore && (
                            <div className="loading-more">
                              <div className="spinner-small"></div>
                              <p>Daha fazla dizi yükleniyor...</p>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>

        <aside className="sidebar">
          <WatchlistPanel
            watchlist={state.watchlist}
            onRemove={handleRemoveFromWatchlist}
            onClear={handleClearWatchlist}
          />
        </aside>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
