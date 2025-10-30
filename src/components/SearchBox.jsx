import React, { useState, useEffect } from 'react';
import './SearchBox.css';

function SearchBox({ query, onSearch, onReset }) {
  const [searchValue, setSearchValue] = useState(query);

  // query prop'u değiştiğinde input'u güncelle
  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  const handleReset = () => {
    setSearchValue('');
    onReset();
  };

  return (
    <div className="search-box">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Dizi ara... (örn: star, batman)"
          className="search-input"
        />
        <button type="submit" className="search-button">
          Ara
        </button>
        <button type="button" onClick={handleReset} className="reset-button">
          Sıfırla
        </button>
      </form>
    </div>
  );
}

export default SearchBox;
