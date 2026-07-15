// chef dorchestre du site (regroupe component, hook etc)

// imports
import { BrowserRouter, Routes, Route } from "react-router-dom";
// pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFoundPage from "./pages/404";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Page Register */}
        <Route path="/register" element={<Register />} />

        {/* Page Login */}
        <Route path="/login" element={<Login />} />

        {/* Page Accueil */}
        <Route path="/home" element={<Home />} />

        {/* Page 404 */}
        <Route path="/404" element={<NotFoundPage/>} />

      </Routes>
    </BrowserRouter>
  );
}