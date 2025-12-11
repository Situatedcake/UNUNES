import React, { useState } from 'react';

export const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="gradient-border w-80 h-20">
      <input
        type="text"
        placeholder="Поиск в Каталоге.."
        value={query}
        onChange={handleSearch}
        className="h-20 w-full py-5 pl-14 text-white placeholder-white/60 bg-transparent border-none outline-none"
      />
    </div>
  );
};
