import React, { useEffect, useState } from 'react';

import { announcementsAPI } from '../api';
import { useAuth } from '../hooks/useAuth';
import { uploadMediaIfPresent } from '../utils/uploadMedia';

export const AnnouncementsPage = ({ adminMode = false }) => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', tags: '' });

  const loadAnnouncements = async () => {
    const response = await announcementsAPI.getAll();
    setAnnouncements(response.data);
  };

  useEffect(() => { loadAnnouncements(); }, []);

  return (
    <div className="space-y-6">
      <form onSubmit={async (event) => { event.preventDefault(); const media = await uploadMediaIfPresent(file); await announcementsAPI.create({ title: form.title, description: form.description, tags: form.tags ? form.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [], ...media }); setForm({ title: '', description: '', tags: '' }); setFile(null); loadAnnouncements(); }} className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2">
        <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder={adminMode ? 'College announcement title' : 'Announcement title'} className="rounded-xl border border-slate-200 px-4 py-3" required />
        <input value={form.tags} onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))} placeholder="Tags separated by commas" className="rounded-xl border border-slate-200 px-4 py-3" />
        <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Description" className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" rows="4" required />
        <input type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} className="rounded-xl border border-slate-200 px-4 py-3" />
        <button type="submit" className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white md:col-span-2">Post Announcement</button>
      </form>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <article key={announcement.id} className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{announcement.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{announcement.description}</p>
                <p className="mt-3 text-sm text-slate-500">Created by {announcement.created_by_name || 'Unknown'}</p>
              </div>
              {announcement.created_by === user?.id && !announcement.archived && <button type="button" onClick={() => announcementsAPI.archive(announcement.id).then(loadAnnouncements)} className="text-sm font-semibold text-slate-900">Archive</button>}
            </div>
            {announcement.media_url && <a href={announcement.media_url} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-semibold text-slate-900">Open attachment</a>}
          </article>
        ))}
      </div>
      {!announcements.length && <div className="rounded-3xl bg-white p-6 shadow-sm text-sm text-slate-500">No announcements available.</div>}
    </div>
  );
};
