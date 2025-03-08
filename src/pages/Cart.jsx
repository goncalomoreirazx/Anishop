import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/cart/CartItem'; // Assuming you have a CartItem component
import CartSummary from '../components/cart/CartSummary'; // Assuming you have a CartSummary component

function Cart() {
  const [items, setItems] = useState([]);
  const isLoggedIn = localStorage.getItem('token');  // Verifica se está logado
  const navigate = useNavigate();  // To programmatically navigate

  useEffect(() => {
    // Carregar o carrinho do localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart && Array.isArray(savedCart)) {
      setItems(savedCart); // Atualizando o estado com os itens do carrinho
    } else {
      console.log("Nenhum carrinho encontrado no localStorage.");
    }
  }, []);  // O useEffect só executa uma vez quando o componente monta

  const handleUpdateQuantity = (id, quantity) => {
    setTimeout(() => {
      const updatedItems = items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      setItems(updatedItems);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      window.dispatchEvent(new Event('cartUpdated'));
    }, 0);
  };
  
  const handleRemoveItem = (id) => {
    setTimeout(() => {
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      window.dispatchEvent(new Event('cartUpdated'));
    }, 0);
  };

  const handleProceedToCheckout = () => {
    // Navigate to checkout page and pass cart items
    navigate('/checkout', { state: { items: items } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      {isLoggedIn ? (
        items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* List of cart items */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-card overflow-hidden">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            </div>

            {/* Cart summary and checkout button */}
            <div>
              <CartSummary items={items} />
              <button
                onClick={handleProceedToCheckout}
                className="mt-6 w-full bg-gradient-to-r from-primary to-purple-800 text-white px-6 py-4 rounded-md font-medium shadow-lg hover:opacity-90 transition-all"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-500 mb-4 text-lg">Your cart is empty</p>
            <Link
              to="/"
              className="text-primary hover:text-opacity-80 font-medium inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        )
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-gray-500 mb-4 text-lg">Please log in to view your cart</p>
          <Link
            to="/login"
            className="px-6 py-3 bg-gradient-to-r from-primary to-purple-800 text-white rounded-md font-medium shadow hover:opacity-90 transition-all inline-block"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default Cart;
