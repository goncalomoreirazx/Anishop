import { FaBars, FaBell, FaUser } from 'react-icons/fa';

function AdminHeader({ onMenuClick }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4">
        <button
          className="text-indigo-600 md:hidden hover:bg-indigo-50 p-2 rounded-md transition-colors"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <FaBars className="h-6 w-6" />
        </button>

        <div className="md:ml-auto flex items-center">
          <div className="relative mr-4 hidden md:block">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </span>
            <input 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-48"
              type="text"
              placeholder="Search..."
            />
          </div>
          
          <button className="relative text-gray-500 hover:text-indigo-600 transition-colors mr-4">
            <FaBell className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
          
          <div className="flex items-center border-l pl-4 border-gray-200">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="ml-2 text-gray-700 font-medium">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;