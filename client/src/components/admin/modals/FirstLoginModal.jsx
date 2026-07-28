// import
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Banana, X } from "lucide-react";

const STORAGE_KEY = "capycareer_first_login_seen";
const ANIMATION_DURATION = 250; // ms, doit matcher la durée du CSS (index.css)

export default function FirstLoginModal() {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    // vérifie au montage si la modale a déjà été vue
    useEffect(() => {
        const hasSeenModal = localStorage.getItem(STORAGE_KEY);
        if (!hasSeenModal) {
            setIsVisible(true);
        }
    }, []);

    const handleClose = () => {
        setIsClosing(true);

        // attend la fin de l'animation avant de retirer la modale du DOM
        setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, "true");
            setIsVisible(false);
        }, ANIMATION_DURATION);
    };

    if (!isVisible) return null;

    return (
        <>
            {/* overlay (non cliquable pour fermer) */}
            <div
                className={`fixed inset-0 bg-black/50 z-9998 ${isClosing ? "animate-[overlay-fade-out_250ms_ease-in_forwards]" : "animate-[overlay-fade-in_250ms_ease-out_forwards]"}`}
                aria-hidden="true"
            />

            {/* modale */}
            <div
                className={`fixed top-1/2 left-1/2 z-9999 w-[90%] max-w-md rounded-3xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.2)] ${isClosing ? "animate-[modal-pop-out_250ms_ease-in_forwards]" : "animate-[modal-pop-in_250ms_ease-out_forwards]"}`}
            >
                {/* header */}
                <div className="relative bg-primary-dark px-5 py-4">
                    <h2 className="font-bold text-2xl sm:text-3xl text-light text-center">
                        Bienvenue !
                    </h2>

                    <button
                        onClick={handleClose}
                        aria-label="Fermer la fenêtre de bienvenue"
                        title="Fermer"
                        className="absolute top-3 right-3 p-1.5 rounded-full text-light hover:bg-white/20 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* contenu */}
                <div className="bg-bone-light text-center p-6 flex flex-col items-center gap-3">
                    <h3 className="font-semibold text-lg">Première fois sur notre site ?</h3>

                    <p className="text-sm sm:text-base">
                        Veuillez vous connecter pour postuler à votre métier de rêve !
                    </p>

                    <Link
                        to="/login"
                        onClick={handleClose}
                        className="flex items-center justify-center gap-3 mt-2 text-primary-dark font-medium hover:text-primary-light transition-colors"
                    >
                        <Banana />
                        <span>Se connecter</span>
                    </Link>
                </div>
            </div>
        </>
    );
}
