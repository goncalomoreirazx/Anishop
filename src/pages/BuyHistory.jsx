import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function BuyHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Debug log

        if (!token) {
          setError('Usuário não está logado');
          setLoading(false);
          return;
        }

        // Log the full request URL and headers
        console.log('Making request to:', 'http://localhost:5000/api/orders/history');
        console.log('Headers:', { Authorization: `Bearer ${token}` });

        const response = await axios.get('http://localhost:5000/api/orders/history', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response:', response.data); // Debug log
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Full error:', err);
        console.error('Error response:', err.response); // Log full error response
        setError('Erro ao carregar histórico de pedidos');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-md mx-auto">
        <p className="font-medium">{error}</p>
        <p className="text-sm mt-2">Please try again later or contact support.</p>
      </div>
    </div>
  );

  if (orders.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center py-16 bg-gray-50 rounded-xl max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
        <p className="mt-2 text-gray-500">Start shopping to see your order history here.</p>
        <Link to="/" className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors">
          Browse Products
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>
      
      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order.order_id} className="bg-white shadow-card rounded-xl overflow-hidden">
            {/* Order header */}
            <div className="border-b bg-gray-50 px-6 py-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Order #{order.order_id}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {format(new Date(order.order_date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Completed
                  </span>
                  <p className="font-semibold text-primary text-right">
                    Total: R$ {(parseFloat(order.total_price) || 0).toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Shipped to:</span> {order.first_name} {order.last_name}
                </p>
                <p className="text-sm text-gray-600">
                  {order.address}, {order.city}, {order.postal_code}
                </p>
              </div>
            </div>

            {/* Order items */}
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-gray-900">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default BuyHistory;