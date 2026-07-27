/* eslint-disable react-refresh/only-export-components */

// contexte gérant la préférence de main (gaucher/droitier) pour l'affichage mobile

import { createContext, useState } from "react";

const STORAGE_KEY = "capy_handedness";

export const HandednessContext = createContext();

// composant provider qui englobe lapp
export function HandednessProvider({ children }) {
    // gaucher par défaut (comportement actuel de la navbar : burger à gauche)
    const [handedness, setHandednessState] = useState(() => {
        return localStorage.getItem(STORAGE_KEY) || "left";
    });

    // met à jour la préférence et la persiste
    function setHandedness(value) {
        localStorage.setItem(STORAGE_KEY, value);
        setHandednessState(value);
    }

    return (
        <HandednessContext.Provider
            value={{ handedness, setHandedness, isRightHanded: handedness === "right" }}
        >
            {children}
        </HandednessContext.Provider>
    );
}