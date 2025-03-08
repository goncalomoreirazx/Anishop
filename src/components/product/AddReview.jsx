import React, { useState, useEffect } from 'react'; 
import { FaStar } from 'react-icons/fa'; 
import axios from 'axios'; 
import PropTypes from 'prop-types';  

function AddReview({ productId, onReviewAdded }) {
   const [rating, setRating] = useState(0);
   const [comment, setComment] = useState('');
   const [hover, setHover] = useState(0);
   const [userId, setUserId] = useState(null);
   const [submitting, setSubmitting] = useState(false);

   useEffect(() => {
     // Tenta obter o userId de diferentes formas
     const token = localStorage.getItem('token');
     
     if (token) {
       try {
         // Se você estiver armazenando o userId no token decodificado
         const decodedToken = JSON.parse(atob(token.split('.')[1]));
         setUserId(decodedToken.id);
       } catch (error) {
         // Se a decodificação do token falhar, tenta outras formas
         const storedUser = localStorage.getItem('user');
         const userInfo = storedUser ? JSON.parse(storedUser) : null;
         
         if (userInfo && userInfo.id) {
           setUserId(userInfo.id);
         } else {
           // Se ainda não encontrar, tenta buscar de outra fonte
           const userIdFromStorage = localStorage.getItem('userId');
           if (userIdFromStorage) {
             setUserId(parseInt(userIdFromStorage));
           }
         }
       }
     }
   }, []);

   const isLoggedIn = localStorage.getItem('token');

   const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      alert('You must be logged in to add a review!');
      return;
    }

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setSubmitting(true);

    try {
       const response = await axios.post('http://localhost:5000/api/products/reviews', {
         product_id: productId,
         user_id: userId,
         rating,
         comment
       }, {
         headers: {
           'Authorization': `Bearer ${isLoggedIn}`
         }
       });

       // Limpar formulário após envio bem-sucedido
       setRating(0);
       setComment('');
       setSubmitting(false);

       // Notificar componente pai para atualizar reviews
       onReviewAdded();

       alert('Avaliação enviada com sucesso!');
     }  catch (error) {
      console.error('Error submitting review:', error);
      alert('An error occurred while submitting your review. Please try again.');
      setSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="mt-12 bg-gray-50 p-6 rounded-xl text-center">
        <p className="text-gray-700 mb-4">Please log in to leave a review</p>
        <Link to="/login" className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors">
          Log In
        </Link>
      </div>
    );
  }

   return (
     <div className="mt-12 bg-white p-8 rounded-xl shadow-card">
      <h3 className="text-xl font-semibold mb-6">Write a Review</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, index) => {
              index += 1;
              return (
                <button
                  type="button"
                  key={index}
                  className={`
                    w-8 h-8 ${
                      index <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
                    }
                    focus:outline-none
                  `}
                  onClick={() => setRating(index)}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(rating)}
                >
                  <FaStar className="w-full h-full" />
                </button>
              );
            })}
            <span className="ml-2 text-gray-700">{rating > 0 ? `${rating} / 5` : 'Select rating'}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary resize-none"
            rows="4"
            placeholder="Share your thoughts about this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={submitting || rating === 0}
          className={`w-full py-3 rounded-md font-medium ${
            submitting || rating === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary to-purple-800 text-white hover:opacity-90 transition-all'
          }`}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}


AddReview.propTypes = {
   productId: PropTypes.number.isRequired,
   onReviewAdded: PropTypes.func.isRequired
};

export default AddReview;