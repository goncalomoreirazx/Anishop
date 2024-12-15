import React from 'react';
import checkmarkImage from '../assets/checkmark.jpg';

const ModalItem = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg text-center">
        <img src={checkmarkImage} alt="Checkmark" className="h-16 w-16 mx-auto mb-4" />
        <p className="text-xl font-semibold">Adicionado ao carro com sucesso!</p>
      </div>
    </div>
  );
};

export default ModalItem;
