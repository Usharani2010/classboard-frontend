import React, { useEffect, useMemo, useState } from 'react';

import { academicAPI, usersAPI } from '../api';

export const SystemAdminUsersPage = () => {
  const emptyForm = {
    name: '',
    email: '',
    password: '',
    role: 'student',
    college_id: '',
    degree_id: '',
    branch_id: '',
    year: '',
    student_id: '',
  };
  const [form, setForm] = useState(emptyForm);
  const [users, setUsers] = useState([]);
  const [catalog, setCatalog] = useState({ colleges: [], degrees: [], branches: [] });

  useEffect(() => {
    usersAPI.getAll().then((response) => setUsers(response.data));
    academicAPI.getPublicCatalog().then((response) => setCatalog(response.data));
  }, []);

  const degrees = useMemo(() => catalog.degrees.filter((degree) => degree.college_id === form.college_id), [catalog.degrees, form.college_id]);
  const branches = useMemo(() => catalog.branches.filter((branch) => branch.degree_id === form.degree_id), [catalog.branches, form.degree_id]);

  const loadUsers = () => usersAPI.getAll().then((response) => setUsers(response.data));

  return (
    <div className="space-y-6">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          usersAPI.create({ ...form, year: form.year ? Number(form.year) : null }).then(() => {
            setForm(emptyForm);
            loadUsers();
          });
        }}
        className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2 xl:grid-cols-4"
      >
        {['name', 'email', 'password', 'student_id'].map((field) => (
          <input key={field} type={field === 'password' ? 'password' : 'text'} value={form[field]} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} placeholder={field.replace('_', ' ')} className="rounded-xl border border-slate-200 px-4 py-3" />
        ))}
        <select value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3">
          {['student', 'cr', 'college_admin', 'system_admin'].map((role) => <option key={role} value={role}>{role}</option>)}
        </select>
        <select value={form.college_id} onChange={(event) => setForm((current) => ({ ...current, college_id: event.target.value, degree_id: '', branch_id: '' }))} className="rounded-xl border border-slate-200 px-4 py-3">
          <option value="">Select college</option>
          {catalog.colleges.map((college) => <option key={college.id} value={college.id}>{college.name}</option>)}
        </select>
        <select value={form.degree_id} onChange={(event) => setForm((current) => ({ ...current, degree_id: event.target.value, branch_id: '' }))} className="rounded-xl border border-slate-200 px-4 py-3">
          <option value="">Select degree</option>
          {degrees.map((degree) => <option key={degree.id} value={degree.id}>{degree.name}</option>)}
        </select>
        <select value={form.branch_id} onChange={(event) => setForm((current) => ({ ...current, branch_id: event.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3">
          <option value="">Select branch</option>
          {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
        </select>
        <input value={form.year} onChange={(event) => setForm((current) => ({ ...current, year: event.target.value }))} placeholder="Year" className="rounded-xl border border-slate-200 px-4 py-3" />
        <button type="submit" className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white xl:col-span-4">Create User</button>
      </form>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-left">Class</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-100">
                <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                <td className="px-6 py-4 text-slate-600">{user.role}</td>
                <td className="px-6 py-4 text-slate-600">{user.class_code || '-'}</td>
                <td className="px-6 py-4 text-right"><button type="button" onClick={() => usersAPI.delete(user.id).then(loadUsers)} className="text-sm font-semibold text-rose-600">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
