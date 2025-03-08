import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FaTimes, FaUpload, FaImage, FaSpinner } from 'react-icons/fa';

function UploadModal({ isOpen, onClose, refreshUploads }) {
  // States for controlling file selection and upload
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const fileInputRef = useRef(null);

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    // Reset message
    setMessage('');
    setMessageType('');
    
    // Validate file
    if (selectedFile) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(selectedFile.type)) {
        setMessage('Please select a valid image file (JPG, PNG, GIF)');
        setMessageType('error');
        return;
      }
      
      // Check file size (max 2MB)
      if (selectedFile.size > 2 * 1024 * 1024) {
        setMessage('File size must be less than 2MB');
        setMessageType('error');
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Handle file upload
  const handleUpload = async (event) => {
    event.preventDefault();
    
    // Validate
    if (!file) {
      setMessage('Please select a file to upload');
      setMessageType('error');
      return;
    }

    setUploading(true);
    setMessage('');
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setMessage('Image uploaded successfully!');
      setMessageType('success');
      
      // Clear form and preview
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh parent component with new uploads
      refreshUploads();
      
      // Close modal after short delay
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage(error.response?.data?.message || 'Error uploading image. Please try again.');
      setMessageType('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-t-lg">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <FaUpload className="mr-2" />
            Upload Image
          </h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors focus:outline-none"
            disabled={uploading}
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleUpload}>
            {/* File drop area */}
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
                preview ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="max-h-48 max-w-full rounded"
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <FaImage className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-lg font-medium text-gray-700">Drop image here or click to browse</p>
                  <p className="text-sm text-gray-500 mt-1">JPG, PNG, GIF up to 2MB</p>
                </div>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/gif"
                className="hidden"
              />
            </div>
            
            {/* Error/success message */}
            {message && (
              <div className={`mt-4 p-3 rounded ${
                messageType === 'error' 
                  ? 'bg-red-100 text-red-700 border border-red-200' 
                  : 'bg-green-100 text-green-700 border border-green-200'
              }`}>
                {message}
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                  uploading 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
                disabled={uploading || !file}
              >
                {uploading ? (
                  <span className="flex items-center">
                    <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Uploading...
                  </span>
                ) : 'Upload Image'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadModal;