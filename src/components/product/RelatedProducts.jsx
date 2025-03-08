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

  if (loading) return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-100 animate-pulse h-64 rounded-xl"></div>
        ))}
      </div>
    </div>
  );
  
  if (error) return null;
  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <div 
            key={product.id} 
            className="bg-white rounded-xl shadow-card overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1"
            onClick={() => handleProductClick(product.id)}
          >
            {/* Product image */}
            <div className="h-48 overflow-hidden">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {/* Product details */}
            <div className="p-4">
              <h3 className="text-gray-900 font-medium line-clamp-1">{product.name}</h3>
              <p className="text-primary font-bold mt-2">$ {product.price.toFixed(2)}</p>
            </div>
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