import React, { useEffect, useState } from 'react';

import { collegeAdminAPI } from '../api';

export const CollegeAdminStructurePage = () => {
  const [structure, setStructure] = useState([]);
  useEffect(() => {
    collegeAdminAPI.getStructure().then((response) => setStructure(response.data));
  }, []);
  return (
    <div className="space-y-4">
      {structure.map((degree) => (
        <div key={degree.id} className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">{degree.name}</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {degree.branches.map((branch) => (
              <div key={branch.id} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-medium text-slate-900">{branch.name}</p>
                <div className="mt-3 space-y-2">
                  {branch.classes.map((classItem) => <p key={classItem.id} className="text-sm text-slate-600">{classItem.code} • Year {classItem.year}</p>)}
                  {!branch.classes.length && <p className="text-sm text-slate-500">No classes created for this branch.</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
