import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaAngleDown, FaAngleUp, FaEye, FaPrint, FaFileDownload } from 'react-icons/fa';
import OrderRow from './OrderRow';

const OrderList = ({ orders, Pagination }) => {
    const [expandedOrder, setExpandedOrder] = useState(null);

    // Toggle order expansion
    const toggleOrderDetails = (orderId) => {
        if (expandedOrder === orderId) {
            setExpandedOrder(null);
        } else {
            setExpandedOrder(orderId);
        }
    };

    // Sort orders by date (newest first)
    const sortedOrders = [...orders].sort((a, b) => 
        new Date(b.order_date) - new Date(a.order_date)
    );

    // Print invoice (placeholder)
    const printInvoice = (order) => {
        console.log('Print invoice for order:', order.order_id);
        alert(`Printing invoice for order #${order.order_id}`);
    };

    // Download order details (placeholder)
    const downloadOrderDetails = (order) => {
        console.log('Download details for order:', order.order_id);
        alert(`Downloading details for order #${order.order_id}`);
    };

    // View order details (placeholder) 
    const viewOrderDetails = (order) => {
        console.log('View details for order:', order.order_id);
        alert(`Viewing details for order #${order.order_id}`);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
                {sortedOrders.length === 0 ? (
                    <div className="p-8 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            There are no orders matching your criteria.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedOrders.map((order) => (
                                    <React.Fragment key={order.order_id || order.id}>
                                        <tr className={`hover:bg-gray-50 ${expandedOrder === (order.order_id || order.id) ? 'bg-indigo-50' : ''}`}>
                                            {/* Order ID with expand/collapse toggle */}
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <button 
                                                        onClick={() => toggleOrderDetails(order.order_id || order.id)}
                                                        className="mr-2 text-gray-500 hover:text-indigo-600 focus:outline-none"
                                                    >
                                                        {expandedOrder === (order.order_id || order.id) ? (
                                                            <FaAngleUp className="h-5 w-5" />
                                                        ) : (
                                                            <FaAngleDown className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                    <span className="font-medium text-indigo-600">
                                                        #{order.order_id || order.id}
                                                    </span>
                                                </div>
                                            </td>
                                            
                                            {/* Customer info */}
                                            <td className="px-4 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {order.first_name} {order.last_name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {order.city}
                                                </div>
                                            </td>
                                            
                                            {/* Order date */}
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {format(new Date(order.order_date), "d MMM yyyy", { locale: ptBR })}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {format(new Date(order.order_date), "HH:mm", { locale: ptBR })}
                                                </div>
                                            </td>
                                            
                                            {/* Total price */}
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    ${order.total_price.toFixed(2)}
                                                </div>
                                            </td>
                                            
                                            {/* Item count */}
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {Array.isArray(order.items) ? order.items.length : '–'}
                                                </div>
                                            </td>
                                            
                                            {/* Actions */}
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button 
                                                    onClick={() => viewOrderDetails(order)}
                                                    className="text-indigo-600 hover:text-indigo-900 inline-flex items-center mx-1"
                                                    title="View details"
                                                >
                                                    <FaEye className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => printInvoice(order)}
                                                    className="text-green-600 hover:text-green-900 inline-flex items-center mx-1"
                                                    title="Print invoice"
                                                >
                                                    <FaPrint className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => downloadOrderDetails(order)}
                                                    className="text-blue-600 hover:text-blue-900 inline-flex items-center mx-1"
                                                    title="Download"
                                                >
                                                    <FaFileDownload className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                        
                                        {/* Expanded order details */}
                                        {expandedOrder === (order.order_id || order.id) && (
                                            <OrderRow order={order} />
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            {/* Pagination component */}
            {Pagination && <Pagination />}
        </>
    );
};

export default OrderList;
