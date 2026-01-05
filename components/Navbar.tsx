
import React from 'react';
import { UserProfile } from '../types';
import { Link } from 'react-router-dom';

interface NavbarProps {
  user: UserProfile;
  onToggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onToggleSidebar }) => {
  return (
    <nav className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded-lg md:hidden hover:bg-slate-100"
          onClick={onToggleSidebar}
          aria-label="Open menu"
        >
          <i className="fas fa-bars text-slate-600"></i>
        </button>
        <h1 className="text-xl font-bold text-green-700 md:hidden">AgriSmart</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <Link to="/search" className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
          <i className="fas fa-search"></i>
        </Link>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">{user.displayName}</p>
            <p className="text-xs text-slate-500 capitalize">{user.location || 'Rural Region'}</p>
          </div>
          <Link to="/profile">
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=059669&color=fff`} 
              alt="Profile" 
              className="w-10 h-10 rounded-full border-2 border-green-100 hover:border-green-300 transition-colors"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
