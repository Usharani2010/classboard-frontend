# Frontend API Integration Summary

## Overview
The frontend has been updated to integrate with the new backend API structure supporting the ClassBoard refactoring with multiple user roles (system_admin, college_admin, cr, student) and enhanced features.

---

## File Changes

### 1. **API Client (`src/api/index.js`)** ✅ Updated
**Changes:**
- Split authentication into role-specific endpoints:
  - `authAPI.registerStudent()` → POST `/auth/register/student`
  - `authAPI.loginStudent()` → POST `/auth/login/student`
  - `authAPI.loginCollegeAdmin()` → POST `/auth/login/college-admin`
  - `authAPI.loginSystemAdmin()` → POST `/auth/login/system-admin`
  
- Added `collegeAdminAPI` with endpoints:
  - Student management: `getStudents()`, `assignCR()`
  - CSV operations: `importStudentsCSV()`, `exportStudentsCSV()`
  - Schedule management: `getSchedules()`, `createSchedule()`, `deleteSchedule()`
  - Profile corrections: `getProfileCorrections()`, `approveProfileCorrection()`, `rejectProfileCorrection()`
  - Issues: `getIssues()`, `updateIssueStatus()`

- Added `profileAPI` for student self-service:
  - `getProfile()`, `requestCorrection()`, `getCorrections()`, `reportIssue()`, `getIssues()`

- Enhanced `remindersAPI` with type filtering:
  - `getPersonal()`, `getClass()` for reminder type separation

- Updated `trackerAPI` with new endpoints:
  - `getTrackerWithStudents()` for CR submission viewing
  - `bulkMarkSubmissions()` for bulk marking

**Impact:** All API calls now map correctly to the new backend endpoints

---

### 2. **Login Page (`src/pages/LoginPage.jsx`)** ✅ Redesigned
**Changes:**
- Added role selection before login (Student, College Admin, System Admin)
- Different login flows for each role:
  - Each role has its own login endpoint
  - Back button to return to role selection
  - User can switch roles without reloading

**Before:**
```
Single login form → credentials check
```

**After:**
```
Role selection → Role-specific login → Dashboard
```

---

### 3. **Register Page (`src/pages/RegisterPage.jsx`)** ✅ Updated
**Changes:**
- Updated to use `authAPI.registerStudent()` endpoint
- Added `section` field (numeric, optional)
- Changed IDs from `c.id` to `c._id` to match MongoDB ObjectId format
- Added year parsing and section parsing as integers

**New Registration Fields:**
- name, student_id, email, password
- college_id, degree_id, branch_id
- year (1-4)
- section (optional numeric)

---

### 4. **Sidebar (`src/components/Sidebar.jsx`)** ✅ Updated
**Changes:**
- Updated role names: `admin` → `system_admin`, added `college_admin`
- Added user info display (role, name)
- Different menu items per role:
  
  **System Admin:**
  - Users, Colleges, Degrees, Branches, Sections
  
  **College Admin:**
  - Students, Schedules, Profile Corrections, Issues
  
  **CR (Class Rep):**
  - Assignments, Submission Tracker, Announcements, Reminders, Schedule, Profile
  
  **Student:**
  - Assignments, Announcements, Reminders, Schedule, Profile, Report Issue

---

### 5. **New: College Admin Students Page (`src/pages/CollegeAdminStudentsPage.jsx`)** ✅ Created
**Features:**
- List all college students with table view
- CSV import with file upload
- CSV export functionality
- Assign CR role to students (with role validation)
- Column fields: Name, Student ID, Email, Year, Section
- Inline make-CR action button

**API Endpoints Used:**
- `collegeAdminAPI.getStudents()`
- `collegeAdminAPI.importStudentsCSV()`
- `collegeAdminAPI.exportStudentsCSV()`
- `collegeAdminAPI.assignCR()`

---

### 6. **New: College Admin Schedules Page (`src/pages/CollegeAdminSchedulesPage.jsx`)** ✅ Created
**Features:**
- List all college schedules
- Create new schedule with form:
  - Section, Day, Subject, Faculty, Time
  - Day dropdown with predefined days (Mon-Sat)
- Delete schedule functionality
- Table view with all schedule details

**API Endpoints Used:**
- `collegeAdminAPI.getSchedules()`
- `collegeAdminAPI.createSchedule()`
- `collegeAdminAPI.deleteSchedule()`

---

### 7. **New: Profile Corrections Page (`src/pages/ProfileCorrectionsPage.jsx`)** ✅ Created
**Dual View:**

**Student View (My Corrections):**
- Request profile corrections by:
  - Field name (dropdown: name, student_id, email, year, section, degree, branch)
  - Current value, requested value, reason
  - View status (pending, approved, rejected)

**Admin View (Management):**
- See all pending corrections for college
- Approve/reject with single-click actions
- Status tracking per correction
- Admin can switch to own correction requests

**API Endpoints Used:**
- `profileAPI.requestCorrection()`
- `profileAPI.getCorrections()` (student)
- `collegeAdminAPI.getProfileCorrections()` (admin)
- `collegeAdminAPI.approveProfileCorrection()`
- `collegeAdminAPI.rejectProfileCorrection()`

---

### 8. **New: Issues Page (`src/pages/IssuesPage.jsx`)** ✅ Created
**Dual View:**

**Student View (My Issues):**
- Report issues with:
  - Issue type (profile_data, schedule, assignment, system_bug, other)
  - Title, description
  - View all reported issues
  - See current status of each issue

**Admin View (Management):**
- See all college issues
- Filter by status (open, in_progress, resolved, closed)
- Change issue status with dropdown
- Status labels with color coding

**API Endpoints Used:**
- `profileAPI.reportIssue()`
- `profileAPI.getIssues()` (student)
- `collegeAdminAPI.getIssues()` (admin)
- `collegeAdminAPI.updateIssueStatus()`

---

### 9. **Main Layout (`src/MainLayout.jsx`)** ✅ Enhanced
**Changes:**
- Imported all new page components
- Updated `renderContent()` with new cases:
  - `students` → `<CollegeAdminStudentsPage />`
  - `schedules` → `<CollegeAdminSchedulesPage />`
  - `profile_corrections` → `<ProfileCorrectionsPage />`
  - `issues` → `<IssuesPage />`
  - `tracker` → `<AssignmentsPage showTracker={true} />`
- Added `activeTab` prop passing to admin panel for role-specific rendering

---

## User Journey by Role

### 👨‍🎓 Student
1. Login → Student Portal
2. View Dashboard
3. Browse Assignments, Announcements
4. Set Reminders (personal & class)
5. Request Profile Corrections
6. Report Issues
7. View Schedule

### 👨‍💼 College Admin
1. Login → College Admin Portal
2. View Dashboard
3. Manage Students (CSV import/export, assign CRs)
4. Create & Manage Schedules
5. Review Profile Corrections (approve/reject)
6. Track Student Issues & assign resolution

### 👨‍🏫 CR (Class Rep)
1. Login → CR Portal
2. View Dashboard
3. Create Assignments (section-specific)
4. Track Assignment Submissions (student-wise)
5. Create Announcements
6. Set Reminders
7. View Class Schedule

### 🔐 System Admin
1. Login → System Admin Portal
2. Manage Colleges, Degrees, Branches, Sections
3. View Users (manage roles)
4. System administration

---

## Authentication Flow

```
Role Selection Screen
        ↓
[Student] [College Admin] [System Admin]
        ↓                      ↓              ↓
    Login Form          Login Form      Login Form
        ↓                      ↓              ↓
    /auth/login/       /auth/login/   /auth/login/
    student            college-admin  system-admin
        ↓                      ↓              ↓
    JWT Token Generated & Stored
        ↓
    Dashboard (Role-based)
```

---

## API Compatibility

### New Endpoints Used
- ✅ `/auth/register/student`
- ✅ `/auth/login/student`
- ✅ `/auth/login/college-admin`
- ✅ `/auth/login/system-admin`
- ✅ `/college-admin/students`
- ✅ `/college-admin/students/{id}/assign-cr`
- ✅ `/college-admin/students/import-csv`
- ✅ `/college-admin/students/export-csv`
- ✅ `/college-admin/schedules`
- ✅ `/college-admin/profile-corrections`
- ✅ `/college-admin/issues`
- ✅ `/profile` (student)
- ✅ `/profile-corrections` (student)
- ✅ `/issues` (student)

### Existing Endpoints Still Used
- ✅ `/announcements`
- ✅ `/assignments`
- ✅ `/assignments/{id}/tracker` (with new endpoint `/assignments/{id}/tracker/students`)
- ✅ `/reminders` (with new filters: `/reminders/personal`, `/reminders/class`)
- ✅ `/schedule`
- ✅ `/academic/*` (for colleges, degrees, branches)

---

## Data Structure Updates

### User Model (Frontend Storage)
```javascript
{
  _id: ObjectId (string),
  name: string,
  student_id: string | null,
  email: string,
  role: "system_admin" | "college_admin" | "cr" | "student",
  college_id: ObjectId | null,
  degree_id: ObjectId | null,
  branch_id: ObjectId | null,
  year: integer | null,
  section: integer | null,  // Changed from string to integer
  created_at: datetime
}
```

### Reminders (Updated)
```javascript
{
  reminder_type: "personal" | "class",
  section_id: ObjectId | null,  // Required for class reminders
  remind_date: datetime,
  status: "pending" | "completed"
}
```

### New Collections
- **profile_corrections**: field_name, current_value, requested_value, status, reason
- **issue_reports**: issue_type, title, description, status, assigned_to

---

## Testing Checklist

### Authentication
- [ ] Student registration with section field
- [ ] Student login from student portal
- [ ] College admin login from college portal
- [ ] System admin login from system portal
- [ ] Role selection with back button

### College Admin Features
- [ ] View student list
- [ ] Assign CR to student
- [ ] Import CSV file
- [ ] Export CSV file
- [ ] Create schedule entry
- [ ] View/approve profile corrections
- [ ] View/manage issues

### Student Features
- [ ] Request profile correction
- [ ] Report issue
- [ ] View own corrections
- [ ] View own issues
- [ ] Create personal reminders
- [ ] Create class reminders

### CR Features
- [ ] Create assignment
- [ ] View assignment tracker
- [ ] See student list for submission status
- [ ] Bulk mark submissions

---

## Environment Configuration

No additional environment variables needed. Frontend uses:
- `API_BASE_URL` = `http://localhost:8000` (from client.js)
- CORS enabled for `localhost:3000` and `localhost:5173` on backend

---

## Browser Storage

- ✅ User data stored in `localStorage` as `user` key
- ✅ JWT token stored in `localStorage` as `access_token` key
- ✅ Both cleared on logout
- ✅ Loaded on app initialization via Zustand store

---

## Status: Complete ✅

All frontend components have been updated to work with the new backend APIs. The application is ready for:
1. Testing with populated database
2. Deployment
3. Frontend styling refinements

