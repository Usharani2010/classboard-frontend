import React, { useEffect, useState } from 'react';

import { dashboardAPI } from '../api';

export const SystemAdminDashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dashboardAPI.getSystemAdmin().then((response) => setStats(response.data));
  }, []);

  const cards = stats
    ? [
        ['Total Colleges', stats.total_colleges],
        ['Total Users', stats.total_users],
        ['Total Admins', stats.total_admins],
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-3 text-4xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Admin Workspace</h3>
        <p className="mt-2 text-sm text-slate-600">
          This dashboard is limited to college and user administration. Assignments, reminders, and student tools are intentionally excluded.
        </p>
      </div>
    </div>
  );
};
