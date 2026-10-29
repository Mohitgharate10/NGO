import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Public layout
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import Event from "./pages/Event";
import Contact from "./pages/Contact";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Portal landing pages (info pages on main site)
import VolunteerPortal from "./pages/VolunteerPortal";
import DonorPortal from "./pages/DonorPortal";
import AdminPortal from "./pages/AdminPortal";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Event />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Info/landing pages — these link to the separate portal apps */}
            <Route path="/volunteer-portal" element={<VolunteerPortal />} />
            <Route path="/donor-portal" element={<DonorPortal />} />
            <Route path="/admin-portal" element={<AdminPortal />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
