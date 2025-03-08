import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaShoppingBag } from 'react-icons/fa';

function RecentOrders() {
    // Estados para gerenciar carregamento, dados e erros
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Efeito para buscar pedidos recentes
    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/orders/admin/recent', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setOrders(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching recent orders:', err);
                setLoading(false);
                setError('Failed to load recent orders');
            }
        };

        fetchRecentOrders();
    }, []);

    // Estados de carregamento e erro
    if (loading) return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3">
                <div className="h-4 w-4 bg-indigo-500 rounded-full animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="text-red-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FaShoppingBag className="mr-2 text-indigo-600" />
                    Recent Orders
                </h2>
            </div>
            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">#{order.id}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{order.first_name} {order.last_name}</div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">${order.total_price.toFixed(2)}</div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {format(new Date(order.order_date), "d 'de' MMM", { locale: ptBR })}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 text-right">
                    <a href="/admin/admin-orders" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                        View all orders →
                    </a>
                </div>
            </div>
        </div>
    );
}

export default RecentOrders;