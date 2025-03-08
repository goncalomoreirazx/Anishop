import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FaTimes, FaSave, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import Select from 'react-select';

function ProductModal({ isOpen, onClose, product, refreshProducts }) {
  // React Hook Form setup
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Genre options for the select dropdown
  const genreOptions = [
    { value: 'Action', label: 'Action' },
    { value: 'Adventure', label: 'Adventure' },
    { value: 'Comedy', label: 'Comedy' },
    { value: 'Drama', label: 'Drama' },
    { value: 'Fantasy', label: 'Fantasy' },
    { value: 'Horror', label: 'Horror' },
    { value: 'Romance', label: 'Romance' },
    { value: 'Sci-Fi', label: 'Sci-Fi' },
    { value: 'Slice of Life', label: 'Slice of Life' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Mystery', label: 'Mystery' },
    { value: 'Psychological', label: 'Psychological' },
    { value: 'Thriller', label: 'Thriller' },
    { value: 'Historical', label: 'Historical' },
    { value: 'Mecha', label: 'Mecha' },
    { value: 'Music', label: 'Music' },
    { value: 'Supernatural', label: 'Supernatural' },
    { value: 'Game', label: 'Game' },
    { value: 'Other', label: 'Other' }
  ];

  // Category options
  const categoryOptions = [
    { value: 'Manga', label: 'Manga' },
    { value: 'Figures', label: 'Figures' },
    { value: 'Accessories', label: 'Accessories' },
    { value: 'Anime', label: 'Anime' }
  ];

  // Effect to reset form when product changes
  useEffect(() => {
    if (product) {
      // Convert genres to the format needed by react-select
      const formattedGenres = product.genres 
        ? product.genres.map(genre => ({ value: genre, label: genre }))
        : [];
      
      const formattedCategory = product.category 
        ? { value: product.category, label: product.category }
        : null;
      
      reset({
        ...product,
        genres: formattedGenres,
        category: formattedCategory
      });
    } else {
      reset({
        name: '',
        description: '',
        price: '',
        category: null,
        genres: [],
        stock: '',
        image_url: ''
      });
    }
    
    // Clear any previous errors
    setServerError('');
  }, [product, reset]);

  // Submit handler
  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Format the data
      const formattedData = {
        ...data,
        category: data.category.value,
        genres: data.genres.map(genre => genre.value),
        price: parseFloat(data.price),
        stock: parseInt(data.stock, 10)
      };
      
      if (product) {
        // Update existing product
        await axios.put(
          `http://localhost:5000/api/products/${product.id}`,
          formattedData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
      } else {
        // Create new product
        await axios.post(
          'http://localhost:5000/api/products',
          formattedData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
      }
      
      refreshProducts();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      setServerError(
        error.response?.data?.message || 
        'An error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-t-lg">
          <h3 className="text-lg font-semibold text-white">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors focus:outline-none"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>
        
        <div className="px-6 py-4">
          {serverError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <div className="flex items-center">
                <FaTimesCircle className="h-5 w-5 mr-2" />
                <p>{serverError}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                {...register('name', { required: 'Product name is required' })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            
            {/* Category field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <Controller
                name="category"
                control={control}
                rules={{ required: 'Category is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={categoryOptions}
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder="Select category"
                    isSearchable
                  />
                )}
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>
            
            {/* Genres field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Genres
              </label>
              <Controller
                name="genres"
                control={control}
                rules={{ required: 'At least one genre is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    isMulti
                    options={genreOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Select genres"
                    isSearchable
                  />
                )}
              />
              {errors.genres && (
                <p className="mt-1 text-sm text-red-600">{errors.genres.message}</p>
              )}
            </div>
            
            {/* Price and Stock fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('price', { 
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' },
                    valueAsNumber: true
                  })}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.price ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('stock', { 
                    required: 'Stock is required',
                    min: { value: 0, message: 'Stock must be non-negative' },
                    valueAsNumber: true
                  })}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.stock ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                )}
              </div>
            </div>
            
            {/* Description field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows="3"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
            
            {/* Image URL field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Filename
              </label>
              <input
                type="text"
                {...register('image_url', { required: 'Image filename is required' })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.image_url ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="example.jpg"
              />
              {errors.image_url && (
                <p className="mt-1 text-sm text-red-600">{errors.image_url.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Use file names from the uploaded images section.
              </p>
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={isLoading}
              >
                <FaSave className="mr-2 -ml-1 h-5 w-5" />
                {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;