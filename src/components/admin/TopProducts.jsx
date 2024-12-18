import { useEffect, useState } from 'react';
import axios from 'axios';

function TopProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/api/products/top-selling');
        setProducts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching top products:', error);
        setError('Failed to load top products.');
        setIsLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading top products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900">Top Products</h2>
        <div className="mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Total Sales</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product, index) => (
                <tr key={index}>
                  <td className="py-4 text-sm text-gray-900">{product.name}</td>
                  <td className="py-4 text-sm text-gray-900">{product.total_sold} units</td>
                  <td className="py-4 text-sm text-gray-900">$ {product.total_revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TopProducts;
