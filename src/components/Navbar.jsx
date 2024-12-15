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
    <nav className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              AnimeShop
            </Link>
          </div>

          {/* Menu desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <Link to="/manga" className="hover:text-primary transition-colors">Manga</Link>
              <Link to="/anime" className="hover:text-primary transition-colors">Anime</Link>
              <Link to="/cart" className="relative">
                <FaShoppingCart className="text-xl hover:text-primary transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
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
                      className="hover:text-primary transition-colors flex items-center"
                    >
                      {userName}
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md z-50">
                        <Link to="/buy-history" className="block px-4 py-2 hover:bg-gray-200">
                          Buy History
                        </Link>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-primary transition-colors flex items-center">
                    <FaUser className="mr-2" />
                    Login
                  </Link>
                  <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block hover:text-primary transition-colors">Home</Link>
            <Link to="/manga" className="block hover:text-primary transition-colors">Manga</Link>
            <Link to="/anime" className="block hover:text-primary transition-colors">Anime</Link>
            <Link to="/cart" className="block hover:text-primary transition-colors flex items-center">
              <div className="relative">
                <FaShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="ml-2">Cart</span>
            </Link>

            {/* Rest of mobile menu remains the same */}
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="block w-full text-left hover:text-primary transition-colors"
                >
                  {userName}
                </button>
                {isDropdownOpen && (
                  <div className="mt-2 bg-white text-black shadow-lg rounded-md">
                    <Link to="/buy-history" className="block px-4 py-2 hover:bg-gray-200">
                      Buy History
                    </Link>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block hover:text-primary transition-colors">
                  Login
                </Link>
                <Link to="/register" className="block hover:text-primary transition-colors">
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
