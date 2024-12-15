import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UpProdImageModal({ isOpen, onClose, onImageAdded }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Fetch products when modal opens
      const fetchProducts = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/products');
          setProducts(response.data);
        } catch (error) {
          console.error('Erro ao buscar produtos:', error);
          alert('Erro ao carregar produtos');
        }
      };

      fetchProducts();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct || !imageUrl) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    try {
      // Updated endpoint to match backend route
      await axios.post('http://localhost:5000/api/products/images', {
        product_id: selectedProduct,
        image_url: imageUrl
      });

      alert('Imagem adicionada com sucesso!');
      setSelectedProduct('');
      setImageUrl('');
      onImageAdded();
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar imagem:', error.response?.data || error);
      alert('Erro ao adicionar imagem ao produto');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Adicionar Imagem ao Produto</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Produto</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecione um produto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Nome da Imagem</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Ex: Gojo2.jpg"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpProdImageModal;