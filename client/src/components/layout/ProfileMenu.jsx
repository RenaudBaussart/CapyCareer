// fichier gerant le component menu profil

// import
import { useState } from "react";
import { Link } from "react-router-dom";
// icone
import { ChevronDown, User, LogOut } from "lucide-react";
// img
import defaultLogo from "../../assets/logos/CapySquare.png";

export default function ProfileMenu({ 
    roleName = "Profil", 
    profileLink = "/profile", 
    logoSrc = defaultLogo 
}) {
    // etat du menu deroulant
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative flex items-center">
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
                    
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                    </Link>
                </div>
            )}
        </div>
    );
}