// chef dorchestre du site (regroupe component, hook etc)

// imports
import { BrowserRouter, Routes, Route } from "react-router-dom";
// pages
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}