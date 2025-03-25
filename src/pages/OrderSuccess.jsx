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
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-card p-8">
          <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-xl font-semibold mt-4 mb-2">No Order Information Found</h1>
          <p className="text-gray-600 mb-6">Please go back and try again.</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-gradient-to-r from-primary to-purple-800 text-white px-6 py-3 rounded-md shadow-md hover:opacity-90 transition"
          >
            Back to Shopping
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-card p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-600">Order Successful!</h1>
          <p className="text-gray-600 mt-2">Thank you for your purchase!</p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Order Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <p><span className="font-medium text-gray-700">Order ID:</span> #{orderId}</p>
              <p><span className="font-medium text-gray-700">Date:</span> {new Date().toLocaleString()}</p>
            </div>
            <div className="space-y-3 text-right">
              <p><span className="font-medium text-gray-700">Total:</span> <span className="text-primary font-semibold">${totalPrice.toFixed(2)}</span></p>
              <p><span className="font-medium text-gray-700">Status:</span> <span className="text-green-600">Confirmed</span></p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Items Ordered</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                          <img src={`http://localhost:5000/assets/images/${item.mainImage}`} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{item.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">{item.quantity}</td>
                    <td className="py-4 px-4 text-right font-medium">${(parseFloat(item.price) || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')} 
            className="bg-gradient-to-r from-primary to-purple-800 text-white px-8 py-3 rounded-md shadow-md hover:opacity-90 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
