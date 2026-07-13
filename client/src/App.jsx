// chef dorchestre du site (regroupe component, hook etc)

// imports
import { BrowserRouter, Routes, Route } from "react-router-dom";
// pages
import Register from "./pages/Register";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Page Register */}
        <Route path="/register" element={<Register />} />

        {/* Page Accueil */}
        <Route path="/home" element={<Home />} />

      </Routes>
    </BrowserRouter>
  );
}