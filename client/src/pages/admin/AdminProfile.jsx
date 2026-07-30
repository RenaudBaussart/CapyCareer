// fichier gerant la page de profil admin

// import
import { useAdminProfile } from "../../hook/useAdminProfile";
// component
import MainNavbar from "../../components/layout/MainNavbar";
import PasswordInput from "../../components/ui/PasswordInput";
// icone
import { User, Mail, Save, ShieldCheck } from "lucide-react";

export default function AdminProfile() {
    const { profileData, handleChange, handleSubmit } = useAdminProfile();

    return (
        <div className="bg-main-layout flex flex-col min-h-screen">
            <MainNavbar />
            <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col">
                <div className="bg-bone-light/60 backdrop-blur-2xl rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.10)] border border-white/50 p-5 sm:p-8 md:p-10 w-full">

                    <div className="mb-8 flex items-center gap-4 border-b border-primary-dark/10 pb-6">
                        <div className="p-4 bg-primary/10 rounded-full text-primary">
                            <ShieldCheck className="w-8 h-8" aria-hidden="true" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-font-primary-dark">Mon Profil Admin</h1>
                            <p className="text-deep-primary mt-1">Gérez vos informations personnelles et votre sécurité.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-font-primary-dark mb-4">Informations</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* ajout des aria-label pour valider l'accessibilite (les placeholders ne suffisent pas) */}
                                <div className="relative">
                                    <input type="text" name="firstName" value={profileData.firstName} onChange={handleChange} placeholder="Prénom" aria-label="Prénom" autoComplete="off" className="w-full pl-10 pr-4 py-2.5 bg-bone-light/50 border border-white/60 rounded-xl text-font-primary-dark" />
                                    <User className="w-5 h-5 text-font-primary-dark/40 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                                </div>

                                <div className="relative">
                                    <input type="text" name="lastName" value={profileData.lastName} onChange={handleChange} placeholder="Nom" aria-label="Nom" autoComplete="off" className="w-full pl-10 pr-4 py-2.5 bg-bone-light/50 border border-white/60 rounded-xl text-font-primary-dark" />
                                    <User className="w-5 h-5 text-font-primary-dark/40 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                                </div>

                                <div className="relative">
                                    <input type="text" name="username" value={profileData.username} onChange={handleChange} placeholder="Pseudo" aria-label="Pseudo" autoComplete="off" className="w-full pl-10 pr-4 py-2.5 bg-bone-light/50 border border-white/60 rounded-xl text-font-primary-dark" />
                                    <User className="w-5 h-5 text-font-primary-dark/40 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                                </div>

                                <div className="relative">
                                    <input type="email" name="email" value={profileData.email} onChange={handleChange} placeholder="Adresse email" aria-label="Adresse email" autoComplete="off" className="w-full pl-10 pr-4 py-2.5 bg-bone-light/50 border border-white/60 rounded-xl text-font-primary-dark" />
                                    <Mail className="w-5 h-5 text-font-primary-dark/40 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                                </div>

                                <div className="md:col-span-2">
                                    <PasswordInput
                                        name="newPassword"
                                        value={profileData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Nouveau mot de passe (laisser vide si inchangé)"
                                        aria-label="Nouveau mot de passe"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <button type="submit" className="w-full sm:w-auto justify-center px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium flex items-center gap-2 transition-all">
                                <Save className="w-5 h-5" aria-hidden="true" /> Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}