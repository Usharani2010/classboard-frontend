import React, { useEffect, useState } from 'react';

import { usersAPI } from '../api';

export const SystemAdminAdminsPage = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    usersAPI.getAdmins().then((response) => setAdmins(response.data));
  }, []);

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-6 py-4 text-left">Name</th>
            <th className="px-6 py-4 text-left">Email</th>
            <th className="px-6 py-4 text-left">Role</th>
            <th className="px-6 py-4 text-left">College</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id} className="border-t border-slate-100">
              <td className="px-6 py-4 font-medium text-slate-900">{admin.name}</td>
              <td className="px-6 py-4 text-slate-600">{admin.email}</td>
              <td className="px-6 py-4 text-slate-600">{admin.role}</td>
              <td className="px-6 py-4 text-slate-600">{admin.college_id || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
