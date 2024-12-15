import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

function RelatedProducts({ productId }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        console.log('Fetching related products for productId:', productId);
        
        const response = await axios.get(
          `http://localhost:5000/api/products/${productId}/related`,
          {
            // Add this to see more details about the request
            validateStatus: function (status) {
              return status >= 200 && status < 300; // Default
            }
          }
        );
        
        console.log('Response:', response);
        setRelatedProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Full error object:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        setError(`Não foi possível carregar produtos relacionados: ${err.message}`);
        setLoading(false);
      }
    };

    if (productId) {
      fetchRelatedProducts();
    }
  }, [productId]);

  const handleProductClick = (id) => {
    // Use navigate first
    navigate(`/product/${id}`);
    
    // Force reload after navigation
    window.location.reload();
  };

  if (loading) return <div>Carregando produtos relacionados...</div>;
  if (error) return <div>{error}</div>;
  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Produtos Relacionados</h2>
      <div className="grid grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <div 
            key={product.id} 
            className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleProductClick(product.id)}
          >
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-48 object-cover mb-2 rounded"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-primary font-bold">R$ {product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

RelatedProducts.propTypes = {
  productId: PropTypes.number.isRequired
};

export default RelatedProducts;