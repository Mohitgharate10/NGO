import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../componants/ProtectedRoute";
import DonorLayout from "../layouts/DonorLayout";
import DonorDashboard from "../donor/DonorDashboard";
import DonorDonate from "../donor/DonorDonate";
import DonorHistory from "../donor/DonorHistory";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import "../index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login"    element={<LoginPage    portalRole="donor" />} />
          <Route path="/register" element={<RegisterPage portalRole="donor" />} />
          <Route path="/" element={
            <ProtectedRoute role="donor" loginPath="/login">
              <DonorLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DonorDashboard />} />
            <Route path="donate"    element={<DonorDonate />} />
            <Route path="history"   element={<DonorHistory />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  </React.StrictMode>
);