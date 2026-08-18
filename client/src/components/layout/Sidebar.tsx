import React from 'react';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Box,
  Compass,
  MessageSquare,
  Bookmark,
  UserCheck,
  Home,
  LogOut,
  Settings,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView } = useUI();
  const { user, role, setRole, logout } = useAuth();

  const navItems = [
    {
      id: role === 'designer' ? 'designer_dashboard' : 'dashboard',
      label: role === 'designer' ? 'Designer Board' : 'Dashboard',
      icon: LayoutDashboard,
    },
    { id: 'studio', label: 'Design Studio', icon: Box },
    { id: 'marketplace', label: 'Find Designers', icon: Compass },
    { id: 'chat', label: 'Messages', icon: MessageSquare, badge: '2' },
    { id: 'saved_layouts', label: 'Saved Layouts', icon: Bookmark },
    { id: 'settings', label: 'Profile & Settings', icon: Settings },
  ];


  return (
    <aside className="w-64 bg-[#F5F4EF] dark:bg-[#0D1117] border-r border-[#E8E6DF] dark:border-[#21262D] flex flex-col justify-between h-screen sticky top-0 select-none z-30 transition-colors duration-200">
      {/* Brand Header */}
      <div className="p-5 space-y-6">
        <div
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-neutral-950 dark:bg-white flex items-center justify-center text-white dark:text-neutral-950 shadow-xs group-hover:scale-105 transition-transform">
            <span className="font-extrabold tracking-widest text-xs text-[#D4AF37] dark:text-[#8C5232]">AE</span>
          </div>
          <div>
            <span className="font-logo font-extrabold tracking-widest text-base text-neutral-950 dark:text-white uppercase">
              AERA
            </span>
            <span className="text-[9px] block text-neutral-400 dark:text-neutral-500 font-semibold tracking-wider uppercase -mt-1">
              Spatial Intelligence
            </span>
          </div>
        </div>

        {/* Role Persona Switcher Pill */}
        <div className="p-1 bg-[#ECEAE3] dark:bg-[#161B22] rounded-xl flex items-center gap-1 border border-[#DFDDD5] dark:border-[#30363D]">
          <button
            onClick={() => {
              setRole('user');
              setCurrentView('dashboard');
            }}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
              role === 'user'
                ? 'bg-white dark:bg-[#21262D] text-neutral-950 dark:text-white shadow-2xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
            }`}
          >
            <Home className="w-3 h-3 text-[#B26A4A] dark:text-[#D4AF37]" />
            <span>Homeowner</span>
          </button>

          <button
            onClick={() => {
              setRole('designer');
              setCurrentView('designer_dashboard');
            }}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
              role === 'designer'
                ? 'bg-white dark:bg-[#21262D] text-neutral-950 dark:text-white shadow-2xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3 h-3 text-blue-600 dark:text-sky-400" />
            <span>Designer</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white dark:bg-[#1C2128] text-neutral-950 dark:text-white shadow-xs border border-[#E0DDD3] dark:border-[#30363D]'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-[#EAE8E1] dark:hover:bg-[#161B22]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#B26A4A] dark:text-[#D4AF37]' : 'text-neutral-400 dark:text-neutral-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="font-mono text-[10px] font-bold bg-[#B26A4A] dark:bg-[#D4AF37] text-white dark:text-neutral-950 px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Actions Footer */}
      <div className="p-4 border-t border-[#E8E6DF] dark:border-[#21262D] space-y-3 bg-[#F0EEE8] dark:bg-[#12161E] transition-colors">
        <div className="flex items-center gap-3">
          <div
            onClick={() => setCurrentView('settings')}
            className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer group"
            title="Open Profile & Settings"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-[#E0DDD3] dark:border-[#30363D] group-hover:ring-2 group-hover:ring-[#D4AF37] transition-all"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-[#B26A4A] dark:group-hover:text-[#D4AF37] transition-colors">
                {user.name}
              </h4>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate capitalize font-medium">
                {role === 'designer' ? 'Verified Spatial Architect' : 'Standard Member'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  );
};
