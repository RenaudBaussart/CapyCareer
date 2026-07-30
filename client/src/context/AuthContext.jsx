// import
import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContextObject";
// fonction blacklist + vérification session
import { logoutApi, checkSession } from "../services/auth.service";
// registre du handler pour les 401 détectés par authFetch
import { registerUnauthorizedHandler } from "../services/authFetch";
// importer jwtDecode pour verif date expiration
import { jwtDecode } from "jwt-decode";

// sexecute uniquement au loading du site (transformé en fonction synchrone)
const getInitialAuth = () => {
    // verif localStorage si luser a coché rester connecté
    const storedToken = localStorage.getItem("capy_token") || sessionStorage.getItem("capy_token");
    const storedUser = localStorage.getItem("capy_user") || sessionStorage.getItem("capy_user");

    if (!storedToken || !storedUser) {
        return { token: null, user: null };
    }

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

            return { token: null, user: null };
        }

        // SINON SI token encore valide
        // alors connecte luser
        return { token: storedToken, user: JSON.parse(storedUser) };

    } catch (e) {
        // SI token corrompu alors clean
        console.error("Erreur lors du parsing ou de la vérification du token", e);
        localStorage.removeItem("capy_token");
        localStorage.removeItem("capy_user");
        sessionStorage.removeItem("capy_token");
        sessionStorage.removeItem("capy_user");

        return { token: null, user: null };
    }
};

// composant provider qui englobe lapp
export function AuthProvider({ children }) {
    // recuperation immediate data
    const initialAuth = getInitialAuth();

    // prepare etat pour stocker token
    const [token, setToken] = useState(initialAuth.token);
    // prepare etat pour stocker infos (nom, mail...)
    const [user, setUser] = useState(initialAuth.user);
    // prepare etat pour stocker si la verif est encore en cours
    const [isLoading, setIsLoading] = useState(false);

    // deconnexion silencieuse
    const forceLogout = useCallback(() => {
        localStorage.removeItem("capy_token");
        localStorage.removeItem("capy_user");
        sessionStorage.removeItem("capy_token");
        sessionStorage.removeItem("capy_user");

        setToken(null);
        setUser(null);
    }, []);

    // enregistre forceLogout
    useEffect(() => {
        registerUnauthorizedHandler(forceLogout);
    }, [forceLogout]);

    // verifie que le compte est toujours valide
    useEffect(() => {
        if (!token) return;

        checkSession(token);

        const interval = setInterval(() => {
            checkSession(token);
            // toutes les 60 secondes
        }, 60000);

        return () => clearInterval(interval);
    }, [token]);

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