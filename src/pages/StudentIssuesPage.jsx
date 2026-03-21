import React, { useEffect, useState } from 'react';

import { profileAPI } from '../api';
import { uploadMediaIfPresent } from '../utils/uploadMedia';

export const StudentIssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ issue_type: 'other', title: '', description: '' });

  const loadIssues = async () => {
    const response = await profileAPI.getIssues();
    setIssues(response.data);
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const media = await uploadMediaIfPresent(file);
    await profileAPI.reportIssue({
      ...form,
      attachments: media.attachments,
    });
    setForm({ issue_type: 'other', title: '', description: '' });
    setFile(null);
    loadIssues();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2">
        <select value={form.issue_type} onChange={(event) => setForm((current) => ({ ...current, issue_type: event.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3">
          {['profile_data', 'schedule', 'assignment', 'system_bug', 'other'].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Issue title" className="rounded-xl border border-slate-200 px-4 py-3" required />
        <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Describe the issue" className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" rows="4" required />
        <input type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} className="rounded-xl border border-slate-200 px-4 py-3" />
        <button type="submit" className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
          Report Issue
        </button>
      </form>
      <div className="space-y-4">
        {issues.map((issue) => (
          <div key={issue.id} className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{issue.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{issue.issue_type}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                {issue.status}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-600">{issue.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
