import React from 'react';
import { NavLink } from 'react-router-dom';

export const Sidebar = ({ title, subtitle, items, isOpen, onToggle }) => {
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        className="fixed left-4 top-4 z-40 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white lg:hidden"
      >
        Menu
      </button>
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-slate-200 px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">ClassBoard</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        </div>
        <nav className="space-y-1 px-4 py-6">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => isOpen && onToggle()}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onToggle}
          className="fixed inset-0 z-20 bg-slate-950/30 lg:hidden"
        />
      )}
    </>
  );
};
