import React, { useEffect, useState } from 'react';

import { collegeAdminAPI } from '../api';

export const CollegeAdminIssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [openId, setOpenId] = useState(null);
  const loadIssues = async () => { const response = await collegeAdminAPI.getIssues(); setIssues(response.data); };
  useEffect(() => { loadIssues(); }, []);
  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <div key={issue.id} className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{issue.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{issue.issue_type} • {issue.user_name || 'Unknown student'}</p>
            </div>
            <div className="flex items-center gap-3">
              <select value={issue.status} onChange={(event) => collegeAdminAPI.updateIssueStatus(issue.id, event.target.value).then(loadIssues)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                {['open', 'in_progress', 'resolved', 'closed'].map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <button type="button" onClick={() => setOpenId((current) => current === issue.id ? null : issue.id)} className="text-sm font-semibold text-slate-900">{openId === issue.id ? 'Hide Details' : 'View Details'}</button>
            </div>
          </div>
          {openId === issue.id && (
            <div className="mt-4 rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-700">{issue.description}</p>
              {issue.attachments?.[0] && <img src={issue.attachments[0]} alt={issue.title} className="mt-4 max-h-80 rounded-2xl object-contain" />}
            </div>
          )}
        </div>
      ))}
      {!issues.length && <div className="rounded-3xl bg-white p-6 shadow-sm text-sm text-slate-500">No issues reported.</div>}
    </div>
  );
};
