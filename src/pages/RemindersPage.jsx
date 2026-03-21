import React, { useEffect, useState } from 'react';

import { remindersAPI } from '../api';
import { useAuth } from '../hooks/useAuth';

export const RemindersPage = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', remind_date: '', reminder_type: 'personal' });

  const loadReminders = async () => {
    const response = await remindersAPI.getAll();
    setReminders(response.data);
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await remindersAPI.create({
      ...form,
      remind_date: new Date(form.remind_date).toISOString(),
    });
    setForm({ title: '', description: '', remind_date: '', reminder_type: 'personal' });
    loadReminders();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2">
        <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Title" className="rounded-xl border border-slate-200 px-4 py-3" required />
        <input type="datetime-local" value={form.remind_date} onChange={(event) => setForm((current) => ({ ...current, remind_date: event.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" required />
        <select value={form.reminder_type} onChange={(event) => setForm((current) => ({ ...current, reminder_type: event.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3">
          <option value="personal">Personal reminder</option>
          {user?.role === 'cr' && <option value="class">Class reminder</option>}
        </select>
        <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Description" className="rounded-xl border border-slate-200 px-4 py-3" rows="3" required />
        <button type="submit" className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white md:col-span-2">
          Create Reminder
        </button>
      </form>

      <div className="grid gap-4 xl:grid-cols-2">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{reminder.reminder_type}</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">{reminder.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{reminder.description}</p>
            <p className="mt-4 text-sm text-slate-500">{new Date(reminder.remind_date).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
