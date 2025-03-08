import { FaMoneyBillAlt, FaUsers, FaShoppingBag, FaBox } from 'react-icons/fa';

function DashboardStats() {
  const stats = [
    { label: 'Total Sales', value: '$12,345', change: '+12%', icon: FaMoneyBillAlt },
    { label: 'Active Users', value: '1,234', change: '+5%', icon: FaUsers },
    { label: 'New Orders', value: '43', change: '+8%', icon: FaShoppingBag },
    { label: 'Products', value: '156', change: '+3%', icon: FaBox },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className={`rounded-full p-3 ${
              index % 4 === 0 ? 'bg-purple-100 text-purple-600' :
              index % 4 === 1 ? 'bg-green-100 text-green-600' :
              index % 4 === 2 ? 'bg-indigo-100 text-indigo-600' :
              'bg-pink-100 text-pink-600'
            }`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <h3 className="ml-3 text-gray-500 text-sm font-medium">{stat.label}</h3>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="mt-1 flex items-center text-sm">
              <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                {stat.change}
              </span>
              <span className="ml-2 text-gray-500">vs last period</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardStats;