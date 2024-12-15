import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function RecentOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <div className="bg-white rounded-lg shadow p-6">Loading...</div>;
    if (error) return <div className="bg-white rounded-lg shadow p-6 text-red-500">{error}</div>;

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
                <div className="mt-4">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="py-4 text-sm text-gray-900">#{order.id}</td>
                                    <td className="py-4 text-sm text-gray-900">
                                        {order.first_name} {order.last_name}
                                    </td>
                                    <td className="py-4 text-sm text-gray-900">
                                        $ {order.total_price.toFixed(2)}
                                    </td>
                                    <td className="py-4 text-sm text-gray-900">
                                        {format(new Date(order.order_date), "d 'de' MMM", { locale: ptBR })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default RecentOrders;