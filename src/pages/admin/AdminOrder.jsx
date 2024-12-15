// AdminOrders.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import OrderList from '../../components/admin/orders/OrderList';

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`http://localhost:5000/api/orders/admin/orders?page=${currentPage}&limit=10`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setOrders(response.data.orders);
                setTotalPages(response.data.pagination.totalPages);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError(`Failed to fetch orders: ${err.response?.data?.message || err.message}`);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate, currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const Pagination = () => (
        <div className="flex justify-center space-x-2 mt-4 mb-8">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                    currentPage === 1 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-primary text-white hover:bg-opacity-90'
                }`}
            >
                Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 rounded ${
                        currentPage === index + 1
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                    {index + 1}
                </button>
            ))}
            
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${
                    currentPage === totalPages 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-primary text-white hover:bg-opacity-90'
                }`}
            >
                Next
            </button>
        </div>
    );

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div>Loading...</div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-red-500">{error}</div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
                
                <main className="flex-1 overflow-y-auto p-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-semibold text-gray-900">Order Management</h1>
                        </div>

                        <OrderList orders={orders} Pagination={Pagination} />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminOrders;