import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaLink, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

function AddProductImageModal({ isOpen, onClose, onImageAdded }) {
  // States for managing products, selected product, image selection, and form submission
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [imageOptions, setImageOptions] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch products and images when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      fetchImages();
    } else {
      // Reset form when modal closes
      setSelectedProduct('');
      setSelectedImage('');
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setProductsLoading(false);
    }
  };

  // Fetch available images from API
  const fetchImages = async () => {
    try {
      setImagesLoading(true);
      const response = await axios.get('http://localhost:5000/api/uploads');
      setImageOptions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to load images');
    } finally {
      setImagesLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!selectedProduct || !selectedImage) {
      setError('Please select both a product and an image');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Get the token from localStorage - THIS IS THE MISSING PART
      const token = localStorage.getItem('token');
      
      await axios.post('http://localhost:5000/api/products/images', {
        product_id: selectedProduct,
        image_url: selectedImage
      }, {
        headers: {
          'Authorization': `Bearer ${token}`, // Add the token to the headers
          'Content-Type': 'application/json'
        }
      });
      
      setSuccess(true);
      if (onImageAdded) onImageAdded();
      
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error adding image to product:', error);
      setError(error.response?.data?.message || 'Error adding image to product');
    } finally {
      setLoading(false);
    }
};

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-t-lg">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <FaLink className="mr-2" />
            Link Image to Product
          </h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors focus:outline-none"
            disabled={loading}
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Image linked successfully!</h3>
              <p className="mt-1 text-sm text-gray-500">
                The image has been linked to the product.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Product selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Product
                </label>
                {productsLoading ? (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FaSpinner className="animate-spin h-4 w-4" />
                    <span>Loading products...</span>
                  </div>
                ) : (
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    disabled={loading}
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              
              {/* Image selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Image
                </label>
                {imagesLoading ? (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FaSpinner className="animate-spin h-4 w-4" />
                    <span>Loading images...</span>
                  </div>
                ) : imageOptions.length > 0 ? (
                  <div className="mt-1 grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border rounded-md border-gray-300">
                    {imageOptions.map((image, index) => {
                      const filename = typeof image === 'string' ? image : image.filename;
                      return (
                        <div 
                          key={index}
                          onClick={() => setSelectedImage(filename)}
                          className={`cursor-pointer p-1 rounded-md border ${
                            selectedImage === filename 
                              ? 'border-indigo-500 ring-2 ring-indigo-200' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="relative pt-[100%]"> {/* Square aspect ratio */}
                            <img
                              src={`http://localhost:5000/assets/images/${filename}`}
                              alt={filename}
                              className="absolute inset-0 w-full h-full object-cover rounded-sm"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/50x50?text=Error';
                              }}
                            />
                          </div>
                          <p className="mt-1 text-xs text-center truncate">{filename}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-1 p-4 bg-gray-50 rounded-md border border-gray-200 text-center">
                    <p className="text-sm text-gray-500">No images available</p>
                    <p className="text-xs text-gray-400 mt-1">Upload images first</p>
                  </div>
                )}
              </div>
              
              {/* Selected image preview */}
              {selectedImage && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 flex-shrink-0">
                      <img
                        src={`http://localhost:5000/assets/images/${selectedImage}`}
                        alt={selectedImage}
                        className="h-full w-full object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/48x48?text=Error';
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Selected image
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {selectedImage}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FaExclamationTriangle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                    loading 
                      ? 'bg-green-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                  disabled={loading || !selectedProduct || !selectedImage}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Linking...
                    </span>
                  ) : 'Link Image'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddProductImageModal;