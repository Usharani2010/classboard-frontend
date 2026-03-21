import api from './client';

export const authAPI = {
  registerStudent: (data) => api.post('/auth/register/student', data),
  loginStudent: (data) => api.post('/auth/login/student', data),
  loginCollegeAdmin: (data) => api.post('/auth/login/college-admin', data),
  loginSystemAdmin: (data) => api.post('/auth/login/system-admin', data),
  getCurrentUser: () => api.get('/auth/me'),
};

export const dashboardAPI = {
  getSystemAdmin: () => api.get('/dashboard/system-admin'),
  getCollegeAdmin: () => api.get('/dashboard/college-admin'),
  getStudent: () => api.get('/dashboard/student'),
};

export const academicAPI = {
  getPublicCatalog: () => api.get('/academic/public/catalog'),
  getColleges: () => api.get('/academic/colleges'),
  createCollege: (data) => api.post('/academic/colleges', data),
  updateCollege: (id, data) => api.put(`/academic/colleges/${id}`, data),
  deleteCollege: (id) => api.delete(`/academic/colleges/${id}`),
  getDegrees: () => api.get('/academic/degrees'),
  getBranches: () => api.get('/academic/branches'),
};

export const usersAPI = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getAdmins: () => api.get('/users/admins'),
  getAdminList: (collegeId = null, role = null, search = null) =>
    api.get('/users/admin/list', {
      params: {
        college_id: collegeId || undefined,
        role: role || undefined,
        search: search || undefined,
      },
    }),
};

export const collegeAdminAPI = {
  getClasses: () => api.get('/college-admin/classes'),
  getStudents: () => api.get('/college-admin/students'),
  createStudent: (data) => api.post('/college-admin/students', data),
  updateStudent: (id, data) => api.put(`/college-admin/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/college-admin/students/${id}`),
  assignCR: (studentId) => api.post(`/college-admin/students/${studentId}/assign-cr`),
  importStudentsCSV: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/college-admin/students/import-csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  exportStudentsCSV: () => api.get('/college-admin/students/export-csv'),
  getSchedules: () => api.get('/college-admin/schedules'),
  createSchedule: (data) => api.post('/college-admin/schedules', data),
  updateSchedule: (id, data) => api.put(`/college-admin/schedules/${id}`, data),
  deleteSchedule: (id) => api.delete(`/college-admin/schedules/${id}`),
  getStructure: () => api.get('/college-admin/structure'),
  getProfileCorrections: (status = 'pending') =>
    api.get('/college-admin/profile-corrections', { params: { status_filter: status } }),
  approveProfileCorrection: (id) => api.post(`/college-admin/profile-corrections/${id}/approve`),
  rejectProfileCorrection: (id) => api.post(`/college-admin/profile-corrections/${id}/reject`),
  getIssues: (status = null) =>
    api.get('/college-admin/issues', { params: { status_filter: status || undefined } }),
  updateIssueStatus: (id, status) =>
    api.post(`/college-admin/issues/${id}/update-status`, null, { params: { new_status: status } }),
};

export const announcementsAPI = {
  getAll: (filters = {}) => api.get('/announcements', { params: filters }),
  create: (data) => api.post('/announcements', data),
  archive: (id) => api.post(`/announcements/${id}/archive`),
};

export const assignmentsAPI = {
  getAll: () => api.get('/assignments'),
  create: (data) => api.post('/assignments', data),
  delete: (id) => api.delete(`/assignments/${id}`),
};

export const trackerAPI = {
  getTrackerWithStudents: (assignmentId) => api.get(`/assignments/${assignmentId}/tracker/students`),
  markSubmission: (assignmentId, studentId, completed) =>
    api.put(`/assignments/${assignmentId}/tracker/${studentId}?completed=${completed}`),
};

export const remindersAPI = {
  getAll: () => api.get('/reminders'),
  create: (data) => api.post('/reminders', data),
  update: (id, data) => api.put(`/reminders/${id}`, data),
  delete: (id) => api.delete(`/reminders/${id}`),
};

export const scheduleAPI = {
  getAll: () => api.get('/schedule'),
};

export const profileAPI = {
  getProfile: () => api.get('/profile'),
  requestCorrection: (data) => api.post('/profile-corrections', data),
  getCorrections: () => api.get('/profile-corrections'),
  reportIssue: (data) => api.post('/issues', data),
  getIssues: () => api.get('/issues'),
};

export const mediaAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
