import { useState, useRef } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import UserList from '../../components/admin/users/UserList';
import { FaPlus } from 'react-icons/fa';

function Users() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const usersListRef = useRef(); // Cria uma referência para o componente UserList

  const handleEditUser = (user) => {
    console.log("Edit user:", user);
    // Aqui você pode implementar a lógica para abrir um modal ou navegar para uma página de edição
  };

  const refreshUsers = () => {
    if (usersListRef.current) {
      usersListRef.current.fetchUsers(); // Chama o método fetchUsers do UserList
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Users Management</h1>
            </div>
            
            <UserList ref={usersListRef} onEdit={handleEditUser} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Users;
