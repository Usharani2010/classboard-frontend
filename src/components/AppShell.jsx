import React, { useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Sidebar } from './Sidebar';
import { useAuth } from '../hooks/useAuth';

export const AppShell = ({ title, subtitle, navigation }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const currentItem = useMemo(
    () =>
      navigation.find((item) =>
        item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
      ),
    [location.pathname, navigation]
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar
        title={title}
        subtitle={subtitle}
        items={navigation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((open) => !open)}
      />
      <div className="lg:pl-72">
        <header className="border-b border-slate-200 bg-white px-6 py-5 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="pt-10 lg:pt-0">
              <p className="text-sm font-medium text-slate-500">{user?.name}</p>
              <h2 className="text-2xl font-bold text-slate-900">{currentItem?.label || 'Dashboard'}</h2>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Log Out
            </button>
          </div>
        </header>
        <main className="p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
