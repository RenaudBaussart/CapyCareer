import { useEffect, useRef } from "react";

export function useClickOutside(onOutsideClick) {
    // ref vers lelement html ciblé
    const elementRef = useRef(null);

    useEffect(() => {
        function checkClick(event) {
            // fonction call a chaque clic
            if (
                elementRef.current &&
                !elementRef.current.contains(event.target)
            ) {
                onOutsideClick();
            }
        }

        // ecout des clic sur la page
        document.addEventListener("mousedown", checkClick);

        // des que le menu est fermé, lecoute s'arrete
        return () => {
            document.removeEventListener("mousedown", checkClick);
        };
    }, [onOutsideClick]);

    return elementRef;
}