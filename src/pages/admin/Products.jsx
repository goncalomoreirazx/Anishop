import { useState, useRef } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import ProductsList from '../../components/admin/products/ProductsList';
import ProductModal from '../../components/admin/products/ProductModal';
import { FaPlus, FaBoxOpen, FaFileExport, FaFilter } from 'react-icons/fa';

function Products() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'manga', 'anime', 'figures', 'accessories'
  const productsListRef = useRef();
  
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
      productsListRef.current.fetchProducts();
    }
  };

  const exportProductsCSV = () => {
    alert('Export functionality would go here');
    // Implementation would involve generating a CSV with product data
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Page header with title and actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FaBoxOpen className="mr-2 text-indigo-600" />
                  Products Management
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Add, edit, and manage your inventory
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={exportProductsCSV}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FaFileExport className="mr-2" />
                  Export CSV
                </button>
                <button
                  onClick={handleAddProduct}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 shadow-md transition-colors"
                >
                  <FaPlus className="mr-2" />
                  Add Product
                </button>
              </div>
            </div>

            {/* Category tabs */}
            <div className="bg-white rounded-t-lg shadow-md mb-6">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-3 font-medium text-sm flex items-center min-w-max ${
                    activeTab === 'all'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FaFilter className="mr-2" /> All Products
                </button>
                <button
                  onClick={() => setActiveTab('manga')}
                  className={`px-4 py-3 font-medium text-sm flex items-center min-w-max ${
                    activeTab === 'manga'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Manga
                </button>
                <button
                  onClick={() => setActiveTab('anime')}
                  className={`px-4 py-3 font-medium text-sm flex items-center min-w-max ${
                    activeTab === 'anime'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Anime
                </button>
                <button
                  onClick={() => setActiveTab('figures')}
                  className={`px-4 py-3 font-medium text-sm flex items-center min-w-max ${
                    activeTab === 'figures'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Figures
                </button>
                <button
                  onClick={() => setActiveTab('accessories')}
                  className={`px-4 py-3 font-medium text-sm flex items-center min-w-max ${
                    activeTab === 'accessories'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Accessories
                </button>
              </div>
            </div>
            
            {/* Products list component */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-6 shadow-lg">
              <ProductsList 
                ref={productsListRef} 
                onEdit={handleEditProduct} 
              />
            </div>
          </div>
        </main>
      </div>

      {/* Product modal for add/edit */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        refreshProducts={refreshProducts}
      />
    </div>
  );
}

export default Products;