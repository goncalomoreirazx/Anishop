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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      {isLoggedIn ? (
        items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {items.map((item) => (
                <CartItem
                  key={item.id}  // A chave única do item é importante para evitar renderizações erradas
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
            <div>
              <CartSummary items={items} />
              <button
                onClick={handleProceedToCheckout}
                className="mt-4 w-full bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors inline-block text-center"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link
              to="/"
              className="text-primary hover:text-opacity-90"
            >
              Continue Shopping
            </Link>
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Please log in to view your cart</p>
          <Link
            to="/login"
            className="text-primary hover:text-opacity-90"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default Cart;
