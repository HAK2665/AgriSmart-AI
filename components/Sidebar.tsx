
import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, isOpen = false, onClose }) => {
  const menuItems = [
    { path: '/', icon: 'fa-chart-pie', label: 'Dashboard' },
    { path: '/detect', icon: 'fa-virus', label: 'Disease Detection' },
    { path: '/soil', icon: 'fa-seedling', label: 'Soil Analysis' },
    { path: '/calendar', icon: 'fa-calendar-alt', label: 'Crop Calendar' },
    { path: '/search', icon: 'fa-search', label: 'Expert Search' },
    { path: '/profile', icon: 'fa-user-circle', label: 'My Profile' },
  ];

  return (
    <>
      {/* Backdrop for mobile when sidebar open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 bg-green-800 text-white flex flex-col md:static md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-green-700">
            <i className="fas fa-leaf text-2xl"></i>
          </div>
          <span className="text-2xl font-bold tracking-tight">AgriSmart AI</span>
          <button
            className="ml-auto md:hidden p-2 rounded-lg hover:bg-green-700/50"
            onClick={onClose}
            aria-label="Close menu"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                ? 'bg-green-700 text-white shadow-lg shadow-green-900/20' 
                : 'text-green-100 hover:bg-green-700/50 hover:text-white'
              }`
            }
          >
            <i className={`fas ${item.icon} w-6 text-center`}></i>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-green-700/50">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-green-100 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors"
        >
          <i className="fas fa-sign-out-alt w-6 text-center"></i>
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
