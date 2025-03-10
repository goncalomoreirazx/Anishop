import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
  const navigate = useNavigate();
  
  // Check if product has a discount
  const hasDiscount = product.discount_percentage > 0;
  
  // Calculate the discounted price if there is a discount
  const finalPrice = hasDiscount 
    ? parseFloat((product.price * (1 - product.discount_percentage / 100)).toFixed(2))
    : product.price;

  const handleSeeDetails = (e) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-hover hover:-translate-y-1 cursor-pointer relative">
      {/* Discount badge */}
      {hasDiscount && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-md animate-pulse">
          {product.discount_percentage}% OFF
        </div>
      )}
      
      <div className="h-72 overflow-hidden">
        <img 
          src={`http://localhost:5000/assets/images/${product.image_url}`}
          alt={product.name}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-dark mt-1 line-clamp-1">{product.name}</h3>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-primary font-bold text-xl">${finalPrice}</span>
                <span className="text-gray-500 text-sm line-through">${product.price}</span>
              </>
            ) : (
              <span className="text-primary font-bold text-xl">${product.price}</span>
            )}
          </div>
          <button 
            className="bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-2 rounded-md hover:opacity-90 transition-all duration-300 shadow-md"
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