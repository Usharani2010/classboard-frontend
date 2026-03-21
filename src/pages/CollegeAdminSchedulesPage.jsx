import React, { useEffect, useState } from 'react';

import { collegeAdminAPI } from '../api';

export const CollegeAdminSchedulesPage = () => {
  const emptyForm = { class_id: '', day: '', subject: '', faculty: '', start_time: '', end_time: '' };
  const [schedules, setSchedules] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const [scheduleResponse, classesResponse] = await Promise.all([collegeAdminAPI.getSchedules(), collegeAdminAPI.getClasses()]);
    setSchedules(scheduleResponse.data);
    setClasses(classesResponse.data);
  };

  useEffect(() => { load(); }, []);

  const saveForm = async (event) => {
    event.preventDefault();
    if (editingId) {
      await collegeAdminAPI.updateSchedule(editingId, form);
    } else {
      await collegeAdminAPI.createSchedule(form);
    }
    setEditingId(null);
    setForm(emptyForm);
    load();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={saveForm} className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2 xl:grid-cols-3">
        <select value={form.class_id} onChange={(event) => setForm((current) => ({ ...current, class_id: event.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" required>
          <option value="">Select class</option>
          {classes.map((classItem) => <option key={classItem.id} value={classItem.id}>{classItem.code} - {classItem.name}</option>)}
        </select>
        {['day', 'subject', 'faculty', 'start_time', 'end_time'].map((field) => <input key={field} value={form[field]} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} placeholder={field.replace('_', ' ')} className="rounded-xl border border-slate-200 px-4 py-3" required />)}
        <button type="submit" className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white xl:col-span-3">{editingId ? 'Update Schedule' : 'Create Schedule'}</button>
      </form>

      <div className="space-y-4">
        {schedules.map((schedule) => (
          <details key={schedule.id} className="rounded-3xl bg-white p-6 shadow-sm" open={editingId === schedule.id}>
            <summary className="cursor-pointer list-none">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{schedule.subject}</h3>
                  <p className="text-sm text-slate-500">{schedule.class_name} • {schedule.day} • {schedule.start_time} - {schedule.end_time}</p>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => { setEditingId(schedule.id); setForm({ class_id: schedule.class_id, day: schedule.day, subject: schedule.subject, faculty: schedule.faculty, start_time: schedule.start_time, end_time: schedule.end_time }); }} className="text-sm font-semibold text-slate-900">Edit</button>
                  <button type="button" onClick={() => collegeAdminAPI.deleteSchedule(schedule.id).then(load)} className="text-sm font-semibold text-rose-600">Delete</button>
                </div>
              </div>
            </summary>
            <div className="mt-4 rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
              <p>Faculty: {schedule.faculty}</p>
              <p className="mt-2">Class: {schedule.class_name}</p>
            </div>
          </details>
        ))}
        {!schedules.length && <div className="rounded-3xl bg-white p-6 shadow-sm text-sm text-slate-500">No schedules available.</div>}
      </div>
    </div>
  );
};
