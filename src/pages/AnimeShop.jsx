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
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (max) {
          return product.price >= min && product.price <= max;
        } else {
          return product.price >= min;
        }
      }
      return true;
    })
    .filter(product => {
      // Lógica corrigida para trabalhar com genre único
      if (filters.genres?.length > 0) {
        // Verifica se o gênero do produto está entre os selecionados
        return filters.genres.includes(product.genre);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-dark mb-8">Anime Shop</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64">
          <FilterSidebar 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          shopType="anime" />
        </div>
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <span className="text-lg">Loading...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center space-x-2 mt-8 mb-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded ${
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
                      className={`px-4 py-2 rounded ${
                        currentPage === index + 1
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded ${
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
          )}
        </div>
      </div>
    </div>
  );
}

export default AnimeShop;