import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authAPI } from '../api';
import { useAuthStore } from '../store';

const portalOptions = [
  { id: 'student', label: 'Student' },
  { id: 'college_admin', label: 'College Admin' },
  { id: 'system_admin', label: 'System Admin' },
];

export const LoginPage = () => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const request =
        role === 'system_admin'
          ? authAPI.loginSystemAdmin({ email, password })
          : role === 'college_admin'
          ? authAPI.loginCollegeAdmin({ email, password })
          : authAPI.loginStudent({ email, password });

      const response = await request;
      setAuth(response.data.user, response.data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] border border-slate-800 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_40%),linear-gradient(135deg,_#0f172a,_#020617)] p-10 text-white">
          <p className="text-3xl font-bold uppercase tracking-[0.3em] text-sky-500">ClassBoard</p>
          <h1 className="mt-6 max-w-xl text-4xl font-bold leading-tight">
            A centralized platform for structured academic management across institutions.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-slate-300">
           Manage assignments, announcements, schedules, and academic activities efficiently. 
          </p>
        </section>

        <section className="rounded-[2rem] bg-white p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-slate-900">Sign In</h2>
          <p className="mt-2 text-sm text-slate-600">Choose your portal and continue.</p>

          <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1">
            {portalOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setRole(option.id)}
                className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  role === option.id ? 'bg-slate-900 text-white' : 'text-slate-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {role === 'student' && (
            <p className="mt-5 text-sm text-slate-600">
              Need a student account?{' '}
              <button type="button" onClick={() => navigate('/register')} className="font-semibold text-slate-900">
                Register here
              </button>
            </p>
          )}
        </section>
      </div>
    </div>
  );
};
