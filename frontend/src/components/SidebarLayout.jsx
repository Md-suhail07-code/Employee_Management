import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../api/auth';
import { 
  BarChart3, 
  Users, 
  BriefcaseBusiness, 
  CheckSquare, 
  LogOut, 
  Menu, 
  X, 
  UserCircle 
} from 'lucide-react';

export default function SidebarLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch logged-in admin data safely
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin User' };

  const navItems = [
    { name: 'Reports Overview', path: '/dashboard', icon: BarChart3 },
    { name: 'Employees', path: '/dashboard/employees', icon: Users },
    { name: 'Projects', path: '/dashboard/projects', icon: BriefcaseBusiness },
    { name: 'Tasks', path: '/dashboard/tasks', icon: CheckSquare },
  ];

  const handleLogout = () => {
    authService.logout(); // Clears localStorage tokens
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white p-4 transition-transform md:static md:translate-x-0
        dark:border-slate-800 dark:bg-slate-950
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between px-2">
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
            SmartManager <span className="text-xs font-semibold text-indigo-600">PRO</span>
          </span>
          <button onClick={() => setIsOpen(false)} className="rounded p-1 text-slate-500 hover:bg-slate-100 md:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Item Links */}
        <nav className="mt-6 flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-slate-900 text-slate-50 dark:bg-slate-50 dark:text-slate-900' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout Segment */}
        <div className="mt-auto border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <UserCircle className="h-8 w-8 text-slate-400" />
            <div className="flex flex-col min-w-0">
              <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{user.name}</span>
              <span className="text-xs text-slate-400">System Administrator</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Primary Content Viewport Wrapper */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Mobile Header Topbar */}
        <header className="flex h-14 items-center border-b border-slate-200 bg-white px-4 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <button onClick={() => setIsOpen(true)} className="rounded p-1 text-slate-500 hover:bg-slate-100">
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-4 text-sm font-bold text-slate-900 dark:text-slate-50">SmartManager</span>
        </header>

        {/* Dynamic Route Viewport View Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}