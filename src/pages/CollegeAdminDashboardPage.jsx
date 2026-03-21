import React, { useEffect, useState } from 'react';

import { dashboardAPI } from '../api';

export const CollegeAdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    dashboardAPI.getCollegeAdmin().then((response) => setStats(response.data));
  }, []);
  const cards = stats ? [
    ['Degrees', stats.degrees_count],
    ['Branches', stats.branches_count],
    ['Students', stats.students_count],
    ['Classes', stats.classes_count],
    ['Pending Issues', stats.pending_issues],
    ['Pending Profile Requests', stats.pending_profile_requests],
  ] : [];
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{cards.map(([label, value]) => <div key={label} className="rounded-3xl bg-white p-6 shadow-sm"><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-3 text-4xl font-bold text-slate-900">{value}</p></div>)}</div>;
};
