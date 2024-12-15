import React, { useState } from 'react';
import axios from 'axios';

function UploadModal({ isOpen, onClose, refreshUploads }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage('Selecione um arquivo para enviar.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data.message);
      refreshUploads(); // Atualiza a lista após upload
      onClose(); // Fecha o modal
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setMessage('Erro ao fazer upload da imagem.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
        <form onSubmit={handleUpload}>
          <input type="file" onChange={handleFileChange} accept="image/*" className="mb-4" />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">
              Upload
            </button>
          </div>
        </form>
        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}

export default UploadModal;
