import React from 'react';

import { AppShell } from '../components/AppShell';

const navigation = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/colleges', label: 'Colleges' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/admins', label: 'Admins' },
];

export const AdminLayout = () => {
  return <AppShell title="System Admin" subtitle="Global management" navigation={navigation} />;
};
