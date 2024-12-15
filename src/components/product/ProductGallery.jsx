import { useState } from 'react';

function ProductGallery({ images }) {
  const [mainImage, setMainImage] = useState(images[1]);
  
  return (
    <div className="grid gap-4">
      {/* Exibir a imagem principal */}
      <div className="aspect-w-3 aspect-h-4">
        <img
          src={mainImage}
          alt="Product main view"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Miniaturas */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {images.slice(1).map((image, index) => (  // A partir da segunda imagem (já que a principal é a primeira)
          <button
            key={index}
            onClick={() => setMainImage(image)}
            className={`aspect-w-1 aspect-h-1 ${
              mainImage === image ? 'ring-2 ring-primary' : ''
            }`}
          >
            <img
              src={image}
              alt={`Product view ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductGallery;
