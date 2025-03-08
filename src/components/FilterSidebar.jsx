import { useEffect, useState } from 'react';

function FilterSidebar({ filters, onFilterChange, shopType }) {
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

  const genres = shopType === 'anime' 
    ? [...baseGenres, 'Anime']
    : baseGenres;

  const handleReset = () => {
    onFilterChange('priceRange', '');
    onFilterChange('genres', []);
    onFilterChange('sortBy', 'popular');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-card sticky top-24">
      {/* Header and reset button */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-dark">Filters</h3>
        <button
          onClick={handleReset}
          className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors shadow"
        >
          Reset Filters
        </button>
      </div>
      
      {/* Price Range filter */}
      <div className="mb-8">
        <h4 className="font-medium mb-3 text-dark">Price Range</h4>
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
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

      {/* Genres filter */}
      <div className="mb-8">
        <h4 className="font-medium mb-3 text-dark">Genres</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {genres.map(genre => (
            <label key={genre} className="flex items-center p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
                checked={filters.genres?.includes(genre)}
                onChange={(e) => {
                  const newGenres = e.target.checked
                    ? [...(filters.genres || []), genre]
                    : (filters.genres || []).filter(g => g !== genre);
                  onFilterChange('genres', newGenres);
                }}
              />
              <span className="ml-2 text-gray-700">{genre}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-dark">Sort By</h4>
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
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


// Shop.jsx (or wherever you're handling the products)
function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: '',
    genres: [],
    sortBy: 'popular'
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(num => 
        num === '+' ? Infinity : Number(num)
      );
      filtered = filtered.filter(product => 
        product.price >= min && (max === Infinity ? true : product.price <= max)
      );
    }

    // Filter by genres
    if (filters.genres.length > 0) {
      filtered = filtered.filter(product => {
        // Check if product has any of the selected genres
        return filters.genres.some(genre => 
          product.genres && product.genres.includes(genre)
        );
      });
    }

    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      // Add more sorting options as needed
      default:
        // 'popular' or default sorting
        break;
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-6">
        <div className="w-64 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            shopType="anime"
          />
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterSidebar;