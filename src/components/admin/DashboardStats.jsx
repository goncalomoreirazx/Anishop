function DashboardStats() {
    const stats = [
      { label: 'Total Sales', value: '$12,345', change: '+12%' },
      { label: 'Active Users', value: '1,234', change: '+5%' },
      { label: 'New Orders', value: '43', change: '+8%' },
      { label: 'Products', value: '156', change: '+3%' },
    ];
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <span className="ml-2 text-sm font-medium text-green-600">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  export default DashboardStats;