import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const OrderRow = ({ order }) => {
    // If there's no items array, create a placeholder
    const items = Array.isArray(order.items) ? order.items : [];
    
    return (
        <tr className="bg-indigo-50">
            <td colSpan="6" className="px-8 py-4">
                <div className="flex flex-col md:flex-row md:space-x-8">
                    {/* Order details */}
                    <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2 mb-3">
                            Order Details
                        </h4>
                        
                        <div className="space-y-2">
                            {/* Order ID and date */}
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Order ID:</span>
                                <span className="font-medium text-gray-900">#{order.order_id || order.id}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Date:</span>
                                <span className="font-medium text-gray-900">
                                    {format(new Date(order.order_date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                </span>
                            </div>
                            
                            {/* Customer details */}
                            <div className="border-t border-gray-200 pt-2 mt-2">
                                <h5 className="text-xs font-medium text-gray-700 mb-1">Customer Information</h5>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Name:</span>
                                    <span className="font-medium text-gray-900">{order.first_name} {order.last_name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Address:</span>
                                    <span className="font-medium text-gray-900">{order.address}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">City:</span>
                                    <span className="font-medium text-gray-900">{order.city}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Postal Code:</span>
                                    <span className="font-medium text-gray-900">{order.postal_code}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Phone:</span>
                                    <span className="font-medium text-gray-900">{order.phone}</span>
                                </div>
                            </div>
                            
                            {/* Payment details */}
                            <div className="border-t border-gray-200 pt-2 mt-2">
                                <h5 className="text-xs font-medium text-gray-700 mb-1">Payment Information</h5>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Card:</span>
                                    <span className="font-medium text-gray-900">
                                        **** **** **** {order.card_number?.slice(-4) || '****'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Expiry:</span>
                                    <span className="font-medium text-gray-900">{order.expiry_date}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Order items */}
                    <div className="flex-1 mt-4 md:mt-0">
                        <h4 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2 mb-3">
                            Order Items
                        </h4>
                        
                        {items.length === 0 ? (
                            <div className="text-sm text-gray-500 italic">No items data available</div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {items.map((item, index) => (
                                    <div key={index} className="py-2">
                                        <div className="flex justify-between">
                                            <div className="pr-4">
                                                <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    Qty: {item.quantity} × ${item.price?.toFixed(2)}
                                                </div>
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                {/* Order summary */}
                                <div className="py-2 mt-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal:</span>
                                        <span className="font-medium text-gray-900">
                                            ${(order.total_price - 10).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Shipping:</span>
                                        <span className="font-medium text-gray-900">$10.00</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200">
                                        <span>Total:</span>
                                        <span>${order.total_price.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default OrderRow;