import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import axios from 'axios';

function AnimeShop() {
  const [filters, setFilters] = useState({
    priceRange: '',
    genres: [],
    sortBy: 'popular'
  });
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 9;

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  // Single useEffect to fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []); // Only fetch once when component mounts

  const filteredProducts = products
  .filter(product => product.category !== 'Manga')
  .filter(product => {
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(num => 
        num === '+' ? Infinity : Number(num)
      );
      return product.price >= min && (max === Infinity ? true : product.price <= max);
    }
    return true;
  })
  .filter(product => {
    // Updated logic for array-based genres
    if (filters.genres?.length > 0) {
      // Check if product has any of the selected genres
      return filters.genres.some(genre => 
        product.genres && product.genres.includes(genre)
      );
    }
    return true;
  })
  .sort((a, b) => {
    switch (filters.sortBy) {
      case 'popular':
        return (b.total_sold || 0) - (a.total_sold || 0);
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Anime Shop</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64">
          <FilterSidebar 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            shopType="anime" />
        </div>

        {/* Product grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {currentProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination with improved styling */}
                  {totalPages > 1 && (
                    <div className="flex justify-center space-x-2 mt-12 mb-4">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-md shadow ${
                          currentPage === 1 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-primary text-white hover:bg-opacity-90'
                        }`}
                      >
                        Previous
                      </button>
                      
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => handlePageChange(index + 1)}
                          className={`w-10 h-10 flex items-center justify-center rounded-md shadow ${
                            currentPage === index + 1
                              ? 'bg-primary text-white'
                              : 'bg-white hover:bg-gray-100'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-md shadow ${
                          currentPage === totalPages 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-primary text-white hover:bg-opacity-90'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* Empty state for no products */
                <div className="text-center py-16 bg-gray-50 rounded-xl">
                  <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your filters or check back later.</p>
                  <button 
                    onClick={() => handleFilterChange('genres', [])} 
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnimeShop;