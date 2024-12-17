import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import Select from 'react-select';

function ProductModal({ isOpen, onClose, product }) {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

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
    { value: 'Game', label: 'Game' },
    { value: 'Anime', label: 'Anime' },
    { value: 'Other', label: 'Other' }
  ];

  const getAuthHeaders = () => ({
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  useEffect(() => {
    if (product) {
      // Converter os gêneros do produto para o formato do react-select
      const formattedGenres = product.genres.map(genre => ({
        value: genre,
        label: genre
      }));
      
      reset({
        ...product,
        genres: formattedGenres
      });
    } else {
      reset({
        name: '',
        category: '',
        genres: [],
        price: '',
        stock: '',
        description: '',
        image_url: ''
      });
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      price: parseFloat(data.price),
      stock: parseInt(data.stock, 10),
      genres: data.genres.map(genre => genre.value)
    };

    try {
      console.log("Dados formatados enviados:", formattedData);
      if (product) {
        await axios.put(
          `http://localhost:5000/api/products/${product.id}`,
          formattedData,
          getAuthHeaders()
        );
        alert("Produto atualizado com sucesso!");
      } else {
        await axios.post(
          "http://localhost:5000/api/products",
          formattedData,
          getAuthHeaders()
        );
        alert("Produto criado com sucesso!");
      }
      onClose();
    } catch (error) {
      console.error("Erro ao salvar o produto:", error);
      if (error.response?.status === 403) {
        alert("Você não tem permissão para realizar esta operação. Certifique-se de que está logado como admin.");
      } else {
        alert("Não foi possível salvar o produto.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            >
              <option value="">Select category</option>
              <option value="Manga">Manga</option>
              <option value="Anime">Anime</option>
              <option value="Figures">Figures</option>
              <option value="Accessories">Accessories</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Genres <span className="text-red-500">*</span>
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
                  className="mt-1"
                  classNamePrefix="select"
                />
              )}
            />
            {errors.genres && (
              <p className="mt-1 text-sm text-red-600">{errors.genres.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              step="0.01"
              {...register('price', { required: 'Price is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              {...register('stock', { required: 'Stock is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              {...register('image_url', { required: 'Image URL is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
            {errors.image_url && (
              <p className="mt-1 text-sm text-red-600">{errors.image_url.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              {product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;