// fichier gerant le component menu profil

// import
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
// call du hook
import { useClickOutside } from "../../hook/useClickOutside";
// icone
import { ChevronDown, User, LogOut } from "lucide-react";
// img
import defaultLogo from "../../assets/logos/CapySquare.png";
// contexte d'authentification
import { AuthContext } from "../../context/AuthContext";

export default function ProfileMenu({ 
    roleName = "Profil", 
    profileLink = "/profile", 
    logoSrc = defaultLogo 
}) {
    // etat du menu deroulant
    const [isOpen, setIsOpen] = useState(false);
    
    // cible fonction logout & hook pour navigation
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // appel du hook de clic
    const menuRef = useClickOutside(() => {
        setIsOpen(false);
    });

    // fonction qui gere la vraie deconnexion
    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate("/login");
    };

    return (
        // ref retournée par hook
        <div className="relative flex items-center" ref={menuRef}>
            {/* btn logo */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
            >
                <span className="text-xl font-bold text-bone tracking-tight hidden sm:block">
                    {roleName}
                </span>
                <img src={logoSrc} alt={`Logo ${roleName}`} className="h-10 w-auto" />
                <ChevronDown className={`w-4 h-4 text-bone transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* menu profil */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-3 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.15)] border border-white/50 py-2 flex flex-col z-50">
                    <Link
                        to={profileLink}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-primary-dark hover:bg-primary/10 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <User className="w-4 h-4" />
                        Mon Profil
                    </Link>
                    
                    <hr className="border-primary-dark/10 my-1 mx-2" />
                    
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                    </button>
                </div>
            )}
        </div>
    );
}