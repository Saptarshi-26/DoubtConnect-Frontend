import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StudentSignupPage from "./pages/StudentSignupPage";
import TeacherSignupPage from "./pages/TeacherSignupPage";

import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

import EducatorsPage from "./pages/EducatorsPage";
import SessionRequestPage from "./pages/SessionRequestPage";
import PayoutPage from "./pages/PayoutPage";
import GoogleConnectPage from "./pages/GoogleConnectPage";
import TeacherAvailabilityPage from "./pages/TeacherAvailabilityPage";
import TeacherSessionRequestsPage from "./pages/TeacherSessionRequestsPage";
import StudentSessionRequestsPage from "./pages/StudentSessionRequestsPage";
import StudentSlotBookingPage from "./pages/StudentSlotBookingPage";
import StudentSessionEventsPage from "./pages/StudentSessionEventsPage";
import TeacherSessionEventsPage from "./pages/TeacherSessionEventsPage";
import StudentProfilePage from "./pages/StudentProfilePage";
import TeacherProfilePage from "./pages/TeacherProfilePage";
import DeleteStudentPage from "./pages/DeleteStudentPage";
import DeleteTeacherPage from "./pages/DeleteTeacherPage";
import TeacherPublicProfilePage from "./pages/TeacherPublicProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AboutPage from "./pages/AboutPage";
import PaymentPolicyPage from "./pages/PaymentPolicyPage";
import TeacherMeetingLinkPage from "./pages/TeacherMeetingLinkPage";
import AdminStudentsPage from "./pages/AdminStudentsPage";
import AdminReportsPage from "./pages/AdminReportsPage";
import AdminTestDataPage from "./pages/AdminTestDataPage";

import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./context/ThemeToggle";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="fixed bottom-6 right-6 z-50">
  <ThemeToggle />
</div>

        <Routes>

          <Route path="/" element={<LandingPage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/student" element={<StudentSignupPage />} />
          <Route path="/signup/teacher" element={<TeacherSignupPage />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/teacher" element={<TeacherDashboard />} />

          <Route path="/educators" element={<EducatorsPage />} />

          <Route
            path="/session-request/:teacherId"
            element={<SessionRequestPage />}
          />
          <Route path="/payout" element={<PayoutPage />} />
          <Route
            path="/google-connect"
            element={<GoogleConnectPage />}
          />
          <Route
            path="/teacher-availability"
            element={<TeacherAvailabilityPage />}
          />
          <Route path="/teacher-sessions" element={<TeacherSessionRequestsPage />} />
          <Route path="/student-session-requests" element={<StudentSessionRequestsPage />} />
          <Route path="/book-slot/:sessionRequestId" element={<StudentSlotBookingPage />} />
          <Route path="/student-sessions" element={<StudentSessionEventsPage />} />
          <Route path="/teacher-session-events" element={<TeacherSessionEventsPage />} />
          <Route path="/student-profile" element={<StudentProfilePage />} />
          <Route path="/teacher-profile" element={<TeacherProfilePage />} />
          <Route path="/delete-student" element={<DeleteStudentPage />} />
          <Route path="/delete-teacher" element={<DeleteTeacherPage />} />
          <Route path="/educators/:teacherId" element={<TeacherPublicProfilePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/payment-policy" element={<PaymentPolicyPage />} />
          <Route path="/teacher-meeting-setup" element={<TeacherMeetingLinkPage />} />
          <Route path="/admin/students" element={<AdminStudentsPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/test-data" element={<AdminTestDataPage />} />

        </Routes>

      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;