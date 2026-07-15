// fichier du component navbar

// import
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
// icone
import { Home, Building2, UserPlus, LogIn, Menu, X } from "lucide-react";
// img
import logo from "../../assets/logos/CapySquare.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // SI isActive alors return style (pour souligner la page ouverte)
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 h-16 px-2 border-b-2 font-medium transition-colors ${isActive
      ? "border-primary text-bone"
      : "border-transparent text-bone/70 hover:text-bone hover:border-primary-light/50"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-2 py-3 px-2 rounded-md font-medium transition-colors ${isActive
      ? "bg-primary/20 text-bone"
      : "text-bone/70 hover:text-bone hover:bg-primary-light/10"
    }`;

  return (
    <nav className="bg-primary-dark shadow-sm sticky top-0 z-50 ">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16 ">

          {/* partie gauche (navigations)n */}
          <div className="hidden md:flex items-center gap-8 ">
            <NavLink to="/home" className={navLinkClass}>
              <Home className="w-4 h-4 text-white" />
              Accueil
            </NavLink>

            <NavLink to="/companies" className={navLinkClass}>
              <Building2 className="w-4 h-4 text-white" />
              Entreprises
            </NavLink>

            <NavLink to="/register" className={navLinkClass}>
              <UserPlus className="w-4 h-4 text-white" />
              Inscription
            </NavLink>

            <NavLink to="/login" className={navLinkClass}>
              <LogIn className="w-4 h-4 text-white" />
              Connexion
            </NavLink>
          </div>

          {/* bouton burger (visible uniquement en dessous de md) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-bone"
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* partie droite(logo) */}
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xl font-bold text-bone tracking-tight">
              CapyCareer
            </Link>

            <img src={logo} alt="Logo CapyCareer" className="h-10 w-auto" />
          </div>

        </div>

        {/* menu mobile déroulant */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-64 pb-4" : "max-h-0"
            }`}
        >
          <div className="flex flex-col gap-1">
            <NavLink to="/home" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
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
          </div>
        </div>
      </div>
    </nav>
  );
}