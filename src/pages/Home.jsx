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
        <div className="spinner-border" role="status">
          <span className="sr-only">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-dark mb-8">Produtos em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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