import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import axios from 'axios';

function MangaShop() {
  const [filters, setFilters] = useState({
    priceRange: '',
    categories: [],
    sortBy: 'popular'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Number of products per page

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Erro ao buscar os produtos:', error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter(product => product.category == 'Manga')
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
      if (filters.categories?.length > 0) {
        return filters.categories.includes(product.category);
      }
      return true;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-dark mb-8">Manga Shop</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64">
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination controls */}
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
        </div>
      </div>
    </div>
  );
}

export default MangaShop;