import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import AboutSection from '../components/AboutSection';
import axios from 'axios';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/api/products/top-selling');
        setFeaturedProducts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar produtos mais vendidos:', error);
        setError('Não foi possível carregar os produtos');
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []); // Chama a função apenas uma vez quando o componente for montado

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg max-w-md">
          <p className="font-medium">{error}</p>
          <p className="text-sm mt-2">Please try refreshing the page or check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-dark mb-4">Featured Products</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <AboutSection />
    </div>
  );
}


export default Home;