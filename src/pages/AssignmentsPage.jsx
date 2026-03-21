import React, { useEffect, useState } from 'react';

import { assignmentsAPI } from '../api';
import { useAuth } from '../hooks/useAuth';
import { uploadMediaIfPresent } from '../utils/uploadMedia';

export const AssignmentsPage = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', due_date: '', class_id: user?.class_id || '' });
  const classLabel = user?.class_code || 'Class code unavailable';
  const canCreateAssignment = Boolean(form.class_id);

  const loadAssignments = async () => {
    const response = await assignmentsAPI.getAll();
    setAssignments(response.data);
  };

  useEffect(() => {
    loadAssignments();
    if (user?.role === 'cr') {
      setForm((current) => ({ ...current, class_id: user.class_id || '' }));
    }
  }, [user?.class_id, user?.role]);

  return (
    <div className="space-y-6">
      {user?.role === 'cr' && (
        <form onSubmit={async (event) => { event.preventDefault(); const media = await uploadMediaIfPresent(file); await assignmentsAPI.create({ ...form, due_date: new Date(form.due_date).toISOString(), ...media }); setForm({ title: '', description: '', due_date: '', class_id: user.class_id || '' }); setFile(null); loadAssignments(); }} className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Target class</p>
            <p className="mt-1 text-sm font-medium text-slate-900">{classLabel}</p>
            <p className="mt-1 text-xs text-slate-500">Assignments created here are automatically limited to your class.</p>
          </div>
          {!canCreateAssignment && (
            <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 md:col-span-2">
              Your account is not linked to a class yet, so assignment creation is unavailable.
            </div>
          )}
          <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Title" className="rounded-xl border border-slate-200 px-4 py-3" required />
          <input type="datetime-local" value={form.due_date} onChange={(event) => setForm((current) => ({ ...current, due_date: event.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" required />
          <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Description" className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" rows="4" required />
          <input type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} className="rounded-xl border border-slate-200 px-4 py-3" />
          <button type="submit" disabled={!canCreateAssignment} className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2">Create Assignment</button>
        </form>
      )}
      <div className="grid gap-4 xl:grid-cols-2">
        {assignments.map((assignment) => <div key={assignment.id} className="rounded-3xl bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-semibold text-slate-900">{assignment.title}</h3><p className="mt-2 text-sm text-slate-600">{assignment.description}</p><p className="mt-3 text-sm text-slate-500">By {assignment.created_by_name || 'Unknown'}</p></div>{user?.role === 'cr' && <button type="button" onClick={() => assignmentsAPI.delete(assignment.id).then(loadAssignments)} className="text-sm font-semibold text-rose-600">Delete</button>}</div><p className="mt-4 text-sm text-slate-500">Due {new Date(assignment.due_date).toLocaleString()}</p>{assignment.media_url && <a href={assignment.media_url} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-semibold text-slate-900">Open attachment</a>}</div>)}
      </div>
      {!assignments.length && <div className="rounded-3xl bg-white p-6 shadow-sm text-sm text-slate-500">No assignments available.</div>}
    </div>
  );
};
