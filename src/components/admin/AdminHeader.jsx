import { FaBars, FaBell, FaUser } from 'react-icons/fa';

function AdminHeader({ onMenuClick }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between h-16 px-4">
        <button
          className="text-gray-500 md:hidden"
          onClick={onMenuClick}
        >
          <FaBars className="h-6 w-6" />
        </button>

        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700">
            <FaBell className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-2">
            <FaUser className="h-6 w-6 text-gray-500" />
            <span className="text-gray-700">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;