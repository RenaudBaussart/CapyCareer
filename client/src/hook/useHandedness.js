// hook gérant la préférence de main (gaucher/droitier) pour l'affichage mobile

import { useState } from "react";

const STORAGE_KEY = "capy_handedness";

export function useHandedness() {
  // gaucher par défaut (comportement actuel de la navbar : burger à gauche)
  const [handedness, setHandednessState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "left";
  });

  // met à jour la préférence et la persiste
  function setHandedness(value) {
    localStorage.setItem(STORAGE_KEY, value);
    setHandednessState(value);
  }

  return { handedness, setHandedness, isRightHanded: handedness === "right" };
}