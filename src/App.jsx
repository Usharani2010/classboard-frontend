import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './layouts/AdminLayout';
import { CollegeAdminLayout } from './layouts/CollegeAdminLayout';
import { StudentLayout } from './layouts/StudentLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { useAuth } from './hooks/useAuth';
import { SystemAdminDashboardPage } from './pages/SystemAdminDashboardPage';
import { SystemAdminCollegesPage } from './pages/SystemAdminCollegesPage';
import { SystemAdminUsersPage } from './pages/SystemAdminUsersPage';
import { SystemAdminAdminsPage } from './pages/SystemAdminAdminsPage';
import { CollegeAdminDashboardPage } from './pages/CollegeAdminDashboardPage';
import { CollegeAdminStudentsPage } from './pages/CollegeAdminStudentsPage';
import { CollegeAdminSchedulesPage } from './pages/CollegeAdminSchedulesPage';
import { CollegeAnnouncementsPage } from './pages/CollegeAnnouncementsPage';
import { CollegeAdminIssuesPage } from './pages/CollegeAdminIssuesPage';
import { CollegeAdminProfileCorrectionsPage } from './pages/CollegeAdminProfileCorrectionsPage';
import { CollegeAdminStructurePage } from './pages/CollegeAdminStructurePage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { AssignmentTrackerPage } from './pages/AssignmentTrackerPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { RemindersPage } from './pages/RemindersPage';
import { SchedulePage } from './pages/SchedulePage';
import { StudentIssuesPage } from './pages/StudentIssuesPage';
import { ProfileCorrectionsPage } from './pages/ProfileCorrectionsPage';

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role === 'system_admin') {
    return <Navigate to="/admin" replace />;
  }
  if (user.role === 'college_admin') {
    return <Navigate to="/college-admin" replace />;
  }
  return <Navigate to="/student" replace />;
};

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={user ? <HomeRedirect /> : <LoginPage />} />
        <Route path="/register" element={user ? <HomeRedirect /> : <RegisterPage />} />

        <Route element={<ProtectedRoute allowedRoles={['system_admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<SystemAdminDashboardPage />} />
            <Route path="colleges" element={<SystemAdminCollegesPage />} />
            <Route path="users" element={<SystemAdminUsersPage />} />
            <Route path="admins" element={<SystemAdminAdminsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['college_admin']} />}>
          <Route path="/college-admin" element={<CollegeAdminLayout />}>
            <Route index element={<CollegeAdminDashboardPage />} />
            <Route path="students" element={<CollegeAdminStudentsPage />} />
            <Route path="schedules" element={<CollegeAdminSchedulesPage />} />
            <Route path="announcements" element={<CollegeAnnouncementsPage />} />
            <Route path="issues" element={<CollegeAdminIssuesPage />} />
            <Route path="profile-corrections" element={<CollegeAdminProfileCorrectionsPage />} />
            <Route path="structure" element={<CollegeAdminStructurePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['student', 'cr']} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboardPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="tracker" element={<AssignmentTrackerPage />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="reminders" element={<RemindersPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="issues" element={<StudentIssuesPage />} />
            <Route path="profile-corrections" element={<ProfileCorrectionsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
