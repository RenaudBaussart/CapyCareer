// fichier du component navbar

// import
import { NavLink, Link } from "react-router-dom";
// icone
import { Home, Building2, UserPlus, LogIn } from "lucide-react";
// img
import logo from "../../assets/logos/CapySquare.png";

export default function Navbar() {
  // SI isActive alors return style (pour souligner la page ouverte)
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 h-16 px-2 border-b-2 font-medium transition-colors ${
      isActive
        ? "border-primary text-primary-dark" 
        : "border-transparent text-primary-dark/70 hover:text-primary-dark hover:border-primary-light/50"
    }`;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* partie gauche (navigations)n */}
          <div className="flex items-center gap-8">
            <NavLink to="/" className={navLinkClass}>
              <Home className="w-4 h-4" />
              Accueil
            </NavLink>

            <NavLink to="/companies" className={navLinkClass}>
              <Building2 className="w-4 h-4" />
              Entreprises
            </NavLink>

            <NavLink to="/register" className={navLinkClass}>
              <UserPlus className="w-4 h-4" />
              Inscription
            </NavLink>

            <NavLink to="/login" className={navLinkClass}>
              <LogIn className="w-4 h-4" />
              Connexion
            </NavLink>
          </div>

          {/* partie droite(logo) */}
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xl font-bold text-primary-dark tracking-tight">
              CapyCareer
            </Link>

            <img src={logo} alt="Logo CapyCareer" className="h-10 w-auto" />
          </div>

        </div>
      </div>
    </nav>
  );
}