// OrderRow.jsx
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const OrderRow = ({ order }) => {
    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                #{order.id}
            </td>
            <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                    {order.first_name} {order.last_name}
                </div>
                <div className="text-sm text-gray-500">
                    {order.city}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {format(new Date(order.order_date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                R$ {order.total_price.toFixed(2)}
            </td>
            <td className="px-6 py-4">
                <ul className="text-sm text-gray-500">
                    {order.items.map((item, index) => (
                        <li key={index}>
                            {item.name} x{item.quantity}
                        </li>
                    ))}
                </ul>
            </td>
        </tr>
    );
};

export default OrderRow;