import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';

const UploadList = forwardRef((props, ref) => {
  const [uploads, setUploads] = useState([]);

  // Expor o método fetchUploads para o componente pai
  useImperativeHandle(ref, () => ({
    fetchUploads,
  }));

  // Função para buscar os uploads
  const fetchUploads = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/uploads');
      console.log(response.data);  // Verifique o conteúdo retornado da API
      setUploads(response.data);  // Atualiza o estado com os uploads recebidos
    } catch (error) {
      console.error('Erro ao buscar uploads:', error);
    }
  };

  // Chama fetchUploads ao montar o componente
  useEffect(() => {
    fetchUploads();
  }, []); // Isso garante que será chamado apenas uma vez quando o componente for montado

  return (
    <div className="grid grid-cols-4 gap-4">
      {uploads.length > 0 ? (
        uploads.map((upload) => {
          // Verifique se a estrutura é como esperamos, se for uma string ou objeto
          console.log(upload);  // Verifique o conteúdo de cada item (pode ser uma string ou objeto)
          
          return (
            <div key={upload.filename || upload} className="bg-white shadow-md rounded-md p-4">
              {/* Ajuste o caminho da imagem com base na estrutura */}
              <img
                src={`http://localhost:5000/assets/images/${upload.filename || upload}`}  // Se for uma string, use diretamente
                alt={upload.filename || upload}
                className="w-full h-72 object-cover"
              />
              <p className="mt-2 text-center text-sm">{upload.filename || upload}</p> {/* Se for uma string, use diretamente */}
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">Nenhuma imagem carregada</p>
      )}
    </div>
  );
});

export default UploadList;
