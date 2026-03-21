import React, { useEffect, useMemo, useState } from 'react';

import { scheduleAPI } from '../api';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const SchedulePage = () => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    scheduleAPI.getAll().then((response) => setSchedule(response.data));
  }, []);

  const grouped = useMemo(
    () =>
      days.reduce((accumulator, day) => {
        accumulator[day] = schedule.filter((item) => item.day === day);
        return accumulator;
      }, {}),
    [schedule]
  );

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {days.map((day) => (
        <div key={day} className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">{day}</h3>
          <div className="mt-4 space-y-3">
            {grouped[day]?.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-medium text-slate-900">{entry.subject}</p>
                <p className="mt-1 text-sm text-slate-600">{entry.faculty}</p>
                <p className="mt-2 text-sm text-slate-500">{entry.start_time} - {entry.end_time}</p>
              </div>
            ))}
            {!grouped[day]?.length && <p className="text-sm text-slate-500">No classes scheduled.</p>}
          </div>
        </div>
      ))}
    </div>
  );
};
