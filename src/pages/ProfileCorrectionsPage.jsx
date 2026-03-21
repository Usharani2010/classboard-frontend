import React, { useEffect, useState } from 'react';

import { profileAPI } from '../api';

export const ProfileCorrectionsPage = () => {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ field_name: 'name', current_value: '', requested_value: '', reason: '' });
  const loadRequests = async () => { const response = await profileAPI.getCorrections(); setRequests(response.data); };
  useEffect(() => { loadRequests(); }, []);
  return (
    <div className="space-y-6">
      <form onSubmit={(event) => { event.preventDefault(); profileAPI.requestCorrection(form).then(() => { setForm({ field_name: 'name', current_value: '', requested_value: '', reason: '' }); loadRequests(); }); }} className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2">
        <select value={form.field_name} onChange={(event) => setForm((current) => ({ ...current, field_name: event.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3">{['name', 'email', 'student_id', 'degree_id', 'branch_id', 'year', 'class_id'].map((field) => <option key={field} value={field}>{field}</option>)}</select>
        <input value={form.current_value} onChange={(event) => setForm((current) => ({ ...current, current_value: event.target.value }))} placeholder="Current value" className="rounded-xl border border-slate-200 px-4 py-3" />
        <input value={form.requested_value} onChange={(event) => setForm((current) => ({ ...current, requested_value: event.target.value }))} placeholder="Requested value" className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" required />
        <textarea value={form.reason} onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))} placeholder="Reason" className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" rows="3" />
        <button type="submit" className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white md:col-span-2">Submit Request</button>
      </form>
      <div className="space-y-4">
        {requests.map((request) => <div key={request.id} className="rounded-3xl bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-semibold text-slate-900">{request.field_name}</h3><p className="mt-2 text-sm text-slate-600">{request.current_value || '-'} to {request.requested_value}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">{request.status}</span></div><p className="mt-3 text-sm text-slate-500">{request.reason || 'No reason provided.'}</p></div>)}
      </div>
    </div>
  );
};
