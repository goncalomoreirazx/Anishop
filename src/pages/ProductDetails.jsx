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
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Produto não encontrado</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {isModalVisible && <ModalItem />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductGallery
          images={[
            `http://localhost:5000/assets/images/${product.image_url}`, 
            ...product.images.map(img => `http://localhost:5000/assets/images/${img}`)
          ]}
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-2xl font-bold text-primary mt-2">${product.price}</p>
          <p className="mt-4 text-gray-600">{product.description}</p>
          
          {/* Average Rating Display */}
          <div className="mt-2 flex items-center">
            <span className="text-yellow-500 mr-2">
              {averageRating.toFixed(1)} / 5
            </span>
            {/*TIRAR DEPOIS*/}
            <span className="text-gray-600">
              ({reviews.length} reviews)
            </span>
          </div>
               {/*TIRAR DEPOIS*/}
          <div className="mt-4">
            <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
            </span>
          </div>
          <button
            className="mt-6 w-full bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors"
            disabled={product.stock === 0}
            onClick={() => addToCart(product)}
          >
            {product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
          </button>
              {/*Por related products aqui*/}
              <RelatedProducts productId={parseInt(id)} />
        </div>
      </div>
      
      <ProductReviews reviews={reviews} />
      <AddReview 
        productId={parseInt(id)} 
        onReviewAdded={refreshReviews} 
      />
      
    </div>
  );
}

export default ProductDetails;
