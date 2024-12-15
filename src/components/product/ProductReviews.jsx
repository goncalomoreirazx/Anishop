import PropTypes from 'prop-types';
import { FaStar } from 'react-icons/fa';

function ProductReviews({ reviews }) {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!reviews || reviews.length === 0) {
    return <p className="text-gray-600">Nenhuma avaliação encontrada.</p>;
  }

  return (
    <div className="mt-5">
      <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-4">
            <div className="flex items-center mb-2">
              <div className="flex">{renderStars(review.rating)}</div>
              <span className="ml-2 text-sm text-gray-600">
                by {review.userName}
              </span>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
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
