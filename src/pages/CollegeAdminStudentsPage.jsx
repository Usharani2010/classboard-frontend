import React, { useEffect, useMemo, useState } from 'react';

import { academicAPI, collegeAdminAPI } from '../api';

export const CollegeAdminStudentsPage = () => {
  const emptyForm = { name: '', student_id: '', email: '', password: '', degree_id: '', branch_id: '', year: '', role: 'student' };
  const [classGroups, setClassGroups] = useState([]);
  const [catalog, setCatalog] = useState({ degrees: [], branches: [] });
  const [form, setForm] = useState(emptyForm);
  const [csvFile, setCsvFile] = useState(null);

  const loadStudents = async () => {
    const response = await collegeAdminAPI.getStudents();
    setClassGroups(response.data);
  };

  useEffect(() => {
    loadStudents();
    academicAPI.getPublicCatalog().then((response) => setCatalog({ degrees: response.data.degrees, branches: response.data.branches }));
  }, []);

  const branches = useMemo(() => catalog.branches.filter((branch) => branch.degree_id === form.degree_id), [catalog.branches, form.degree_id]);

  const handleImport = async () => {
    if (!csvFile) return;
    try {
      const response = await collegeAdminAPI.importStudentsCSV(csvFile);
      if (response.data.errors?.length) {
        alert(response.data.errors.join('\n'));
      }
      setCsvFile(null);
      loadStudents();
    } catch (err) {
      alert(err.response?.data?.detail || 'CSV import failed');
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={(event) => { event.preventDefault(); collegeAdminAPI.createStudent({ ...form, year: Number(form.year) }).then(() => { setForm(emptyForm); loadStudents(); }); }} className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2 xl:grid-cols-4">
        {['name', 'student_id', 'email', 'password', 'year'].map((field) => <input key={field} type={field === 'password' ? 'password' : 'text'} value={form[field]} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} placeholder={field.replace('_', ' ')} className="rounded-xl border border-slate-200 px-4 py-3" required />)}
        <select value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3"><option value="student">Student</option><option value="cr">CR</option></select>
        <select value={form.degree_id} onChange={(event) => setForm((current) => ({ ...current, degree_id: event.target.value, branch_id: '' }))} className="rounded-xl border border-slate-200 px-4 py-3" required><option value="">Select degree</option>{catalog.degrees.map((degree) => <option key={degree.id} value={degree.id}>{degree.name}</option>)}</select>
        <select value={form.branch_id} onChange={(event) => setForm((current) => ({ ...current, branch_id: event.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" required><option value="">Select branch</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select>
        <button type="submit" className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white xl:col-span-4">Save Student</button>
      </form>

      <div className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <input type="file" accept=".csv" onChange={(event) => setCsvFile(event.target.files?.[0] || null)} className="text-sm" />
        <button type="button" onClick={handleImport} className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Import CSV</button>
        <button type="button" onClick={() => collegeAdminAPI.exportStudentsCSV().then((response) => { const blob = new Blob([response.data.content], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = response.data.filename; link.click(); URL.revokeObjectURL(url); })} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">Export CSV</button>
      </div>

      <div className="space-y-4">
        {classGroups.map((group) => (
          <div key={group.class_code} className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-900">{group.class_code}</h3>
              <p className="text-sm text-slate-500">{group.class_name}</p>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Student ID</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {group.students.map((student) => (
                  <tr key={student.id} className="border-t border-slate-100">
                    <td className="px-6 py-4 font-medium text-slate-900">{student.name}</td>
                    <td className="px-6 py-4 text-slate-600">{student.student_id}</td>
                    <td className="px-6 py-4 text-slate-600">{student.role}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        {student.role !== 'cr' && <button type="button" onClick={() => collegeAdminAPI.assignCR(student.id).then(loadStudents)} className="text-sm font-semibold text-slate-900">Assign CR</button>}
                        <button type="button" onClick={() => collegeAdminAPI.deleteStudent(student.id).then(loadStudents)} className="text-sm font-semibold text-rose-600">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!group.students.length && <tr><td className="px-6 py-4 text-slate-500" colSpan="4">No students in this class.</td></tr>}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};
