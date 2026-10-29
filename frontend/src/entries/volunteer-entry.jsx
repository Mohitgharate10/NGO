import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../componants/ProtectedRoute";
import VolunteerLayout from "../layouts/VolunteerLayout";
import VolunteerDashboard from "../volunteer/VolunteerDashboard";
import VolunteerApply from "../volunteer/VolunteerApply";
import VolunteerHistory from "../volunteer/VolunteerHistory";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import "../index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login"    element={<LoginPage    portalRole="volunteer" />} />
          <Route path="/register" element={<RegisterPage portalRole="volunteer" />} />
          <Route path="/" element={
            <ProtectedRoute role="volunteer" loginPath="/login">
              <VolunteerLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<VolunteerDashboard />} />
            <Route path="apply"     element={<VolunteerApply />} />
            <Route path="history"   element={<VolunteerHistory />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  </React.StrictMode>
);