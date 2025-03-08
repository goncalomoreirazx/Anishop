import { Link } from 'react-router-dom';
import { FaTimes, FaHome, FaBox, FaUsers, FaShoppingCart, FaCog, FaImage } from 'react-icons/fa';

function AdminSidebar({ isOpen, setIsOpen }) {
  const menuItems = [
    { icon: FaHome, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: FaBox, label: 'Products', path: '/admin/products' },
    { icon: FaUsers, label: 'Users', path: '/admin/users' },
    { icon: FaShoppingCart, label: 'Orders', path: '/admin/admin-orders' },
    { icon: FaImage, label: 'Image Upload', path: '/admin/upload' },
    { icon: FaCog, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-indigo-900 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:static shadow-lg`}>
      <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-indigo-700 to-purple-700">
        <span className="text-xl font-bold text-white">Ani-Admin</span>
        <button 
          className="md:hidden text-white hover:text-indigo-200 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <FaTimes />
        </button>
      </div>
      
      <div className="mt-6">
        <div className="px-4 py-2">
          <div className="h-10 w-10 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-white font-bold mx-auto mb-2">
            A
          </div>
          <p className="text-center text-white text-sm">Admin Panel</p>
        </div>
        <div className="border-t border-indigo-800 mt-2"></div>
      </div>
      
      <nav className="mt-6">
        <div className="px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center px-4 py-3 text-gray-100 hover:bg-indigo-700 hover:text-white rounded-md transition-colors group"
            >
              <item.icon className="w-5 h-5 mr-3 group-hover:text-purple-300 transition-colors" />
              <span className="group-hover:translate-x-1 transition-transform duration-200">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
      
      <div className="absolute bottom-0 w-full p-4">
        <div className="border-t border-indigo-800 pt-4">
          <p className="text-xs text-indigo-300 text-center">AnimeShop Admin v1.0</p>
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;