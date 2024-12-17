function FilterSidebar({ filters, onFilterChange, shopType }) {
  // Lista base de gêneros
  const baseGenres = [
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Fantasy',
    'Romance',
    'Sci-Fi',
    'Slice of Life',
    'Horror',
    'Sports',
    'Game',
    'Other'
  ];

  // Adiciona 'Anime' apenas se for a animeShop
  const genres = shopType === 'anime' 
    ? [...baseGenres, 'Anime']
    : baseGenres;

  // Função para resetar todos os filtros
  const handleReset = () => {
    onFilterChange('priceRange', '');
    onFilterChange('genres', []);
    onFilterChange('sortBy', 'popular');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={handleReset}
          className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
        >
          Reset Filters
        </button>
      </div>
      
      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Price Range</h4>
        <select
          className="w-full p-2 border rounded-md"
          onChange={(e) => onFilterChange('priceRange', e.target.value)}
          value={filters.priceRange}
        >
          <option value="">All Prices</option>
          <option value="0-25">$0 - $25</option>
          <option value="25-50">$25 - $50</option>
          <option value="50-100">$50 - $100</option>
          <option value="100+">$100+</option>
        </select>
      </div>

      {/* Genre */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Genres</h4>
        <div className="space-y-2">
          {genres.map(genre => (
            <label key={genre} className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-primary"
                checked={filters.genres?.includes(genre)}
                onChange={(e) => {
                  const newGenres = e.target.checked
                    ? [...(filters.genres || []), genre]
                    : (filters.genres || []).filter(g => g !== genre);
                  onFilterChange('genres', newGenres);
                }}
              />
              <span className="ml-2">{genre}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Sort By</h4>
        <select
          className="w-full p-2 border rounded-md"
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
          value={filters.sortBy}
        >
          <option value="popular">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}

export default FilterSidebar;