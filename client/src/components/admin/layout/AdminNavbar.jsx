// fichier gerant le component navbar admin

// import
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
// component
import ProfileMenu from "../../layout/ProfileMenu";
// icone
import { LayoutDashboard, Users, Briefcase, Copy, Terminal, Menu, X, LogOut, User } from "lucide-react";

export default function AdminNavbar() {
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
        <nav className="bg-primary-dark shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-16">

                    {/* partie gauche (navigations) */}
                    <div className="hidden md:flex items-center gap-6">
                        <NavLink to="/admin/dashboard" className={navLinkClass}>
                            <LayoutDashboard className="w-4 h-4 text-white" />
                            Dashboard
                        </NavLink>
                        <NavLink to="/admin/users" className={navLinkClass}>
                            <Users className="w-4 h-4 text-white" />
                            Utilisateurs
                        </NavLink>
                        <NavLink to="/admin/jobs" className={navLinkClass}>
                            <Briefcase className="w-4 h-4 text-white" />
                            Offres
                        </NavLink>
                        <NavLink to="/admin/duplicates" className={navLinkClass}>
                            <Copy className="w-4 h-4 text-white" />
                            Doublons
                        </NavLink>
                        <NavLink to="/admin/logs" className={navLinkClass}>
                            <Terminal className="w-4 h-4 text-white" />
                            Logs
                        </NavLink>
                    </div>

                    {/* menu burger (mobile) */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-bone"
                        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* partie droite menu profil */}
                    <ProfileMenu
                        roleName="CapyAdmin"
                        profileLink="/admin/profile"
                    />

                </div>

                {/* menu mobile */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-125 pb-4" : "max-h-0"
                        }`}
                >
                    <div className="flex flex-col gap-1">
                        <NavLink to="/admin/dashboard" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
                            <LayoutDashboard className="w-4 h-4 text-white" />
                            Dashboard
                        </NavLink>
                        <NavLink to="/admin/users" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
                            <Users className="w-4 h-4 text-white" />
                            Utilisateurs
                        </NavLink>
                        <NavLink to="/admin/jobs" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
                            <Briefcase className="w-4 h-4 text-white" />
                            Offres
                        </NavLink>
                        <NavLink to="/admin/duplicates" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
                            <Copy className="w-4 h-4 text-white" />
                            Doublons (IA)
                        </NavLink>
                        <NavLink to="/admin/logs" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
                            <Terminal className="w-4 h-4 text-white" />
                            Logs
                        </NavLink>

                        <hr className="border-light-bone/10 my-2" />

                        {/* link (profil & deconnexion) */}
                        <Link
                            to="/admin/profile"
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
                            Quitter l'admin
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}