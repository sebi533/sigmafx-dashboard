import React from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { isAdmin } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'invest', label: 'Investment Plans', icon: '💼' },
    { id: 'deposit', label: 'Deposit & Withdraw', icon: '💳' },
    { id: 'referral', label: 'Referral System', icon: '👥' },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Panel', icon: '⚙️' }] : [])
  ];

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200">
      <nav className="mt-8">
        <div className="px-6 mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Navigation
          </h3>
        </div>
        <div className="space-y-1 px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
        
        <div className="mt-8 px-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
            <h4 className="font-medium mb-1">Need Help?</h4>
            <p className="text-xs text-blue-100 mb-3">
              Contact our 24/7 support team
            </p>
            <button className="bg-white text-blue-600 text-xs font-medium px-3 py-1 rounded">
              Contact Support
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;