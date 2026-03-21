import React, { useEffect, useState } from 'react';

import { dashboardAPI } from '../api';

export const StudentDashboardPage = () => {
  const [stats, setStats] = useState(null);
  useEffect(() => { dashboardAPI.getStudent().then((response) => setStats(response.data)); }, []);
  const cards = stats ? [['Assignments', stats.assignments_count], ['Announcements', stats.announcements_count], ['Schedules', stats.schedules_count], ['Reminders', stats.reminders_count], ['Open Issues', stats.open_issues_count]] : [];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">{cards.map(([label, value]) => <div key={label} className="rounded-3xl bg-white p-6 shadow-sm"><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-3 text-4xl font-bold text-slate-900">{value}</p></div>)}</div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Recent Assignments</h3>
          <div className="mt-4 space-y-3">
            {stats?.recent_assignments?.length ? stats.recent_assignments.map((item) => <div key={item.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-medium text-slate-900">{item.title}</p><p className="mt-1 text-sm text-slate-500">Due {new Date(item.due_date).toLocaleString()}</p></div>) : <p className="text-sm text-slate-500">No assignments available.</p>}
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Recent Announcements</h3>
          <div className="mt-4 space-y-3">
            {stats?.recent_announcements?.length ? stats.recent_announcements.map((item) => <div key={item.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-medium text-slate-900">{item.title}</p><p className="mt-1 text-sm text-slate-500">By {item.created_by_name || 'Unknown'} on {new Date(item.created_at).toLocaleString()}</p></div>) : <p className="text-sm text-slate-500">No announcements available.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
