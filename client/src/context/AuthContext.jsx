// import
import { createContext, useState, useEffect } from "react";
// fonction blacklist
import { logoutApi } from "../services/auth.service";
// importer jwtDecode pour verif date expiration
import { jwtDecode } from "jwt-decode";

// creation contexte dauthentification
export const AuthContext = createContext();

// composant provider qui englobe lapp
export function AuthProvider({ children }) {
    // prepare etat pour stocker token
    const [token, setToken] = useState(null);
    // prepare etat pour stocker infos (nom, mail...)
    const [user, setUser] = useState(null);
    // prepare etat pour stocker si la verif est encore en cours
    const [isLoading, setIsLoading] = useState(true);

    // sexecute uniquement au loading du site
    useEffect(() => {
        // verif localStorage si luser a coché rester connecté
        const storedToken = localStorage.getItem("capy_token") || sessionStorage.getItem("capy_token");
        const storedUser = localStorage.getItem("capy_user") || sessionStorage.getItem("capy_user");

        if (storedToken && storedUser) {
            try {
                // lis le token pour connaitre date expiration
                const decodedToken = jwtDecode(storedToken);
                // date actuelle en sec
                const currentTime = Date.now() / 1000;

                // SI token est expiré
                if (decodedToken.exp < currentTime) {
                    // compte déconnecté token supprimé
                    console.warn("Le token est expiré. Déconnexion automatique.");
                    localStorage.removeItem("capy_token");
                    localStorage.removeItem("capy_user");
                    sessionStorage.removeItem("capy_token");
                    sessionStorage.removeItem("capy_user");
                    // SINON SI token encore valide
                } else {
                    // alors connecte luser
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
                // SI token corrompu alors clean
            } catch (e) {
                console.error("Erreur lors du parsing ou de la vérification du token", e);
                localStorage.removeItem("capy_token");
                localStorage.removeItem("capy_user");
                sessionStorage.removeItem("capy_token");
                sessionStorage.removeItem("capy_user");
            }
        }
        setIsLoading(false);
    }, []);

    // fonction call pour se co
    const login = (newToken, userData) => {
        const { rememberMe, ...userInfos } = userData;

        // SI luser a coché rememberMe ALORS met en localStorage (soit permanent)
        const storage = rememberMe ? localStorage : sessionStorage;

        storage.setItem("capy_token", newToken);
        storage.setItem("capy_user", JSON.stringify(userInfos));

        setToken(newToken);
        setUser(userInfos);
    };

    // fonction call pour se deco
    const logout = async () => {
        try {
            if (token) {
                // call api pour blacklister le token
                await logoutApi(token);
            }
        } catch (error) {
            console.error("Erreur lors du blacklistage", error);
        } finally {
            // clean les deux espaces du token
            localStorage.removeItem("capy_token");
            localStorage.removeItem("capy_user");
            sessionStorage.removeItem("capy_token");
            sessionStorage.removeItem("capy_user");

            setToken(null);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}