import React, { useEffect, useMemo, useState } from 'react';

import { collegeAdminAPI } from '../api';

export const CollegeAdminStudentsPage = () => {
  const emptyForm = { name: '', student_id: '', email: '', password: '', degree_id: '', branch_id: '', year: '', role: 'student' };
  const [classGroups, setClassGroups] = useState([]);
  const [catalog, setCatalog] = useState({ degrees: [], branches: [] });
  const [form, setForm] = useState(emptyForm);
  const [csvFile, setCsvFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [viewMode, setViewMode] = useState('class');
  const [expandedClasses, setExpandedClasses] = useState({});

  const loadStudents = async () => {
    const response = await collegeAdminAPI.getStudents();
    setClassGroups(response.data);
    setExpandedClasses((current) => {
      if (Object.keys(current).length) {
        return current;
      }

      return response.data.reduce((accumulator, group) => {
        accumulator[group.class_code] = true;
        return accumulator;
      }, {});
    });
  };

  useEffect(() => {
    loadStudents();
    collegeAdminAPI.getStructure().then((response) => {
      const degrees = response.data.map((degree) => ({
        id: degree.id,
        name: degree.name,
        code: degree.code,
      }));
      const branches = response.data.flatMap((degree) =>
        degree.branches.map((branch) => ({
          id: branch.id,
          name: branch.name,
          code: branch.code,
          degree_id: degree.id,
        })),
      );
      setCatalog({ degrees, branches });
    });
  }, []);

  const branches = useMemo(() => catalog.branches.filter((branch) => branch.degree_id === form.degree_id), [catalog.branches, form.degree_id]);
  const allStudents = useMemo(
    () =>
      classGroups
        .flatMap((group) => group.students.map((student) => ({ ...student, class_code: group.class_code, class_name: group.class_name })))
        .sort((first, second) => (first.student_id || '').localeCompare(second.student_id || '')),
    [classGroups],
  );

  const toggleClass = (classCode) => {
    setExpandedClasses((current) => ({
      ...current,
      [classCode]: !current[classCode],
    }));
  };

  const handleImport = async () => {
    if (!csvFile) return;
    try {
      const response = await collegeAdminAPI.importStudentsCSV(csvFile);
      const summary = `Imported ${response.data.imported} of ${response.data.total_rows} row(s).`;
      setStatusMessage(response.data.errors?.length ? `${summary} Some rows failed.` : summary);
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
      <form onSubmit={(event) => { event.preventDefault(); collegeAdminAPI.createStudent({ ...form, year: Number(form.year) }).then(() => { setForm(emptyForm); setStatusMessage('Student saved successfully.'); loadStudents(); }); }} className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2 xl:grid-cols-4">
        {['name', 'student_id', 'email', 'password', 'year'].map((field) => <input key={field} type={field === 'password' ? 'password' : 'text'} value={form[field]} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} placeholder={field.replace('_', ' ')} className="rounded-xl border border-slate-200 px-4 py-3" required />)}
        <select value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3"><option value="student">Student</option><option value="cr">CR</option></select>
        <select value={form.degree_id} onChange={(event) => setForm((current) => ({ ...current, degree_id: event.target.value, branch_id: '' }))} className="rounded-xl border border-slate-200 px-4 py-3" required><option value="">Select degree</option>{catalog.degrees.map((degree) => <option key={degree.id} value={degree.id}>{degree.name}</option>)}</select>
        <select value={form.branch_id} onChange={(event) => setForm((current) => ({ ...current, branch_id: event.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" required><option value="">Select branch</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select>
        <button type="submit" className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white xl:col-span-4">Save Student</button>
      </form>

      <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input type="file" accept=".csv" onChange={(event) => setCsvFile(event.target.files?.[0] || null)} className="text-sm" />
          <button type="button" onClick={handleImport} className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Import CSV</button>
          <button type="button" onClick={() => collegeAdminAPI.exportStudentsCSV().then((response) => { const blob = new Blob([response.data.content], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = response.data.filename; link.click(); URL.revokeObjectURL(url); })} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">Export CSV</button>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">CSV columns</p>
          <p className="mt-1">Use: <span className="font-mono">name,student_id,email,degree,branch,year,role,password</span></p>
          <p className="mt-1">Required columns: <span className="font-mono">name,student_id,email,degree,branch,year</span></p>
          <p className="mt-1">`degree` and `branch` can be the code, name, or database id. `role` is optional and can be `student` or `cr`. If `password` is blank, the student ID is used as the initial password.</p>
        </div>
        {statusMessage ? <p className="text-sm text-emerald-700">{statusMessage}</p> : null}
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setViewMode('class')} className={`rounded-full px-4 py-2 text-sm font-semibold ${viewMode === 'class' ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>Class-wise</button>
          <button type="button" onClick={() => setViewMode('all')} className={`rounded-full px-4 py-2 text-sm font-semibold ${viewMode === 'all' ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>All students</button>
        </div>

        {viewMode === 'class' ? classGroups.map((group) => (
          <div key={group.class_code} className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <button type="button" onClick={() => toggleClass(group.class_code)} className="flex w-full items-center justify-between border-b border-slate-100 px-6 py-4 text-left">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{group.class_code}</h3>
                <p className="text-sm text-slate-500">{group.class_name}</p>
              </div>
              <p className="text-sm font-semibold text-slate-600">{group.students.length} student(s)</p>
            </button>
            {expandedClasses[group.class_code] ? (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-6 py-4 text-left">Name</th>
                    <th className="px-6 py-4 text-left">Student ID</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Role</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {group.students.map((student) => (
                    <tr key={student.id} className="border-t border-slate-100">
                      <td className="px-6 py-4 font-medium text-slate-900">{student.name}</td>
                      <td className="px-6 py-4 text-slate-600">{student.student_id}</td>
                      <td className="px-6 py-4 text-slate-600">{student.email}</td>
                      <td className="px-6 py-4 text-slate-600">{student.role}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          {student.role !== 'cr' && <button type="button" onClick={() => collegeAdminAPI.assignCR(student.id).then(() => { setStatusMessage('CR assigned successfully.'); loadStudents(); })} className="text-sm font-semibold text-slate-900">Assign CR</button>}
                          <button type="button" onClick={() => collegeAdminAPI.deleteStudent(student.id).then(() => { setStatusMessage('Student deleted successfully.'); loadStudents(); })} className="text-sm font-semibold text-rose-600">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!group.students.length && <tr><td className="px-6 py-4 text-slate-500" colSpan="5">No students in this class.</td></tr>}
                </tbody>
              </table>
            ) : null}
          </div>
        )) : (
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-4 text-left">Student ID</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Class</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {allStudents.map((student) => (
                  <tr key={student.id} className="border-t border-slate-100">
                    <td className="px-6 py-4 font-medium text-slate-900">{student.student_id}</td>
                    <td className="px-6 py-4 text-slate-600">{student.name}</td>
                    <td className="px-6 py-4 text-slate-600">{student.class_code}</td>
                    <td className="px-6 py-4 text-slate-600">{student.email}</td>
                    <td className="px-6 py-4 text-slate-600">{student.role}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        {student.role !== 'cr' && <button type="button" onClick={() => collegeAdminAPI.assignCR(student.id).then(() => { setStatusMessage('CR assigned successfully.'); loadStudents(); })} className="text-sm font-semibold text-slate-900">Assign CR</button>}
                        <button type="button" onClick={() => collegeAdminAPI.deleteStudent(student.id).then(() => { setStatusMessage('Student deleted successfully.'); loadStudents(); })} className="text-sm font-semibold text-rose-600">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!allStudents.length && <tr><td className="px-6 py-4 text-slate-500" colSpan="6">No students available.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
