import { useState, useRef } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import ProductsList from '../../components/admin/products/ProductsList';
import ProductModal from '../../components/admin/products/ProductModal';
import { FaPlus } from 'react-icons/fa';

function Products() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const productsListRef = useRef(); // Cria uma referência para o componente ProductsList
  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const refreshProducts = () => {
    if (productsListRef.current) {
      productsListRef.current.fetchProducts(); // Chama o método fetchProducts do ProductsList
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Products Management</h1>
              <button
                onClick={handleAddProduct}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                <FaPlus className="mr-2" />
                Add Product
              </button>
            </div>
            
            <ProductsList ref={productsListRef} onEdit={handleEditProduct} />
          </div>
        </main>
      </div>

      <ProductModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      product={editingProduct}
      refreshProducts={refreshProducts} // Chama ao salvar um produto
    />
    </div>
  );
}

export default Products;