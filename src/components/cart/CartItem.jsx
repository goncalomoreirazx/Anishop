import { FaTrash } from 'react-icons/fa';
import React, { memo } from 'react';

function CartItem({ item, onUpdateQuantity, onRemove }) {
  // Verificando se as imagens existem
  const mainImage = item.images && item.images.length > 0 ? item.images[0] : item.mainImage;

  return (
    <div className="flex items-center p-6 border-b border-gray-200 last:border-0">
      {/* Product image */}
      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
        <img
          src={`http://localhost:5000/assets/images/${item.mainImage}`}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product details */}
      <div className="flex-1 ml-6">
        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-500 mt-1">${item.price.toFixed(2)}</p>
      </div>

      {/* Quantity selector and remove button */}
      <div className="flex items-center space-x-4">
        <select
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
          className="block w-16 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-center"
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <button
          onClick={() => onRemove(item.id)}
          className="text-red-500 hover:text-red-700 transition-colors p-1"
          aria-label="Remove item"
        >
          <FaTrash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}


// Usando React.memo para evitar renderizações desnecessárias
export default memo(CartItem);

