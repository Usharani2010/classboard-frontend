import React from 'react';

import { AppShell } from '../components/AppShell';

const navigation = [
  { to: '/college-admin', label: 'Dashboard', end: true },
  { to: '/college-admin/students', label: 'Students' },
  { to: '/college-admin/schedules', label: 'Schedules' },
  { to: '/college-admin/announcements', label: 'Announcements' },
  { to: '/college-admin/issues', label: 'Issues' },
  { to: '/college-admin/profile-corrections', label: 'Profile Requests' },
  { to: '/college-admin/structure', label: 'Structure' },
];

export const CollegeAdminLayout = () => {
  return <AppShell title="College Admin" subtitle="Campus operations" navigation={navigation} />;
};
