// chef dorchestre du site (regroupe component, hook etc)

// imports
import { BrowserRouter, Routes, Route } from "react-router-dom";
// pages USER
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFoundPage from "./pages/404";
import Company from "./pages/Companies"
import Legal from "./pages/Legal"
import AccessibilityPage from "./pages/Accessibility";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import About from "./pages/About";
import ApiDoc from "./pages/ApiDoc";
// pages ADMIN
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminDuplicates from "./pages/admin/AdminDuplicates";
import AdminLogs from "./pages/admin/AdminLogs";
import AdminProfile from "./pages/admin/AdminProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ROUTES USERS */}
        {/* Page Accueil */}
        <Route path="/home" element={<Home />} />

        {/* Page Register */}
        <Route path="/register" element={<Register />} />

        {/* Page Login */}
        <Route path="/login" element={<Login />} />

        {/* Page Compagnies */}
        <Route path="/companies" element={<Company />} />

        {/* Page Legal */}
        <Route path="/legal" element={<Legal />} />

        {/* Page Accessibility */}
        <Route path="/accessibility" element={<AccessibilityPage />} />

        {/* Page Privacy */}
        <Route path="/privacy" element={<Privacy />} />

        {/* Page Terms */}
        <Route path="/terms" element={<Terms />} />

        {/* Page About */}
        <Route path="/about" element={<About />} />

        {/* Page APIDoc */}
        <Route path="/api-doc" element={<ApiDoc />} />

        {/* ROUTES ADMIN */}
        {/* pages Admin Dashboard */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        {/* pages Admin Users */}
        <Route path="/admin/users" element={<AdminUsers />} />
        {/* pages Admin Jobs */}
        <Route path="/admin/jobs" element={<AdminJobs />} />
        {/* pages Admin Duplicates */}
        <Route path="/admin/duplicates" element={<AdminDuplicates />} />
        {/* pages Admin Logs */}
        <Route path="/admin/logs" element={<AdminLogs />} />
        {/* pages Admin Profile */}
        <Route path="/admin/profile" element={<AdminProfile />} />

        {/* ROUTES COMMUNES */}
        {/* Page 404 */}
        <Route path="/404" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}