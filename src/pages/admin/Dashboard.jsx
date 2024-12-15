import { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import DashboardStats from '../../components/admin/DashboardStats';
import RecentOrders from '../../components/admin/RecentOrders';
import TopProducts from '../../components/admin/TopProducts';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
            
            <DashboardStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <RecentOrders />
              <TopProducts />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;