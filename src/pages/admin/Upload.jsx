import { useState, useRef } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import UploadList from '../../components/admin/upload/UploadList';
import UploadModal from '../../components/admin/upload/UploadModal';
import AddProductImageModal from '../../components/admin/upload/UpProdImageModal';
import { FaPlus, FaLink, FaImages } from 'react-icons/fa';

function UploadPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false);
  const uploadListRef = useRef();

  const handleAddUpload = () => {
    setIsUploadModalOpen(true);
  };

  const refreshUploads = () => {
    if (uploadListRef.current) {
      uploadListRef.current.fetchUploads();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FaImages className="mr-2 text-indigo-600" />
                  Image Management
                </h1>
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddUpload}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm transition-colors"
                  >
                    <FaPlus className="mr-2" />
                    Upload Image
                  </button>
                  <button
                    onClick={() => setIsAddImageModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 shadow-sm transition-colors"
                  >
                    <FaLink className="mr-2" />
                    Link Image to Product
                  </button>
                </div>
              </div>
              
              <p className="mt-2 text-sm text-gray-600">
                Upload and manage images for products in your anime and manga store
              </p>
            </div>
            
            {/* Upload tips card */}
            <div className="bg-indigo-50 rounded-lg p-4 mb-6 border border-indigo-100">
              <h3 className="text-indigo-800 font-medium mb-2">Upload Tips</h3>
              <ul className="list-disc pl-5 text-sm text-indigo-700 space-y-1">
                <li>Use high-quality images with 4:3 aspect ratio</li>
                <li>Keep file sizes under 2MB for optimal performance</li>
                <li>Supported formats: JPG, PNG, GIF</li>
                <li>Use descriptive filenames for better organization</li>
              </ul>
            </div>
            
            <UploadList ref={uploadListRef} />
          </div>
        </main>
      </div>
      
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        refreshUploads={refreshUploads}
      />

      <AddProductImageModal
        isOpen={isAddImageModalOpen}
        onClose={() => setIsAddImageModalOpen(false)}
        onImageAdded={refreshUploads}
      />
    </div>
  );
}

export default UploadPage;