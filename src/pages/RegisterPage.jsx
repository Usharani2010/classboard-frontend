import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { academicAPI, authAPI } from '../api';
import { useAuthStore } from '../store';

export const RegisterPage = () => {
  const [catalog, setCatalog] = useState({ colleges: [], degrees: [], branches: [] });
  const [formData, setFormData] = useState({
    name: '',
    student_id: '',
    email: '',
    password: '',
    college_id: '',
    degree_id: '',
    branch_id: '',
    year: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    academicAPI.getPublicCatalog().then((response) => setCatalog(response.data)).catch(() => setError('Unable to load registration catalog'));
  }, []);

  const degrees = useMemo(() => catalog.degrees.filter((degree) => degree.college_id === formData.college_id), [catalog.degrees, formData.college_id]);
  const branches = useMemo(() => catalog.branches.filter((branch) => branch.degree_id === formData.degree_id), [catalog.branches, formData.degree_id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
      ...(name === 'college_id' ? { degree_id: '', branch_id: '' } : {}),
      ...(name === 'degree_id' ? { branch_id: '' } : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.registerStudent({ ...formData, year: Number(formData.year) });
      setAuth(response.data.user, response.data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">Student Registration</h1>
        <p className="mt-2 text-sm text-slate-600">Each student is assigned to a class generated from degree, branch, and year.</p>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
          {error && <div className="md:col-span-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
          {['name', 'student_id', 'email', 'password'].map((field) => (
            <input
              key={field}
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field.replace('_', ' ')}
              className="rounded-xl border border-slate-200 px-4 py-3"
              required
            />
          ))}
          <select name="college_id" value={formData.college_id} onChange={handleChange} className="rounded-xl border border-slate-200 px-4 py-3" required>
            <option value="">Select college</option>
            {catalog.colleges.map((college) => <option key={college.id} value={college.id}>{college.name}</option>)}
          </select>
          <select name="degree_id" value={formData.degree_id} onChange={handleChange} className="rounded-xl border border-slate-200 px-4 py-3" required>
            <option value="">Select degree</option>
            {degrees.map((degree) => <option key={degree.id} value={degree.id}>{degree.name}</option>)}
          </select>
          <select name="branch_id" value={formData.branch_id} onChange={handleChange} className="rounded-xl border border-slate-200 px-4 py-3" required>
            <option value="">Select branch</option>
            {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
          </select>
          <select name="year" value={formData.year} onChange={handleChange} className="rounded-xl border border-slate-200 px-4 py-3" required>
            <option value="">Select year</option>
            {[1, 2, 3, 4].map((year) => <option key={year} value={year}>Year {year}</option>)}
          </select>
          <button type="submit" disabled={loading} className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white md:col-span-2">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
