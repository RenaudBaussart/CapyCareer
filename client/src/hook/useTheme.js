// Fichier hook gérant le contexte du theme 

import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export function useTheme() {
  return useContext(ThemeContext);
}
