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
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:static`}>
      <div className="flex items-center justify-between h-16 px-6 bg-primary">
        <span className="text-xl font-bold text-white">Admin Panel</span>
        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(false)}
        >
          <FaTimes />
        </button>
      </div>
      
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center px-4 py-3 text-gray-100 hover:bg-primary rounded-lg transition-colors"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default AdminSidebar;