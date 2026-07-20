// fichier du component navbar

// import
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
// component 
import ProfileMenu from "./ProfileMenu";
// icone
import { Home, Building2, UserPlus, LogIn, Menu, X, User, LogOut } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // SI isActive alors return style
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 h-16 px-2 border-b-2 font-medium transition-colors ${isActive
      ? "border-primary text-light-bone"
      : "border-transparent text-light-bone hover:text-white hover:border-primary-light/50"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-2 py-3 px-2 rounded-md font-medium transition-colors ${isActive
      ? "bg-primary/20 text-light-bone"
      : "text-white hover:text-white hover:bg-primary-light/10"
    }`;

  return (
    <nav className="bg-primary-dark shadow-sm sticky top-0 z-50 ">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16 ">

          {/* partie gauche (navigations) */}
          <div className="hidden md:flex items-center gap-8 ">
            <NavLink to="/" className={navLinkClass}>
              <Home className="w-4 h-4 text-white" />
              Accueil
            </NavLink>

            <NavLink to="/companies" className={navLinkClass}>
              <Building2 className="w-4 h-4 text-white" />
              Entreprises
            </NavLink>

            {/* WARNING: liens à cacher si luser est co */}
            <NavLink to="/register" className={navLinkClass}>
              <UserPlus className="w-4 h-4 text-white" />
              Inscription
            </NavLink>

            <NavLink to="/login" className={navLinkClass}>
              <LogIn className="w-4 h-4 text-white" />
              Connexion
            </NavLink>
          </div>

          {/* btn burger (visible sous md) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-bone"
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
              <Home className="w-4 h-4 text-white" />
              Accueil
            </NavLink>

            <NavLink to="/companies" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
              <Building2 className="w-4 h-4 text-white" />
              Entreprises
            </NavLink>

            <NavLink to="/register" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
              <UserPlus className="w-4 h-4 text-white" />
              Inscription
            </NavLink>

            <NavLink to="/login" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
              <LogIn className="w-4 h-4 text-white" />
              Connexion
            </NavLink>

            <hr className="border-light-bone/10 my-2" />

            {/* link (profil & deconnexion) mobile */}
            <Link
              to="/candidate/profile"
              className="flex items-center gap-2 py-3 px-2 rounded-md font-medium text-white hover:bg-primary-light/10 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              Mon Profil
            </Link>

            <Link
              to="/"
              className="flex items-center gap-2 py-3 px-2 rounded-md font-medium text-red-400 hover:bg-red-500/10 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}