// fichier gerant modale affichage & export data rgpd

import { useEffect } from "react";
import { X, Download, ShieldCheck, User, Mail, AtSign, FileText, Calendar, Shield, Clock, Image as ImageIcon } from "lucide-react";
import { useClickOutside } from "../../hook/useClickOutside";

export default function GdprDataModal({
    isOpen,
    onClose,
    onDownload,
    data,
    isLoading
}) {
    // onclose pour ferme si clic outside
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

    // recuperation des datas user
    const member = data?.member || {};

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">

            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="gdpr-modal-title"
                className="bg-bone-light/95 dark:bg-bone-light/95 w-full max-w-xl rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.2)] border border-white/50 dark:border-white/10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]"
            >

                {/* haut */}
                <header className="flex justify-between items-center p-6 border-b border-primary-dark/10 shrink-0">
                    <h3 id="gdpr-modal-title" className="text-xl font-bold text-font-primary-dark flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-primary" aria-hidden="true" />
                        Mes données personnelles
                    </h3>
                    <button
                        onClick={onClose}
                        aria-label="Fermer la modale"
                        className="text-font-primary-dark/40 hover:text-font-primary-dark transition-colors focus:outline-none"
                    >
                        <X className="w-6 h-6" aria-hidden="true" />
                    </button>
                </header>

                {/* contenu avec tabindex (scroll clavier) */}
                <div tabIndex={0} className="p-6 overflow-y-auto flex-1 space-y-4 focus:outline-none focus:ring-2 focus:ring-primary/50">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <span className="text-font-primary-dark/60 font-medium animate-pulse">
                                Récupération de vos données...
                            </span>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-font-primary-dark leading-relaxed">
                                Voici un récapitulatif exhaustif de toutes les informations stockées sur votre profil dans la base de données de CapyCareer.
                            </p>

                            {/* informations */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">

                                <div className="bg-bone/50 dark:bg-black/20 p-3.5 rounded-2xl border border-white/40 flex items-center gap-3">
                                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0">
                                        <User className="w-5 h-5" aria-hidden="true" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-font-primary-dark/60 font-medium">Nom & Prénom</p>
                                        <p className="text-sm font-semibold text-font-primary-dark truncate">
                                            {member.firstname || "-"} {member.lastname || "-"}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-bone/50 dark:bg-black/20 p-3.5 rounded-2xl border border-white/40 flex items-center gap-3">
                                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0">
                                        <AtSign className="w-5 h-5" aria-hidden="true" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-font-primary-dark/60 font-medium">Pseudo public</p>
                                        <p className="text-sm font-semibold text-font-primary-dark truncate">
                                            {member.username || "-"}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-bone/50 dark:bg-black/20 p-3.5 rounded-2xl border border-white/40 flex items-center gap-3 sm:col-span-2">
                                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0">
                                        <Mail className="w-5 h-5" aria-hidden="true" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-font-primary-dark/60 font-medium">Adresse email</p>
                                        <p className="text-sm font-semibold text-font-primary-dark truncate">
                                            {member.email || "-"}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-bone/50 dark:bg-black/20 p-3.5 rounded-2xl border border-white/40 flex items-center gap-3">
                                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0">
                                        <Shield className="w-5 h-5" aria-hidden="true" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-font-primary-dark/60 font-medium">Rôle sur le site</p>
                                        <p className="text-sm font-semibold text-font-primary-dark truncate capitalize">
                                            {member.role || "-"}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-bone/50 dark:bg-black/20 p-3.5 rounded-2xl border border-white/40 flex items-center gap-3">
                                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0">
                                        <Calendar className="w-5 h-5" aria-hidden="true" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-font-primary-dark/60 font-medium">Date de création</p>
                                        <p className="text-sm font-semibold text-font-primary-dark truncate">
                                            {member.creation_date ? new Date(member.creation_date).toLocaleDateString('fr-FR') : "-"}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-bone/50 dark:bg-black/20 p-3.5 rounded-2xl border border-white/40 flex items-center gap-3 sm:col-span-2">
                                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0">
                                        <Clock className="w-5 h-5" aria-hidden="true" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-font-primary-dark/60 font-medium">Dernière connexion</p>
                                        <p className="text-sm font-semibold text-font-primary-dark truncate">
                                            {member.last_connection ? new Date(member.last_connection).toLocaleString('fr-FR') : "-"}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-bone/50 dark:bg-black/20 p-3.5 rounded-2xl border border-white/40 flex items-center gap-3 sm:col-span-2">
                                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0">
                                        <ImageIcon className="w-5 h-5" aria-hidden="true" />
                                    </div>
                                    <div className="overflow-hidden w-full">
                                        <p className="text-xs text-font-primary-dark/60 font-medium">Lien de l'avatar (Photo de profil)</p>
                                        <p className="text-sm font-semibold text-font-primary-dark truncate">
                                            {member.profil_pic_link || "Aucune image personnalisée"}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-bone/50 dark:bg-black/20 p-3.5 rounded-2xl border border-white/40 flex items-center gap-3 sm:col-span-2">
                                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0">
                                        <FileText className="w-5 h-5" aria-hidden="true" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-font-primary-dark/60 font-medium">Biographie</p>
                                        <p className="text-sm font-semibold text-font-primary-dark italic truncate">
                                            {member.biography ? `"${member.biography}"` : "Aucune biographie renseignée."}
                                        </p>
                                    </div>
                                </div>

                            </div>

                            <p className="text-xs text-font-primary-dark pt-2 leading-relaxed">
                                Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès et de rectification. Le mot de passe chiffré stocké en base est masqué par mesure de sécurité.
                            </p>
                        </>
                    )}
                </div>

                {/* footer */}
                <footer className="p-6 bg-bone/30 dark:bg-black/5 flex justify-end gap-3 border-t border-primary-dark/10 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 font-medium text-font-primary-dark border border-font-primary-dark/20 hover:bg-bone rounded-xl transition-colors"
                    >
                        Fermer
                    </button>
                    <button
                        onClick={onDownload}
                        disabled={isLoading || !data}
                        className="px-5 py-2.5 font-bold text-white rounded-xl transition-colors shadow-lg bg-primary hover:bg-primary-dark shadow-primary/30 flex items-center gap-2 disabled:opacity-50"
                    >
                        <Download className="w-5 h-5" aria-hidden="true" />
                        Exporter en JSON
                    </button>
                </footer>
            </div>
        </div>
    );
}