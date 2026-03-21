import React, { useEffect, useState } from 'react';

import { collegeAdminAPI } from '../api';

export const CollegeAdminProfileCorrectionsPage = () => {
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    const response = await collegeAdminAPI.getProfileCorrections();
    setRequests(response.data);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-6 py-4 text-left">Field</th>
            <th className="px-6 py-4 text-left">Current</th>
            <th className="px-6 py-4 text-left">Requested</th>
            <th className="px-6 py-4 text-left">Reason</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="border-t border-slate-100">
              <td className="px-6 py-4 font-medium text-slate-900">{request.field_name}</td>
              <td className="px-6 py-4 text-slate-600">{request.current_value || '-'}</td>
              <td className="px-6 py-4 text-slate-600">{request.requested_value}</td>
              <td className="px-6 py-4 text-slate-600">{request.reason || '-'}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => collegeAdminAPI.approveProfileCorrection(request.id).then(loadRequests)} className="text-sm font-semibold text-emerald-700">
                    Approve
                  </button>
                  <button type="button" onClick={() => collegeAdminAPI.rejectProfileCorrection(request.id).then(loadRequests)} className="text-sm font-semibold text-rose-700">
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
