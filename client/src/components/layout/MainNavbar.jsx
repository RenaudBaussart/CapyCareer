// fichier qui distribue la bonne navbar selon le rôle

// import
// context
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContextObject";
// component
import Navbar from "./Navbar";
import CompanyNavbar from "../companies/layout/CompanyNavbar";
import AdminNavbar from "../admin/layout/AdminNavbar";

export default function MainNavbar() {
    const { token } = useContext(AuthContext);

    let userRole = "visiteur";

    // SI user co 
    if (token) {
        // alors lit role dans token
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            userRole = payload.role || "candidat";
        } catch {
            // console.error("Impossible de lire le token");
        }
    }

    // return navbar selon role
    if (userRole === "entreprise") {
        return <CompanyNavbar />;
    }

    if (userRole === "admin") {
        return <AdminNavbar />;
    }

    // defaut navbar de base
    return <Navbar />;
}