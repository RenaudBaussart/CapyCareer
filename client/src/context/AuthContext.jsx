// fichier gerant a conserver un user connecté en stockant ses infos

// import
import { createContext, useState, useEffect } from "react";

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
        const storedToken = localStorage.getItem("capy_token");
        const storedUser = localStorage.getItem("capy_user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    // fonction call pour se co
    const login = (newToken, userData) => {
        localStorage.setItem("capy_token", newToken);
        localStorage.setItem("capy_user", JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
    };

    // fonction call pour se deco
    const logout = () => {
        localStorage.removeItem("capy_token");
        localStorage.removeItem("capy_user");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}