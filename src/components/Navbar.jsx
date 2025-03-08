import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaShoppingCart } from 'react-icons/fa';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isLoggedIn = Boolean(token);
  const userName = localStorage.getItem('userName');

  // Update cart count whenever localStorage changes
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };

    // Initial count
    updateCartCount();

    // Listen for custom event
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-dark to-purple-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white">
              <span className="text-primary bg-white px-2 py-1 rounded mr-1">Anime</span>
              <span className="text-secondary">Shop</span>
            </Link>
          </div>

          {/* Menu desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              <Link to="/" className="hover:text-secondary transition-colors text-white font-medium">Home</Link>
              <Link to="/manga" className="hover:text-secondary transition-colors text-white font-medium">Manga</Link>
              <Link to="/anime" className="hover:text-secondary transition-colors text-white font-medium">Anime</Link>
              <Link to="/cart" className="relative">
                <FaShoppingCart className="text-xl text-white hover:text-secondary transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              <div className="border-l border-gray-600 h-6 mx-2"></div>

              {/* Dropdown for logged-in user */}
              {isLoggedIn ? (
                <>
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="hover:text-secondary transition-colors flex items-center text-white"
                    >
                      <FaUser className="mr-2" />
                      {userName}
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white text-dark shadow-lg rounded-md z-50 overflow-hidden">
                        <Link to="/buy-history" className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-100">
                          Buy History
                        </Link>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-primary to-purple-800 text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity shadow-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-secondary transition-colors flex items-center text-white">
                    <FaUser className="mr-2" />
                    Login
                  </Link>
                  <Link to="/register" className="bg-gradient-to-r from-primary to-purple-800 text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity shadow-md">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-dark bg-opacity-95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block py-3 px-4 font-medium rounded-md hover:bg-gray-800 transition-colors">Home</Link>
            <Link to="/manga" className="block py-3 px-4 font-medium rounded-md hover:bg-gray-800 transition-colors">Manga</Link>
            <Link to="/anime" className="block py-3 px-4 font-medium rounded-md hover:bg-gray-800 transition-colors">Anime</Link>
            <Link to="/cart" className="block py-3 px-4 font-medium rounded-md hover:bg-gray-800 transition-colors flex items-center">
              <div className="relative">
                <FaShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="ml-2">Cart</span>
            </Link>

            {/* Mobile login/user section */}
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="block w-full text-left py-3 px-4 font-medium rounded-md hover:bg-gray-800 transition-colors"
                >
                  <FaUser className="inline mr-2" /> {userName}
                </button>
                {isDropdownOpen && (
                  <div className="bg-gray-900 rounded-md my-1">
                    <Link to="/buy-history" className="block py-3 px-8 hover:bg-gray-800 rounded-md transition-colors">
                      Buy History
                    </Link>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-3 px-4 font-medium bg-gradient-to-r from-primary to-purple-800 rounded-md transition-colors mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-3 px-4 font-medium rounded-md hover:bg-gray-800 transition-colors">
                  <FaUser className="inline mr-2" /> Login
                </Link>
                <Link to="/register" className="block py-3 px-4 font-medium bg-gradient-to-r from-primary to-purple-800 rounded-md transition-colors mt-2">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
