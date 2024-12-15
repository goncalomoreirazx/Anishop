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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">Carregando...</div>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center text-red-500">{error}</div>
    </div>
  );

  if (orders.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">Nenhum pedido encontrado</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Histórico de Pedidos</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.order_id} className="bg-white shadow rounded-lg p-6">
            <div className="border-b pb-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">
                    Pedido #{order.order_id}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {format(new Date(order.order_date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Total: R$ {order.total_price.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="mt-2">
                <p className="text-sm">
                  {order.first_name} {order.last_name}
                </p>
                <p className="text-sm text-gray-600">
                  {order.address}, {order.city}, {order.postal_code}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Itens do Pedido</h3>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantidade: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuyHistory;