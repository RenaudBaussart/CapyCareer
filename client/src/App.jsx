// chef dorchestre du site (regroupe component, hook etc)

// imports
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// pages
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Page Accueil */}
        <Route path="/" element={<Home />} />

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

        {/* Page 404 */}
        <Route path="/404" element={<NotFoundPage />} />

        {/* Toutes les routes inexistantes */}
        <Route path="*" element={<Navigate to="/404" replace />} />

      </Routes>
    </BrowserRouter>
  );
}