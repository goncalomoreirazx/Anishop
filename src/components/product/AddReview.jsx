import React, { useState, useEffect } from 'react'; 
import { FaStar } from 'react-icons/fa'; 
import axios from 'axios'; 
import PropTypes from 'prop-types';  

function AddReview({ productId, onReviewAdded }) {
   const [rating, setRating] = useState(0);
   const [comment, setComment] = useState('');
   const [hover, setHover] = useState(0);
   const [userId, setUserId] = useState(null);

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
       alert('Você precisa estar logado para adicionar uma avaliação!');
       return;
     }

     if (!userId) {
       alert('Erro: Informações do usuário não encontradas. Por favor, faça login novamente.');
       return;
     }

     if (rating === 0) {
       alert('Por favor, selecione uma classificação');
       return;
     }

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

       // Notificar componente pai para atualizar reviews
       onReviewAdded();

       alert('Avaliação enviada com sucesso!');
     } catch (error) {
       console.error('Erro ao enviar avaliação:', error.response ? error.response.data : error);
       alert(`Erro ao enviar avaliação: ${error.response?.data?.error || 'Tente novamente'}`);
     }
   };

   return (
     <div className="mt-8 bg-gray-100 p-6 rounded-lg">
       <h3 className="text-xl font-semibold mb-4">Adicionar Avaliação</h3>
       
       <form onSubmit={handleSubmit}>
         <div className="flex items-center mb-4">
           {[...Array(5)].map((star, index) => {
             index += 1;
             return (
               <FaStar
                 key={index}
                 className={`
                   ${index <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'}
                   cursor-pointer mr-1
                 `}
                 onClick={() => setRating(index)}
                 onMouseEnter={() => setHover(index)}
                 onMouseLeave={() => setHover(rating)}
               />
             );
           })}
           <span className="ml-2">{rating} / 5</span>
         </div>
         
         <textarea
           className="w-full p-2 border rounded-md"
           rows="4"
           placeholder="Deixe seu comentário sobre o produto..."
           value={comment}
           onChange={(e) => setComment(e.target.value)}
           required
         />
         
         <button
           type="submit"
           className="mt-4 w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 transition-colors"
         >
           Enviar Avaliação
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