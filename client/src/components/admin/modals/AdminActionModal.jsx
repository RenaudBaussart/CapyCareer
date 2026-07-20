// fichier gerant la modale de confirmation reutilisable pour admin

// import
// icone
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
    // SI modale nest pas ouverte alors ne return rien
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-dark/40 backdrop-blur-sm transition-all">

            {/* conteneur modale */}
            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.2)] border border-white/50 w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">

                {/* btn fermer */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-primary-dark/50 hover:text-primary-dark hover:bg-white/50 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center mt-2">
                    <div className={`p-4 rounded-full mb-4 ${iconColorClass}`}>
                        <Icon className="w-8 h-8" />
                    </div>

                    <h3 className="text-xl font-bold text-primary-dark mb-2">{title}</h3>
                    <p className="text-primary-dark/70 mb-8">{message}</p>

                    {/* btns actions */}
                    <div className="flex items-center gap-4 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-xl font-medium text-primary-dark bg-white/50 border border-primary-dark/10 hover:bg-white transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 py-3 px-4 rounded-xl font-medium text-white shadow-lg transition-all ${confirmBtnClass}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}