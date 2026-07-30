// fichier gerant la page de profil candidat

import { useContext } from "react";
import { HandednessContext } from "../../context/HandednessContext";
import { useUserProfile } from "../../hook/useUserProfile";
import MainNavbar from "../../components/layout/MainNavbar";
import ConfirmModal from "../../components/modals/ConfirmModal";
import GdprDataModal from "../../components/ui/GdprDataModal";
import { User, Mail, Save, GraduationCap, Shield, Trash2, FileText } from "lucide-react";

export default function UserProfile() {
    const {
        profileData, handleChange,
        // var delete
        requestAccountDeletion, isDeleteModalOpen, setIsDeleteModalOpen, executeAccountDeletion, isDeleting,
        // var save
        requestSaveProfile, isSaveModalOpen, setIsSaveModalOpen, executeSaveProfile, isSaving,
        // var rgpd
        isGdprModalOpen, setIsGdprModalOpen, requestGdprData, downloadGdprData, gdprData, isLoadingGdpr
    } = useUserProfile();

    const { handedness, setHandedness } = useContext(HandednessContext);

    return (
        <div className="bg-main-layout">
            <MainNavbar />
            <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col">
                <div className="bg-bone dark:bg-bone/60 backdrop-blur-2xl rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.10)] border border-white/50 dark:border-white/10 p-8 md:p-10 w-full">

                    {/* haut de page */}
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-primary-dark/10 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-primary/10 rounded-full text-primary">
                                <GraduationCap className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-font-primary-dark">Espace Candidat</h1>
                                <p className="text-deep-primary mt-1">Mettez en valeur vos compétences et vos projets.</p>
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-full border-2 border-primary-dark/20 text-xl font-bold text-font-primary-dark bg-bone-light/50 dark:bg-bone-light/50">
                            {profileData.firstName ? profileData.firstName.charAt(0) : "C"}{profileData.lastName ? profileData.lastName.charAt(0) : ""}
                        </div>
                    </div>

                    <form onSubmit={requestSaveProfile} className="space-y-8">

                        {/* informations */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-font-primary-dark">Mes informations</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <input type="text" name="firstName" placeholder="Prénom" value={profileData.firstName} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-bone-light/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-font-primary-dark transition-all" />
                                    <User className="w-5 h-5 text-font-primary-dark/40 absolute left-3 top-1/2 -translate-y-1/2" />
                                </div>
                                <div className="relative">
                                    <input type="text" name="lastName" placeholder="Nom" value={profileData.lastName} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-bone-light/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-font-primary-dark transition-all" />
                                    <User className="w-5 h-5 text-font-primary-dark/40 absolute left-3 top-1/2 -translate-y-1/2" />
                                </div>
                                <div className="relative">
                                    <input type="text" name="username" placeholder="Pseudo public" value={profileData.username} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-bone-light/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-font-primary-dark transition-all" />
                                    <User className="w-5 h-5 text-font-primary-dark/40 absolute left-3 top-1/2 -translate-y-1/2" />
                                </div>
                                <div className="relative">
                                    <input type="email" name="email" placeholder="mail@mail.fr" value={profileData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-bone-light/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-font-primary-dark transition-all" />
                                    <Mail className="w-5 h-5 text-font-primary-dark/40 absolute left-3 top-1/2 -translate-y-1/2" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <h2 className="text-lg font-semibold text-font-primary-dark">Présentation</h2>
                            <div className="relative">
                                <textarea name="biography" placeholder="Présentez-vous en quelques mots..." value={profileData.biography} onChange={handleChange} rows="4" className="w-full pl-10 pr-4 py-3 bg-bone-light/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-font-primary-dark transition-all resize-none"></textarea>
                                <FileText className="w-5 h-5 text-font-primary-dark/40 absolute left-3 top-4" />
                            </div>
                        </div>

                        {/* cv & RGPD */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-primary-dark/10">
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-font-primary-dark">RGPD</h3>
                                <button type="button" onClick={requestGdprData} className="inline-flex items-center gap-2 px-5 py-2.5 bg-bone-light/60 border border-blue-200 text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-colors">
                                    <Shield className="w-5 h-5" />
                                    Consulter mes données
                                </button>
                            </div>
                        </div>

                        {/* préférences d'affichage mobile */}
                        <div className="space-y-4 pt-6 border-t border-primary-dark/10">
                            <h2 className="text-lg font-semibold text-font-primary-dark">Préférences d'affichage (mobile)</h2>
                            <p className="text-sm text-font-primary-dark/60">Choisissez la position du menu pour l'adapter à votre main.</p>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setHandedness("left")} className={`flex-1 px-4 py-2.5 rounded-xl font-medium border transition-colors ${handedness === "left" ? "bg-primary text-white border-primary" : "bg-bone-light/50 border-white/60 text-font-primary-dark hover:bg-primary/10"}`}>Gaucher</button>
                                <button type="button" onClick={() => setHandedness("right")} className={`flex-1 px-4 py-2.5 rounded-xl font-medium border transition-colors ${handedness === "right" ? "bg-primary text-white border-primary" : "bg-bone-light/50 border-white/60 text-font-primary-dark hover:bg-primary/10"}`}>Droitier</button>
                            </div>
                        </div>

                        {/* zone dangereuse */}
                        <div className="space-y-4 pt-6 border-t border-primary-dark/10">
                            <h3 className="text-xl font-bold text-red-600">Zone dangereuse</h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button type="button" onClick={requestAccountDeletion} className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-bone-100/80 border border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-200 transition-colors"><Trash2 className="w-5 h-5" /> Suppression définitive</button>
                            </div>
                        </div>

                        {/* btn valider */}
                        <div className="pt-8 flex justify-end">
                            <button type="submit" className="px-8 py-3 bg-deep-primary hover:bg-primary-dark text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/30">
                                <Save className="w-5 h-5" /> Valider mon profil
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* modale delete */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={executeAccountDeletion}
                title="Supprimer définitivement le compte ?"
                message="Attention : Toutes vos données, candidatures et informations seront effacées de nos serveurs. Cette action est totalement irréversible."
                confirmText="Oui, supprimer mon compte"
                cancelText="Annuler"
                isDestructive={true}
                isLoading={isDeleting}
            />

            {/* modale save */}
            <ConfirmModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                onConfirm={executeSaveProfile}
                title="Enregistrer les modifications ?"
                message="Voulez-vous valider et mettre à jour les informations de votre profil public ?"
                confirmText="Oui, enregistrer"
                cancelText="Annuler"
                isDestructive={false}
                isLoading={isSaving}
            />

            {/* modale RGPD */}
            <GdprDataModal
                isOpen={isGdprModalOpen}
                onClose={() => setIsGdprModalOpen(false)}
                onDownload={downloadGdprData}
                data={gdprData}
                isLoading={isLoadingGdpr}
            />
        </div>
    );
}