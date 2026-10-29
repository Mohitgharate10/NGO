import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../componants/ProtectedRoute";
import AdminLayout from "../admin/AdminLayout";
import AdminDashboard from "../admin/AdminDashboard";
import AdminDonations from "../admin/AdminDonations";
import AdminContacts from "../admin/AdminContacts";
import AdminVolunteers from "../admin/AdminVolunteers";
import AdminEvents from "../admin/AdminEvents";
import AdminLogin from "../admin/AdminLogin";
import "../index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/" element={
            <ProtectedRoute role="admin" loginPath="/login">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"  element={<AdminDashboard />} />
            <Route path="donations"  element={<AdminDonations />} />
            <Route path="contacts"   element={<AdminContacts />} />
            <Route path="volunteers" element={<AdminVolunteers />} />
            <Route path="events"     element={<AdminEvents />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  </React.StrictMode>
);