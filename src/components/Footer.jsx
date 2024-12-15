import { FaGithub, FaTwitter, FaInstagram, FaDiscord } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">AnimeShop</h3>
            <p className="text-gray-400">Your one-stop shop for all things anime and manga!</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-400 hover:text-primary">About Us</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-primary">Contact</a></li>
              <li><a href="/shipping" className="text-gray-400 hover:text-primary">Shipping Info</a></li>
              <li><a href="/returns" className="text-gray-400 hover:text-primary">Returns</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><a href="/manga" className="text-gray-400 hover:text-primary">Manga</a></li>
              <li><a href="/anime" className="text-gray-400 hover:text-primary">Anime Merchandise</a></li>
              <li><a href="/figures" className="text-gray-400 hover:text-primary">Figures</a></li>
              <li><a href="/accessories" className="text-gray-400 hover:text-primary">Accessories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary"><FaTwitter size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-primary"><FaInstagram size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-primary"><FaDiscord size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-primary"><FaGithub size={24} /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} AnimeShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;