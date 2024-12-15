import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function OrderSuccess() {
  const { state } = useLocation();  // Acessa o state passado pela navegação
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Verifica se os dados de orderId e items estão disponíveis no state
  const orderId = state?.orderId;
  const items = state?.items;

  // Se não houver dados, mostra uma mensagem de erro ou redireciona para a página inicial
  if (!orderId || !items) {
    return (
      <div>
        <p>No order information found. Please go back and try again.</p>
        <button onClick={() => navigate('/')}>Back to Shopping</button>
      </div>
    );
  }

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-green-600 mb-6">Order Successful!</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <p><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Date:</strong> {new Date().toLocaleString()}</p> {/* Use the current date or pass the date if available */}
          <p><strong>Total:</strong> ${totalPrice.toFixed(2)}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Items Ordered</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Product</th>
                <th className="border p-2 text-center">Quantity</th>
                <th className="border p-2 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2 text-center">{item.quantity}</td>
                  <td className="border p-2 text-right">${item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/')} 
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
