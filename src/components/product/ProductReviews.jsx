import PropTypes from 'prop-types';
import { FaStar } from 'react-icons/fa';

function ProductReviews({ reviews }) {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-500">No reviews yet. Be the first to leave a review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
          <div className="flex items-center mb-3">
            <div className="bg-primary bg-opacity-10 rounded-full w-10 h-10 flex items-center justify-center mr-3">
              <span className="text-primary font-medium">{review.userName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="font-medium">{review.userName}</p>
              <div className="flex items-center mt-1">
                <div className="flex mr-2">{renderStars(review.rating)}</div>
                <span className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <p className="text-gray-700 ml-13">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}

ProductReviews.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      rating: PropTypes.number.isRequired,
      comment: PropTypes.string.isRequired,
      userName: PropTypes.string.isRequired, // Certifique-se do nome correto
    })
  ).isRequired,
};

export default ProductReviews;
