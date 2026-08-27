import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Exams from "./pages/Exams";
import ManageSections from "./pages/ManageSections";
import ManageQuestions from "./pages/ManageQuestions";
import BankSoal from "./pages/BankSoal";
import Monitoring from "./pages/Monitoring";
import Settings from "./pages/Settings";

import ScoreManagement from "./pages/ScoreManagement";
import ParticipantScores from "./pages/ParticipantScores";
import { useAuth } from "./context/AuthContext";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

function RoleBasedRedirect() {
  const { user } = useAuth();
  if (user?.role === "supervisor") {
    return <Navigate to="/users" />;
  }
  return <Navigate to="/dashboard" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/bank-soal"
          element={
            <PrivateRoute>
              <BankSoal />
            </PrivateRoute>
          }
        />
        <Route
          path="/exams"
          element={
            <PrivateRoute>
              <Exams />
            </PrivateRoute>
          }
        />
        <Route
          path="/exams/:examId/sections"
          element={
            <PrivateRoute>
              <ManageSections />
            </PrivateRoute>
          }
        />
        <Route
          path="/sections/:sectionId/questions"
          element={
            <PrivateRoute>
              <ManageQuestions />
            </PrivateRoute>
          }
        />
        <Route
          path="/monitoring"
          element={
            <PrivateRoute>
              <Monitoring />
            </PrivateRoute>
          }
        />
        <Route
          path="/score-management"
          element={
            <PrivateRoute>
              <ScoreManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/participant-scores"
          element={
            <PrivateRoute>
              <ParticipantScores />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <RoleBasedRedirect />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
