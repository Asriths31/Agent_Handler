import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiPieChart, FiUsers, FiUploadCloud, FiList, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { removeToken, getUsername } from '../utils/auth.js';
import { MdSupportAgent } from "react-icons/md";
import { logoutApi } from '../api/services.js';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const username = getUsername();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: FiPieChart },
    { name: 'Agents', path: '/agents', icon: FiUsers },
    { name: 'Upload Tasks', path: '/upload', icon: FiUploadCloud },
    { name: 'Agent Task View', path: '/tasks', icon: FiList }
  ];

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout API failed:', error);
    }
    removeToken();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between bg-oat-200 text-slate-800 border-r border-oat-400">
      <div>
        <div className="h-16 flex items-center justify-between px-6 border-b border-oat-400 bg-oat-200">
          <span className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <MdSupportAgent size={30}/> Agent Handler
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-700 hover:text-slate-900 focus:outline-none"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-oat-100 text-slate-900 border border-oat-400'
                    : 'text-slate-700 hover:bg-oat-300 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-slate-900' : 'text-slate-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-oat-400">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-700 hover:bg-red-100/50 transition-all"
        >
          <FiLogOut className="w-5 h-5 text-red-600" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-oat-300">
      <aside className="hidden lg:block w-64 fixed top-0 bottom-0 left-0">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
          <aside className="relative z-50 w-64 h-full animate-slide-in">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:pl-64 min-h-screen">
        <header className="h-16 bg-oat-400 border-b border-oat-500 flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-800 hover:text-slate-950 focus:outline-none"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-slate-900">
              {menuItems.find((item) => item.path === location.pathname)?.name || 'Admin Area'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-oat-200 text-slate-800 flex items-center justify-center font-bold text-sm border border-oat-400">
              {username.substring(0, 2).toUpperCase()}
            </div>
            <span className="text-sm font-semibold text-slate-800">{username}</span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
