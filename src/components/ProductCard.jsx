import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleSeeDetails = (e) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer"
    >
      <img 
        src={`http://localhost:5000/assets/images/${product.image_url}`}
        alt={product.name}
        className="w-full h-72 object-cover mt-1"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-dark mt-1">{product.name}</h3>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-primary font-bold">${product.price}</span>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
            onClick={handleSeeDetails}
          >
            See Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
