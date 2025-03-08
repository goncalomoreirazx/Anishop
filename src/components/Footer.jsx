import { FaGithub, FaTwitter, FaInstagram, FaDiscord } from 'react-icons/fa';

function Footer() {
    return (
      <footer className="bg-gradient-to-r from-dark to-purple-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">
                <span className="text-primary bg-white px-2 py-1 rounded mr-1">Anime</span>
                <span className="text-secondary">Shop</span>
              </h3>
              <p className="text-gray-300">Your one-stop shop for all things anime and manga!</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white border-b border-gray-700 pb-2">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="/about" className="text-gray-300 hover:text-secondary transition-colors">About Us</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-secondary transition-colors">Contact</a></li>
                <li><a href="/shipping" className="text-gray-300 hover:text-secondary transition-colors">Shipping Info</a></li>
                <li><a href="/returns" className="text-gray-300 hover:text-secondary transition-colors">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white border-b border-gray-700 pb-2">Categories</h4>
              <ul className="space-y-3">
                <li><a href="/manga" className="text-gray-300 hover:text-secondary transition-colors">Manga</a></li>
                <li><a href="/anime" className="text-gray-300 hover:text-secondary transition-colors">Anime Merchandise</a></li>
                <li><a href="/figures" className="text-gray-300 hover:text-secondary transition-colors">Figures</a></li>
                <li><a href="/accessories" className="text-gray-300 hover:text-secondary transition-colors">Accessories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white border-b border-gray-700 pb-2">Follow Us</h4>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-300 hover:text-secondary transition-transform hover:scale-110">
                  <FaTwitter size={28} />
                </a>
                <a href="#" className="text-gray-300 hover:text-secondary transition-transform hover:scale-110">
                  <FaInstagram size={28} />
                </a>
                <a href="#" className="text-gray-300 hover:text-secondary transition-transform hover:scale-110">
                  <FaDiscord size={28} />
                </a>
                <a href="#" className="text-gray-300 hover:text-secondary transition-transform hover:scale-110">
                  <FaGithub size={28} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} AnimeShop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }

export default Footer;