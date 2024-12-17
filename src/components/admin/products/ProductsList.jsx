import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

function ProductsList({ onEdit }) {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  // Function to fetch products from the API
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data); // Update state with the data from the API
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Unable to load products.');
    }
  };

  // useEffect to load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to delete a product
  const handleDelete = async (productId) => {
    // Adiciona o alerta de confirmação
    const confirmDelete = window.confirm("Tem certeza de que deseja apagar este produto?");
    
    if (!confirmDelete) {
      return; // Se o usuário cancelar, a função termina aqui
    }
  
    try {
      // Adiciona o cabeçalho de autorização na requisição DELETE
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };
  
      // Realiza a requisição DELETE
      await axios.delete(`http://localhost:5000/api/products/${productId}`, { headers });
  
      // Atualiza a lista de produtos após uma exclusão bem-sucedida
      fetchProducts(); // ou qualquer função que atualiza a lista de produtos
    } catch (error) {
      console.error('Error deleting product:', error);
  
      if (error.response?.status === 403) {
        alert('Você não tem permissão para apagar este produto. Certifique-se de estar logado como administrador.');
      } else {
        alert('Falha ao apagar o produto. Por favor, tente novamente.');
      }
    }
  };

  // Calculate products for the current page
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Pagination handlers
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Genre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentProducts.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {product.image_url ? (
                  <img
                    src={`http://localhost:5000/assets/images/${product.image_url}`}
                    alt={product.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-gray-500">No Image</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{product.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{product.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{product.genre}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">${product.price}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{product.stock}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(product)}
                  className="text-primary hover:text-opacity-70 mr-3"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Updated Pagination controls */}
      <div className="flex justify-center space-x-2 mt-4 mb-8">
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
    </div>
  );
}

export default ProductsList;