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
import UserProfile from "./pages/candidate/UserProfile";
// pages ADMIN
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminJobs from "./pages/admin/AdminJobs";
// import AdminDuplicates from "./pages/admin/AdminDuplicates";
// import AdminLogs from "./pages/admin/AdminLogs";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminCompanies from "./pages/admin/AdminCompanies"
// pages Entreprise/Recruteur
import CompanyRegister from "./pages/company/CompanyRegister";
import CompanyForm from "./pages/CompanyForm";
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyProfile from "./pages/company/CompanyProfile";
// permet de communiquer le token a linterface
import { AuthProvider } from "./context/AuthContext";
// pour gérer la préférence d'affichage de l'utilisateur en mobile
import { HandednessProvider } from "./context/HandednessContext";
// pour gérer le thème choisi
import { ThemeProvider } from "./context/ThemeContext";

// sécurité des routes
import RequireAuth from "./guards/RequireAuth";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HandednessProvider>
          <BrowserRouter>
            <Routes>

              {/* ROUTES COMMUNES */}
              {/* Toutes les routes inexistantes */}
              <Route path="*" element={<Navigate to="/404" replace />} />
              {/* Page 404 */}
              <Route path="/404" element={<NotFoundPage />} />

              {/* ROUTES USERS OFFLINE */}
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


              {/* ROUTES USER ONLINE */}

              {/* Pages User Profile */}
              <Route
                path="/candidate/profile"
                element={
                  <RequireAuth allowedRoles={["candidat", "user"]}>
                    <UserProfile />
                  </RequireAuth>
                }
              />


              {/* ROUTES ADMIN */}

              {/* Pages Admin Dashboard */}
              <Route
                path="/admin/dashboard"
                element={
                  <RequireAuth allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </RequireAuth>
                }
              />

              {/* Pages Admin Candidat */}
              <Route
                path="/admin/candidat"
                element={
                  <RequireAuth allowedRoles={["admin"]}>
                    <AdminUsers />
                  </RequireAuth>
                }
              />

              {/* Pages Admin Entreprise */}
              <Route
                path="/admin/entreprise"
                element={
                  <RequireAuth allowedRoles={["admin"]}>
                    <AdminCompanies />
                  </RequireAuth>
                }
              />

              {/* Pages Admin Jobs */}
              <Route
                path="/admin/jobs"
                element={
                  <RequireAuth allowedRoles={["admin"]}>
                    <AdminJobs />
                  </RequireAuth>
                }
              />

              {/* Pages Admin Duplicates
              <Route
                path="/admin/duplicates"
                element={
                  <RequireAuth allowedRoles={["admin"]}>
                    <AdminDuplicates />
                  </RequireAuth>
                }
              /> */}

              {/* Pages Admin Logs */}
              {/* <Route
                path="/admin/logs"
                element={
                  <RequireAuth allowedRoles={["admin"]}>
                    <AdminLogs />
                  </RequireAuth>
                }
              /> */}

              {/* Pages Admin Profile */}
              <Route
                path="/admin/profile"
                element={
                  <RequireAuth allowedRoles={["admin"]}>
                    <AdminProfile />
                  </RequireAuth>
                }
              />

              {/* ROUTES ENTREPRISES */}

              {/* Formulaire dashboard entreprise*/}
              <Route
                path="/company/dashboard/form"
                element={
                  <RequireAuth allowedRoles={["entreprise"]}>
                    <CompanyForm />
                  </RequireAuth>
                }
              />

              {/* Dashboard Entreprise */}
              <Route
                path="/company/dashboard"
                element={
                  <RequireAuth allowedRoles={["entreprise"]}>
                    <CompanyDashboard />
                  </RequireAuth>
                }
              />

              {/* Pages Entreprise Profile */}
              <Route
                path="/company/profile"
                element={
                  <RequireAuth allowedRoles={["entreprise"]}>
                    <CompanyProfile />
                  </RequireAuth>
                }
              />

              {/*inscription entreprise*/}
              <Route
                path="/register-company"
                element={<CompanyRegister />} />

            </Routes>
          </BrowserRouter>
        </HandednessProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}