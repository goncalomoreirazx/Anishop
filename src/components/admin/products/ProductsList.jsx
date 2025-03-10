import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaSearch, FaFilter, FaSortAmountDown, FaPercent, FaTag, FaTimes } from 'react-icons/fa';

const ProductsList = forwardRef(({ onEdit }, ref) => {
  // States for managing products list and pagination
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('id-desc');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [isRemovingDiscount, setIsRemovingDiscount] = useState(false);
  const [discountSuccess, setDiscountSuccess] = useState('');
  const itemsPerPage = 10;

  // Expose fetchProducts to parent components
  useImperativeHandle(ref, () => ({
    fetchProducts,
  }));

  // Function to fetch products from API
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
      setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Unable to load products.');
      setIsLoading(false);
    }
  };

  // Load products when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to delete product with confirmation
  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    
    if (!confirmDelete) return;

    try {
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };
  
      await axios.delete(`http://localhost:5000/api/products/${productId}`, { headers });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
  
      if (error.response?.status === 403) {
        alert('Permission error');
      } else {
        alert('Failed to delete product.');
      }
    }
  };

  // Function to handle product selection
  const handleSelectProduct = (productId) => {
    setSelectedProducts(prevSelected => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter(id => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  };

  // Function to select/deselect all visible products
  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      const visibleProductIds = currentProducts.map(product => product.id);
      setSelectedProducts(prevSelected => {
        const newSelection = [...prevSelected];
        visibleProductIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    } else {
      const visibleProductIds = currentProducts.map(product => product.id);
      setSelectedProducts(prevSelected => 
        prevSelected.filter(id => !visibleProductIds.includes(id))
      );
    }
  };

  // Function to apply discount to selected products
  const applyDiscountToSelected = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select at least one product');
      return;
    }

    if (!discountPercentage || isNaN(parseFloat(discountPercentage))) {
      alert('Please enter a valid discount percentage');
      return;
    }

    const percentage = parseFloat(discountPercentage);
    if (percentage < 0 || percentage > 100) {
      alert('Discount percentage must be between 0 and 100');
      return;
    }

    try {
      setIsApplyingDiscount(true);
      const response = await axios.post(
        'http://localhost:5000/api/products/discounts/apply',
        {
          productIds: selectedProducts,
          discountPercentage: percentage
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setDiscountSuccess(`Successfully applied ${percentage}% discount to ${response.data.affectedProducts} products!`);
      setTimeout(() => setDiscountSuccess(''), 3000);
      
      // Clear selection and fetch updated products
      setSelectedProducts([]);
      setDiscountPercentage('');
      fetchProducts();
    } catch (error) {
      console.error('Error applying discount:', error);
      alert('Failed to apply discount');
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  // Function to remove discounts from selected products
  const removeDiscountsFromSelected = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select at least one product');
      return;
    }

    try {
      setIsRemovingDiscount(true);
      const response = await axios.post(
        'http://localhost:5000/api/products/discounts/remove',
        {
          productIds: selectedProducts
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setDiscountSuccess(`Successfully removed discounts from ${response.data.affectedProducts} products!`);
      setTimeout(() => setDiscountSuccess(''), 3000);
      
      // Clear selection and fetch updated products
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      console.error('Error removing discounts:', error);
      alert('Failed to remove discounts');
    } finally {
      setIsRemovingDiscount(false);
    }
  };

  // Function to clear selected products
  const clearSelection = () => {
    setSelectedProducts([]);
  };

  // Function to change page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Get unique categories for filter dropdown
  const categories = [...new Set(products.map(product => product.category).filter(Boolean))];

  // Sort products based on selected order
  const sortProducts = (products) => {
    return [...products].sort((a, b) => {
      const [field, direction] = sortOrder.split('-');
      const modifier = direction === 'asc' ? 1 : -1;
      
      switch(field) {
        case 'name':
          return modifier * a.name.localeCompare(b.name);
        case 'price':
          return modifier * (a.price - b.price);
        case 'stock':
          return modifier * (a.stock - b.stock);
        case 'discount':
          return modifier * (a.discount_percentage - b.discount_percentage);  
        default:
          return modifier * (a.id - b.id);
      }
    });
  };

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => 
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (categoryFilter === '' || product.category === categoryFilter)
  );

  const sortedProducts = sortProducts(filteredProducts);

  // Pagination calculations
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const calculatedTotalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  // Check if all visible products are selected
  const areAllVisibleSelected = currentProducts.length > 0 && 
    currentProducts.every(product => selectedProducts.includes(product.id));

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, sortOrder]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Loading products...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search and filter toolbar */}
      <div className="mb-6 bg-white rounded-lg shadow-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4">
          {/* Search input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search products by name or category..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Category filter */}
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <FaFilter className="mr-2 text-gray-500" />
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="block w-32 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Sort order */}
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <FaSortAmountDown className="mr-2 text-gray-500" />
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
                className="block w-40 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="id-desc">Newest First</option>
                <option value="id-asc">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low-High)</option>
                <option value="price-desc">Price (High-Low)</option>
                <option value="stock-asc">Stock (Low-High)</option>
                <option value="stock-desc">Stock (High-Low)</option>
                <option value="discount-desc">Discount (High-Low)</option>
                <option value="discount-asc">Discount (Low-High)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Discount management panel */}
      <div className={`mb-6 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg shadow-lg p-4 ${selectedProducts.length > 0 ? 'scale-100 opacity-100' : 'scale-95 opacity-60'} transition-all duration-300`}>
        <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="font-medium text-indigo-700 flex items-center">
            <FaTag className="mr-2" />
            <span>{selectedProducts.length} products selected</span>
          </div>
          
          <div className="flex-grow flex items-center space-x-4">
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPercent className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                className="block w-24 pl-10 pr-3 py-2 border border-indigo-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Discount %"
                value={discountPercentage}
                onChange={e => setDiscountPercentage(e.target.value)}
                disabled={selectedProducts.length === 0}
              />
            </div>
            
            <button
              type="button"
              onClick={applyDiscountToSelected}
              disabled={selectedProducts.length === 0 || isApplyingDiscount || !discountPercentage}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white shadow-sm focus:outline-none
                ${(selectedProducts.length === 0 || isApplyingDiscount || !discountPercentage)
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
            >
              {isApplyingDiscount ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Applying...</span>
                </div>
              ) : (
                'Apply Discount'
              )}
            </button>
            
            <button
              type="button"
              onClick={removeDiscountsFromSelected}
              disabled={selectedProducts.length === 0 || isRemovingDiscount}
              className={`px-4 py-2 rounded-md text-sm font-medium shadow-sm focus:outline-none
                ${(selectedProducts.length === 0 || isRemovingDiscount)
                  ? 'bg-red-300 text-white cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                }`}
            >
              {isRemovingDiscount ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Removing...</span>
                </div>
              ) : (
                'Remove Discounts'
              )}
            </button>
            
            <button
              type="button"
              onClick={clearSelection}
              disabled={selectedProducts.length === 0}
              className="ml-2 p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
          
          {discountSuccess && (
            <div className="text-green-700 font-medium bg-green-100 py-1 px-3 rounded">
              {discountSuccess}
            </div>
          )}
        </div>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      checked={areAllVisibleSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Genres</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr 
                    key={product.id} 
                    className={`hover:bg-indigo-50 transition-colors ${
                      selectedProducts.includes(product.id) ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.image_url ? (
                        <div className="h-12 w-12 rounded-lg overflow-hidden shadow-md border border-gray-200">
                          <img
                            src={`http://localhost:5000/assets/images/${product.image_url}`}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 shadow-md">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {product.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.genres && product.genres.length > 0 ? (
                          product.genres.map((genre, index) => (
                            <span key={index} className="px-2 py-1 text-xs leading-4 font-medium rounded-full bg-purple-100 text-purple-800">
                              {genre}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500 italic">No genres</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {product.discount_percentage > 0 ? (
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">
                              ${parseFloat(product.final_price).toFixed(2)}
                            </div>
                            <div className="line-through text-xs text-gray-500">
                              ${parseFloat(product.price).toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          <div className="font-medium text-gray-900">
                            ${parseFloat(product.price).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.discount_percentage > 0 ? (
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {product.discount_percentage}%
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">None</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 10 
                          ? 'bg-green-100 text-green-800' 
                          : product.stock > 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-md transition-colors"
                          aria-label="Edit product"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors"
                          aria-label="Delete product"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <p className="text-lg font-medium">No products found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filter to find what you're looking for.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {calculatedTotalPages > 1 && (
          <div className="px-6 py-4 bg-white border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastProduct, sortedProducts.length)}
                </span>{" "}
                of <span className="font-medium">{sortedProducts.length}</span> products
              </div>
              <div className="flex justify-end">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                      currentPage === 1 
                        ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' 
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <FaChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {Array.from({ length: calculatedTotalPages }).map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        currentPage === index + 1
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === calculatedTotalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                      currentPage === calculatedTotalPages 
                        ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' 
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <FaChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default ProductsList;