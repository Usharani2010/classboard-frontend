import React, { useEffect, useState } from 'react';

import { academicAPI } from '../api';

export const SystemAdminCollegesPage = () => {
  const [colleges, setColleges] = useState([]);
  const [form, setForm] = useState({ name: '', code: '', description: '' });

  const loadColleges = async () => {
    const response = await academicAPI.getColleges();
    setColleges(response.data);
  };

  useEffect(() => {
    loadColleges();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await academicAPI.createCollege(form);
    setForm({ name: '', code: '', description: '' });
    loadColleges();
  };

  const handleDelete = async (id) => {
    await academicAPI.deleteCollege(id);
    loadColleges();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-3">
        <input
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          placeholder="College name"
          className="rounded-xl border border-slate-200 px-4 py-3"
          required
        />
        <input
          value={form.code}
          onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))}
          placeholder="Code"
          className="rounded-xl border border-slate-200 px-4 py-3"
          required
        />
        <input
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          placeholder="Description"
          className="rounded-xl border border-slate-200 px-4 py-3"
        />
        <button type="submit" className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white md:col-span-3">
          Create College
        </button>
      </form>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Code</th>
              <th className="px-6 py-4 text-left">Description</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {colleges.map((college) => (
              <tr key={college.id} className="border-t border-slate-100">
                <td className="px-6 py-4 font-medium text-slate-900">{college.name}</td>
                <td className="px-6 py-4 text-slate-600">{college.code}</td>
                <td className="px-6 py-4 text-slate-600">{college.description || '-'}</td>
                <td className="px-6 py-4 text-right">
                  <button type="button" onClick={() => handleDelete(college.id)} className="text-sm font-semibold text-rose-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
