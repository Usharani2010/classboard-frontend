import React from 'react';

import { AppShell } from '../components/AppShell';
import { useAuth } from '../hooks/useAuth';

export const StudentLayout = () => {
  const { user } = useAuth();
  const navigation = [
    { to: '/student', label: 'Dashboard', end: true },
    { to: '/student/assignments', label: 'Assignments' },
    ...(user?.role === 'cr' ? [{ to: '/student/tracker', label: 'Assignment Tracker' }] : []),
    { to: '/student/announcements', label: 'Announcements' },
    { to: '/student/reminders', label: 'Reminders' },
    { to: '/student/schedule', label: 'Schedule' },
    { to: '/student/issues', label: 'Issues' },
    { to: '/student/profile-corrections', label: 'Profile Corrections' },
  ];

  return (
    <AppShell
      title={user?.role === 'cr' ? 'Class Representative' : 'Student'}
      subtitle="Academic workspace"
      navigation={navigation}
    />
  );
};
