import React, { useEffect, useState } from 'react';

import { assignmentsAPI, trackerAPI } from '../api';
import { useAuth } from '../hooks/useAuth';

export const AssignmentTrackerPage = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [trackerRows, setTrackerRows] = useState([]);

  useEffect(() => {
    if (user?.role === 'cr') {
      assignmentsAPI.getAll().then((response) => setAssignments(response.data));
    }
  }, [user?.role]);

  useEffect(() => {
    if (selectedAssignment) {
      trackerAPI.getTrackerWithStudents(selectedAssignment).then((response) => setTrackerRows(response.data));
    }
  }, [selectedAssignment]);

  if (user?.role !== 'cr') {
    return <div className="rounded-3xl bg-white p-6 shadow-sm text-sm text-slate-600">Assignment tracking is available only to CR users.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <select value={selectedAssignment} onChange={(event) => setSelectedAssignment(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3">
          <option value="">Select assignment</option>
          {assignments.map((assignment) => (
            <option key={assignment.id} value={assignment.id}>
              {assignment.title}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-6 py-4 text-left">Student</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {trackerRows.map((row) => (
              <tr key={row.tracker_id} className="border-t border-slate-100">
                <td className="px-6 py-4 font-medium text-slate-900">{row.student_name}</td>
                <td className="px-6 py-4 text-slate-600">{row.student_email}</td>
                <td className="px-6 py-4">
                  <label className="inline-flex items-center gap-3 text-slate-700">
                    <input
                      type="checkbox"
                      checked={row.completed}
                      onChange={(event) => trackerAPI.markSubmission(selectedAssignment, row.student_id, event.target.checked).then(() => trackerAPI.getTrackerWithStudents(selectedAssignment).then((response) => setTrackerRows(response.data)))}
                    />
                    <span>{row.completed ? 'Submitted' : 'Pending'}</span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
