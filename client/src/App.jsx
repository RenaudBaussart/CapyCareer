// chef dorchestre du site (regroupe component, hook etc)

// imports
import { BrowserRouter, Routes, Route } from "react-router-dom";
// pages
import Register from "./pages/Register";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}