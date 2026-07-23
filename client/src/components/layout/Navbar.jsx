// fichier du component navbar

// import
import { useState, useContext } from "react";
import { NavLink, Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
// component 
import ProfileMenu from "./ProfileMenu";
// context
import { AuthContext } from "../../context/AuthContext";
import { HandednessContext } from "../../context/HandednessContext";
// hook
import { useHandedness } from "../../hook/useHandedness.js";
// icone
import { Home, Building2, UserPlus, LogIn, Menu, X, User, LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "../../hook/useTheme";

export default function Navbar() {

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  // récupère le token pour savoir si l'utilisateur est connecté
  const { token } = useContext(AuthContext);
  const isAuthenticated = !!token;

  // cible fonction logout & hook pour navigation
  const { logout } = useContext(AuthContext);

  // récupère la préférence gaucher/droitier pour inverser la barre mobile
  const { isRightHanded } = useContext(HandednessContext);

  // récupère le thème
  const { theme, toggleTheme } = useTheme();

  // fonction qui gere la vraie deconnexion
  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  // SI isActive alors return style
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 h-16 px-2 border-b-2 font-medium transition-colors ${isActive
      ? "border-primary text-light-bone"
      : "border-transparent text-light-bone hover:text-light hover:border-primary-light/50"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-2 py-3 px-2 rounded-md font-medium transition-colors ${isActive
      ? "bg-primary/20 text-light-bone"
      : "text-light-bone hover:text-light hover:bg-primary-light/10"
    }`;

  return (
    <nav className="bg-primary-dark shadow-sm sticky top-0 z-50 ">
      <div className="max-w-7xl mx-auto px-6">
        {/* flex-row-reverse uniquement sur mobile (md:flex-row la neutralise en desktop) si l'utilisateur est droitier */}
        <div className={`flex ${isRightHanded ? "flex-row-reverse md:flex-row" : "flex-row"} justify-between items-center h-16 `}>

          {/* partie gauche (navigations) */}
          <div className="hidden md:flex items-center gap-8 ">
            <NavLink to="/" className={navLinkClass}>
              <Home className="w-4 h-4 text-color-white" />
              Accueil
            </NavLink>

            <NavLink to="/companies" className={navLinkClass}>
              <Building2 className="w-4 h-4 text-color-white" />
              Entreprises
            </NavLink>

            {isAuthenticated && (
              <NavLink
                to="/candidate/profile"
                className={navLinkClass}
              >
                <User className="w-4 h-4" />
                Mon Profil
              </NavLink>
            )}

            {/* WARNING: liens à cacher si luser est co */}
            {!isAuthenticated && (
              <>
                <NavLink to="/register" className={navLinkClass}>
                  <UserPlus className="w-4 h-4 text-color-white" />
                  Inscription
                </NavLink>

                <NavLink to="/login" className={navLinkClass}>
                  <LogIn className="w-4 h-4 text-color-white" />
                  Connexion
                </NavLink>
              </>
            )}
          </div>

          {/* btn burger (visible sous md) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-light"
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* bouton thème */}
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"}
            className="p-2 rounded-full text-light hover:bg-primary-light/10 transition-colors"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* partie droite menu profile */}
          <ProfileMenu
            roleName="CapyCareer"
            profileLink="/candidate/profile"
          />


        </div>

        {/* menu mobile déroulant */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-125 pb-4" : "max-h-0"
            }`}
        >
          <div className="flex flex-col gap-1">
            <NavLink to="/" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
              <Home className="w-4 h-4 text-color-white" />
              Accueil
            </NavLink>

            <NavLink to="/companies" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
              <Building2 className="w-4 h-4 text-color-white" />
              Entreprises
            </NavLink>

            {isAuthenticated && (
              <NavLink
                to="/candidate/profile"
                className={mobileNavLinkClass}
              >
                <User className="w-4 h-4" />
                Mon Profil
              </NavLink>
            )}

            {!isAuthenticated && (
              <>
                <NavLink to="/register" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
                  <UserPlus className="w-4 h-4 text-color-white" />
                  Inscription
                </NavLink>

                <NavLink to="/login" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
                  <LogIn className="w-4 h-4 text-color-white" />
                  Connexion
                </NavLink>
              </>
            )}

            <hr className="border-light-bone/10 my-2" />

            {/* link (profil & deconnexion) mobile */}
            {isAuthenticated && (
              <>

                <NavLink
                  to="/"
                  className="flex items-center gap-2 py-3 px-2 rounded-md font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}