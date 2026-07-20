// fichier gerant la securité des routes, verifie luser est bien co grace à son token

// import
import { useContext } from "react";
import { Navigate } from "react-router-dom";
// permet de communiquer avec linterface pour recup le token
import { AuthContext } from "../context/AuthContext";

// verifie si luser est co avant lacces a une page specifique
export default function RequireAuth({ children }) {
    const { token, isLoading } = useContext(AuthContext);

    // durant la verification affiche chargement
    if (isLoading) {
        return <div className="min-h-screen bg-bone flex items-center justify-center text-primary-dark">Chargement...</div>;
    }

    // SI pas de token, redigirer vers login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // SI token alors acces a la page
    return children;
}