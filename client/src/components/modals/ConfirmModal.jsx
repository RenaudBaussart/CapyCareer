// fichier gerant modale confirmation globale

// import
import { useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { useClickOutside } from "../../hook/useClickOutside";

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmer",
    cancelText = "Annuler",
    isDestructive = false,
    isLoading = false
}) {
    // ferme la modale si clic outside
    const modalRef = useClickOutside(onClose);

    // gestion du scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            {/* ref modal pour detecter le clic */}
            <div
                ref={modalRef}
                className="bg-bone-light/95 dark:bg-bone-light/95 w-full max-w-lg rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.2)] border border-white/50 dark:border-white/10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            >

                {/* haut */}
                <div className="flex justify-between items-start p-6 border-b border-primary-dark/10">
                    <h3 className="text-xl font-bold text-font-primary-dark flex items-center gap-2 pr-4">
                        {isDestructive && <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />}
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-font-primary-dark/40 hover:text-font-primary-dark transition-colors focus:outline-none shrink-0"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* body */}
                <div className="p-6 text-font-primary-dark/80 leading-relaxed text-lg">
                    <p>{message}</p>
                </div>

                {/* footer */}
                <div className="p-6 bg-bone/30 dark:bg-black/5 flex justify-end gap-3 border-t border-primary-dark/10">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-5 py-2.5 font-medium text-font-primary-dark border border-font-primary-dark/20 hover:bg-bone rounded-xl transition-colors disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-5 py-2.5 font-bold text-white rounded-xl transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2 
                        ${isDestructive
                                ? 'bg-red-600 hover:bg-red-700 shadow-red-600/30'
                                : 'bg-primary hover:bg-primary-dark shadow-primary/30'}`}
                    >
                        {isLoading ? "Traitement..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}