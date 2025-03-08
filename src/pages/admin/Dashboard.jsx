import { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import DashboardStats from '../../components/admin/DashboardStats';
import RecentOrders from '../../components/admin/RecentOrders';
import TopProducts from '../../components/admin/TopProducts';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              
              <div className="flex space-x-3">
                <select className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>Last year</option>
                </select>
                
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow-sm transition-colors text-sm">
                  Export Report
                </button>
              </div>
            </div>
            
            <DashboardStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
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