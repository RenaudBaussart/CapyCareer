// fichier gerant la securité des routes, verifie luser est bien co grace à son token

// import
import { useContext } from "react";
import { Navigate } from "react-router-dom";
// permet de communiquer avec linterface pour recup le token
import { AuthContext } from "../context/AuthContext";

// verifie si luser est co avant lacces a une page specifique
export default function RequireAuth({ children, allowedRoles }) {
    const { token, user, isLoading } = useContext(AuthContext);

    // durant la verification affiche chargement
    if (isLoading) {
        return <div className="min-h-screen bg-bone flex items-center justify-center text-primary-dark">Chargement...</div>;
    }

    // SI pas de token, redigirer vers login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // SI des roles sont exigés pour la route & que luser na pas le bon role
    if (allowedRoles && !allowedRoles.includes(user?.roleId)) {
        // alors redirige luser selon son espace
        switch (user?.roleId) {
            case "admin":
                return <Navigate to="/admin/dashboard" replace />;
            case "entreprise":
                return <Navigate to="/company/dashboard" replace />;
            case "candidat":
            case "user":
                return <Navigate to="/" replace />;
            default:
                // pour les autres cas de non role par défaut sur laccueil du site
                return <Navigate to="/" replace />;
        }
    }

    // SI token & bon role alors acces a son espace
    return children;
}