// fichier gerant les modales dadministration

// import
import { AlertTriangle, X } from "lucide-react";

export default function AdminActionModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmer",
    confirmBtnClass = "bg-red-500 hover:bg-red-600 shadow-red-500/30",
    iconColorClass = "text-red-500 bg-red-100",
    icon: Icon = AlertTriangle
}) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-font-primary-dark/40 backdrop-blur-sm transition-all"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description">

            {/* conteneur modale */}
            <div className="bg-bone-light/90 backdrop-blur-2xl rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.2)] border border-white/50 w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">

                {/* btn fermer */}
                <button
                    onClick={onClose}
                    aria-label="Fermer la modale"
                    className="absolute top-4 right-4 p-2 text-font-primary-dark/50 hover:text-font-primary-dark hover:bg-bone-light/50 focus:outline-none focus:ring-2 focus:ring-primary rounded-full transition-colors">
                    <X className="w-5 h-5" aria-hidden="true" />
                </button>

                <div className="flex flex-col items-center text-center mt-2">
                    <div className={`p-4 rounded-full mb-4 ${iconColorClass}`} aria-hidden="true">
                        <Icon className="w-8 h-8" />
                    </div>

                    {/* titre */}
                    <h3 id="modal-title" className="text-xl font-bold text-font-primary-dark mb-2">
                        {title}
                    </h3>

                    {/* description */}
                    <p id="modal-description" className="text-font-primary-dark/70 mb-8">
                        {message}
                    </p>

                    <div className="flex items-center gap-4 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-xl font-medium text-font-primary-dark bg-bone-light/50 border border-font-primary-dark/10 hover:bg-bone-light focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 py-3 px-4 rounded-xl font-medium text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${confirmBtnClass}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}