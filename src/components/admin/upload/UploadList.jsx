import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { FaSearch, FaCopy, FaFileImage, FaTrash } from 'react-icons/fa';

const UploadList = forwardRef((props, ref) => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Expose the fetchUploads method to parent components
  useImperativeHandle(ref, () => ({
    fetchUploads,
  }));

  // Function to fetch the uploads
  const fetchUploads = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/uploads');
      setUploads(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching uploads:', error);
      setError('Failed to load images');
      setLoading(false);
    }
  };

  // Load uploads when component mounts
  useEffect(() => {
    fetchUploads();
  }, []);

  // Copy image filename to clipboard
  const copyFilename = (filename) => {
    navigator.clipboard.writeText(filename).then(
      () => {
        // Show success toast
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50';
        toast.innerHTML = `
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <p>Filename copied to clipboard!</p>
          </div>
        `;
        document.body.appendChild(toast);
        
        // Remove toast after 2 seconds
        setTimeout(() => {
          toast.remove();
        }, 2000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  // Delete image functionality (placeholder - would need proper implementation)
  const handleDelete = (filename) => {
    if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
      // This would need to call an API endpoint to delete the file
      console.log(`Delete ${filename}`);
      
      // For now, just remove from the local state
      setUploads(uploads.filter(upload => 
        (typeof upload === 'string' ? upload !== filename : upload.filename !== filename)
      ));
    }
  };

  // Filter uploads based on search term
  const filteredUploads = uploads.filter(upload => {
    const filename = typeof upload === 'string' ? upload : upload.filename;
    return filename.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Loading images...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search images..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* View toggle */}
        <div className="flex space-x-2 ml-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 rounded-md ${viewMode === 'grid' 
              ? 'bg-indigo-100 text-indigo-700' 
              : 'bg-white hover:bg-gray-100 text-gray-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 rounded-md ${viewMode === 'list' 
              ? 'bg-indigo-100 text-indigo-700' 
              : 'bg-white hover:bg-gray-100 text-gray-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {filteredUploads.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FaFileImage className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No images</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'No images match your search criteria' : 'Get started by uploading a new image'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        // Grid view
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredUploads.map((upload, index) => {
            const filename = typeof upload === 'string' ? upload : upload.filename;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                <div className="relative pt-[75%]"> {/* 4:3 aspect ratio */}
                  <img
                    src={`http://localhost:5000/assets/images/${filename}`}
                    alt={filename}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => copyFilename(filename)}
                        className="p-2 bg-white rounded-full text-gray-800 hover:text-indigo-600 transition-colors"
                        title="Copy filename"
                      >
                        <FaCopy className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(filename)}
                        className="p-2 bg-white rounded-full text-gray-800 hover:text-red-600 transition-colors"
                        title="Delete image"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-500 truncate">{filename}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // List view
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filename</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUploads.map((upload, index) => {
                const filename = typeof upload === 'string' ? upload : upload.filename;
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-12 w-12 rounded overflow-hidden bg-gray-100">
                        <img
                          src={`http://localhost:5000/assets/images/${filename}`}
                          alt={filename}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/48x48?text=Error';
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{filename}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => copyFilename(filename)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        title="Copy filename"
                      >
                        <FaCopy className="inline h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(filename)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete image"
                      >
                        <FaTrash className="inline h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});

export default UploadList;