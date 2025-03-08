import { useState, useRef } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import UserList from '../../components/admin/users/UserList';
import { FaUsersCog } from 'react-icons/fa';

function Users() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const usersListRef = useRef();

  const handleEditUser = (user) => {
    console.log("Edit user:", user);
    // Functionality would be implemented here
  };

  const refreshUsers = () => {
    if (usersListRef.current) {
      usersListRef.current.fetchUsers();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FaUsersCog className="mr-2 text-indigo-600" />
                Users Management
              </h1>
            </div>
            
            <UserList ref={usersListRef} onEdit={handleEditUser} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Users;