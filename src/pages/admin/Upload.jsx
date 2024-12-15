import { useState, useRef } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import UploadList from '../../components/admin/upload/UploadList';
import UploadModal from '../../components/admin/upload/UploadModal';
import AddProductImageModal from '../../components/admin/upload/UpProdImageModal';
import { FaPlus, FaLink } from 'react-icons/fa';

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
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Upload Management</h1>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddUpload}
                  className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
                >
                  <FaPlus className="mr-2" />
                  Upload Image
                </button>
                <button
                  onClick={() => setIsAddImageModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-opacity-90 transition-colors"
                >
                  <FaLink className="mr-2" />
                  Link Image to Product
                </button>
              </div>
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