import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStatsApi } from '../../api/services.js';
import { Link } from 'react-router-dom';
import { FiUsers, FiUploadCloud, FiList, FiArrowRight, FiActivity, FiCheckSquare } from 'react-icons/fi';

const DashboardPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['stats'],
    queryFn: getStatsApi
  });

  const stats = data?.data || { totalAgents: 0, totalTasks: 0, pendingTasks: 0, completedTasks: 0 };

  const cards = [
    {
      title: 'Agent Management',
      desc: 'Add, view, and organize agent profiles.',
      path: '/agents',
      icon: FiUsers,
      color: 'bg-oat-200 text-slate-800 border-oat-400',
      btnColor: 'bg-oat-500 hover:bg-oat-400 text-slate-850'
    },
    {
      title: 'CSV/Excel Upload',
      desc: 'Upload lead lists to distribute them among agents.',
      path: '/upload',
      icon: FiUploadCloud,
      color: 'bg-oat-200 text-slate-800 border-oat-400',
      btnColor: 'bg-oat-500 hover:bg-oat-400 text-slate-850'
    },
    {
      title: 'Agent Task View',
      desc: 'View distributed tasks grouped by agent.',
      path: '/tasks',
      icon: FiList,
      color: 'bg-oat-200 text-slate-800 border-oat-400',
      btnColor: 'bg-oat-500 hover:bg-oat-400 text-slate-850'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-oat-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 font-semibold text-sm">
        Failed to load statistics. Please try reloading the page.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-oat-100 p-6 rounded-2xl border border-oat-400 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-semibold text-slate-600">Total Agents</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.totalAgents}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-oat-200 text-slate-800 flex items-center justify-center text-xl border border-oat-400">
            <FiUsers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-oat-100 p-6 rounded-2xl border border-oat-400 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-semibold text-slate-600">Total Tasks</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.totalTasks}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-oat-200 text-slate-800 flex items-center justify-center text-xl border border-oat-400">
            <FiList className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-oat-100 p-6 rounded-2xl border border-oat-400 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-semibold text-slate-600">Pending Tasks</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.pendingTasks}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-oat-200 text-slate-800 flex items-center justify-center text-xl border border-oat-400">
            <FiActivity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-oat-100 p-6 rounded-2xl border border-oat-400 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-semibold text-slate-600">Completed Tasks</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.completedTasks}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-oat-200 text-slate-800 flex items-center justify-center text-xl border border-oat-400">
            <FiCheckSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="bg-oat-100 p-6 rounded-2xl border border-oat-400 flex flex-col justify-between h-48 shadow-sm">
                <div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${card.color} mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-800">{card.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{card.desc}</p>
                </div>
                <Link
                  to={card.path}
                  className={`mt-4 inline-flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-bold transition-all border border-oat-400 ${card.btnColor}`}
                >
                  Open <FiArrowRight className="w-3 h-3" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
