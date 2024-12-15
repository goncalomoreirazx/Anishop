import { FaTrash } from 'react-icons/fa';
import React, { memo } from 'react';

function CartItem({ item, onUpdateQuantity, onRemove }) {
  // Verificando se as imagens existem
  const mainImage = item.images && item.images.length > 0 ? item.images[0] : item.mainImage;

  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <img
        src={`http://localhost:5000/assets/images/${mainImage}`}  // Caminho da imagem
        alt={item.name}
        className="w-20 h-20 object-cover rounded"
      />
      <div className="flex-1 ml-4">
        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-500">${item.price}</p>
      </div>
      <div className="flex items-center">
        <select
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
          className="mx-2 border border-gray-300 rounded-md"
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-500 hover:text-red-700"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

// Usando React.memo para evitar renderizações desnecessárias
export default memo(CartItem);

