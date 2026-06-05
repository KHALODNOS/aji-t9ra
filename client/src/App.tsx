import Register from './auth/Register';
import Login from './auth/Login';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import UserManagement from './pages/admin/UserManagement';
import AdminDashboard from './pages/admin/AdminDashboard';
import ContentReview from './pages/admin/ContentReview';
import TechnicalSupport from './pages/admin/TechnicalSupport';
import AdminGeneralChat from './pages/admin/AdminGeneralChat';
import LOADINGPAGE from './pages/common/LOADINGPAGE';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <LOADINGPAGE
              onProfessorClick={() => navigate('/register')}
              onAdminClick={() => navigate('/login')}
            />
          }
        />

        {/* Auth Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Teacher Routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/content-review"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ContentReview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/support"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminGeneralChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/teacher-support"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <TechnicalSupport />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
