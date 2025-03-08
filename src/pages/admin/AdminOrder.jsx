import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import OrderList from '../../components/admin/orders/OrderList';
import { FaShoppingBag, FaFilter, FaSearch } from 'react-icons/fa';

function AdminOrders() {
    // Estados para gerenciar pedidos, carregamento e erros
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOptions, setFilterOptions] = useState({
        dateRange: 'all',
        minTotal: '',
        maxTotal: ''
    });
    const navigate = useNavigate();

    // Efeito para buscar pedidos
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
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

    // Função para mudar de página
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Componente de paginação
    const Pagination = () => (
        <div className="mt-5 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                        currentPage === 1 
                            ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' 
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === index + 1
                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
                
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                        currentPage === totalPages 
                            ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' 
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
            </nav>
        </div>
    );

    // Filter orders based on search and filters
    const filteredOrders = orders.filter(order => {
        // Search by order ID or customer name
        const searchMatch = 
            (order.order_id?.toString().includes(searchTerm) || 
            (order.first_name + ' ' + order.last_name).toLowerCase().includes(searchTerm.toLowerCase()));
            
        // Filter by total price range
        const minTotalMatch = filterOptions.minTotal === '' || order.total_price >= parseFloat(filterOptions.minTotal);
        const maxTotalMatch = filterOptions.maxTotal === '' || order.total_price <= parseFloat(filterOptions.maxTotal);
        
        // Filter by date range
        let dateMatch = true;
        const orderDate = new Date(order.order_date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        
        if (filterOptions.dateRange === 'today') {
            dateMatch = orderDate.toDateString() === today.toDateString();
        } else if (filterOptions.dateRange === 'yesterday') {
            dateMatch = orderDate.toDateString() === yesterday.toDateString();
        } else if (filterOptions.dateRange === 'last7days') {
            dateMatch = orderDate >= lastWeek;
        } else if (filterOptions.dateRange === 'last30days') {
            dateMatch = orderDate >= lastMonth;
        }
        
        return searchMatch && minTotalMatch && maxTotalMatch && dateMatch;
    });

    // Loading state
    if (loading) return (
        <div className="flex h-screen bg-gray-50">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
                
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                <FaShoppingBag className="mr-2 text-indigo-600" />
                                Order Management
                            </h1>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
                            <p className="mt-2 text-gray-600">Loading orders...</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );

    // Error state
    if (error) return (
        <div className="flex h-screen bg-gray-50">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
                
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-center text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
                
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                <FaShoppingBag className="mr-2 text-indigo-600" />
                                Order Management
                            </h1>
                            
                            <div className="flex space-x-2">
                                <button
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={() => {/* Export functionality would go here */}}
                                >
                                    Export Orders
                                </button>
                            </div>
                        </div>
                        
                        {/* Search and filter bar */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaSearch className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Search orders..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <div className="relative">
                                        <select
                                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            value={filterOptions.dateRange}
                                            onChange={(e) => setFilterOptions({...filterOptions, dateRange: e.target.value})}
                                        >
                                            <option value="all">All Time</option>
                                            <option value="today">Today</option>
                                            <option value="yesterday">Yesterday</option>
                                            <option value="last7days">Last 7 Days</option>
                                            <option value="last30days">Last 30 Days</option>
                                        </select>
                                    </div>
                                    
                                    <button
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        onClick={() => {/* More filters functionality */}}
                                    >
                                        <FaFilter className="mr-2" />
                                        Filters
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Orders table */}
                        <OrderList orders={filteredOrders} Pagination={Pagination} />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminOrders;