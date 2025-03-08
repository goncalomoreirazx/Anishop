import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductGallery from '../components/product/ProductGallery';
import ProductReviews from '../components/product/ProductReviews';
import RelatedProducts from '../components/product/RelatedProducts';
import ModalItem from '../components/ModalItem';
import AddReview from '../components/product/AddReview';


function ProductDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate(); 

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]); 
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]); 
  const [isModalVisible, setIsModalVisible] = useState(false); 

  const isLoggedIn = localStorage.getItem('token'); 

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        const product = response.data;

        const validImages = product.images.filter(img => img && img !== 'undefined').map(img => `${img}`);
        const mainImage = product.mainImage ? `${product.mainImage}` : null;

        setProduct({
          ...product,
          mainImage,
          images: [mainImage, ...validImages],
        });
        setLoading(false);
      } catch (error) {
        setError('Erro ao carregar o produto');
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Fetch product reviews
  useEffect(() => {
    const fetchReviews = async (productId) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${productId}/reviews`);
        const { reviews, averageRating, totalReviews } = response.data;
        
        setReviews(reviews);
        setAverageRating(averageRating);
      } catch (error) {
        console.error('Erro ao buscar reviews:', error);
      }
    };

    if (id) {
      fetchReviews(id);
    }
  }, [id]);

  // Function to refresh reviews
  const refreshReviews = () => {
    const fetchReviews = async (productId) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${productId}/reviews`);
        const { reviews, averageRating, totalReviews } = response.data;
        
        setReviews(reviews);
        setAverageRating(averageRating);
      } catch (error) {
        console.error('Erro ao buscar reviews:', error);
      }
    };

    if (id) {
      fetchReviews(id);
    }
  };

  // Cart management
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Add to cart functionality
  const addToCart = (product) => {
    if (!isLoggedIn) {
      alert('Você precisa estar logado para adicionar produtos ao carrinho!');
      navigate('/login');
      return;
    }
  
    // Move the state update into a setTimeout to avoid the warning
    setTimeout(() => {
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === product.id);
        const newCart = existingItem
          ? prevCart.map(item =>
              item.id === product.id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            )
          : [...prevCart, { ...product, quantity: 1 }];
  
        // Update localStorage and dispatch event
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));
        
        return newCart;
      });
  
      // Show modal
      setIsModalVisible(true);
      setTimeout(() => {
        setIsModalVisible(false);
      }, 1000);
    }, 0);
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-yellow-100 text-yellow-700 px-6 py-4 rounded-lg">
          <p className="text-lg font-medium">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {isModalVisible && <ModalItem />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Product Gallery */}
        <ProductGallery
          images={[
            `http://localhost:5000/assets/images/${product.image_url}`, 
            ...product.images.map(img => `http://localhost:5000/assets/images/${img}`)
          ]}
        />
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
          
          {/* Genre tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {product.genres && product.genres.map((genre, idx) => (
              <span key={idx} className="bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {genre}
              </span>
            ))}
          </div>
          
          {/* Price */}
          <div className="text-3xl font-bold text-primary mt-4">${product.price}</div>
          
          {/* Rating */}
          <div className="mt-3 flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-5 h-5 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600 ml-2">
              {averageRating.toFixed(1)} / 5 ({reviews.length} reviews)
            </span>
          </div>
          
          {/* Description */}
          <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>
          
          {/* Stock status */}
          <div className="mt-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {product.stock > 0 ? (
                <>
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {product.stock} in stock
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Out of stock
                </>
              )}
            </span>
          </div>

          {/* Add to cart button */}
          <button
            className={`mt-8 w-full bg-gradient-to-r from-primary to-purple-800 text-white px-6 py-4 rounded-md font-medium shadow-lg ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 transition-all'}`}
            disabled={product.stock === 0}
            onClick={() => addToCart(product)}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          
          {/* Related Products - Moved to here under the Add to Cart button */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Products</h3>
            <RelatedProducts productId={parseInt(id)} />
          </div>
        </div>
      </div>
      
      {/* Reviews section with updated styling */}
      <div className="mt-16 bg-white rounded-xl shadow-card p-8">
        <h2 className="text-2xl font-bold text-dark mb-6">Customer Reviews</h2>
        <ProductReviews reviews={reviews} />
      </div>
      
      {/* Add Review form with updated styling */}
      <AddReview 
        productId={parseInt(id)} 
        onReviewAdded={refreshReviews} 
      />
    </div>
  );
}

export default ProductDetails;
