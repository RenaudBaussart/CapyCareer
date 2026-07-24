// fichier gerant la page de profil entreprise (recruteur)

// import
import { useCompanyProfile } from "../../hook/useCompanyProfile";
// component
import MainNavbar from "../../components/layout/MainNavbar";
// icone
import { Building, Mail, Save, FileText } from "lucide-react";

export default function CompanyProfile() {
    const { profileData, handleChange, handleSubmit } = useCompanyProfile();

    return (
        <div className="bg-main-layout">
            <MainNavbar />
            <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col">
                <div className="bg-bone dark:bg-bone/60 backdrop-blur-2xl rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.10)] border border-white/50 dark:border-white/10 p-8 md:p-10 w-full">

                    {/* haut de page */}
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-primary-dark/10 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-primary/10 rounded-full text-primary">
                                <Building className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-font-primary-dark">Espace Entreprise</h1>
                                <p className="text-deep-primary mt-1">Gérez la présentation de votre société et vos contacts.</p>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-full border-2 border-primary-dark/20 text-xl font-bold text-font-primary-dark bg-bone-light/50 dark:bg-bone-light/50">
                            {profileData.companyName ? profileData.companyName.charAt(0).toUpperCase() : "E"}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* informations */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-font-primary-dark">Informations de la société</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <input type="text" name="companyName" placeholder="Nom de l'entreprise (pseudo)" value={profileData.companyName} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-bone-light/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-font-primary-dark transition-all" />
                                    <Building className="w-5 h-5 text-font-primary-dark/40 absolute left-3 top-1/2 -translate-y-1/2" />
                                </div>
                                <div className="relative">
                                    <input type="email" name="email" placeholder="contact@entreprise.fr" value={profileData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-bone-light/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-font-primary-dark transition-all" />
                                    <Mail className="w-5 h-5 text-font-primary-dark/40 absolute left-3 top-1/2 -translate-y-1/2" />
                                </div>
                            </div>
                        </div>

                        {/* description */}
                        <div className="space-y-4 pt-2">
                            <h2 className="text-lg font-semibold text-font-primary-dark">Présentation</h2>
                            <div className="relative">
                                <textarea name="description" placeholder="Décrivez votre entreprise, vos valeurs..." value={profileData.description} onChange={handleChange} rows="4" className="w-full pl-10 pr-4 py-3 bg-bone-light/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-font-primary-dark transition-all resize-none"></textarea>
                                <FileText className="w-5 h-5 text-font-primary-dark/40 absolute left-3 top-4" />
                            </div>
                        </div>

                        {/* btn valider */}
                        <div className="pt-8 flex justify-end">
                            <button type="submit" className="px-8 py-3 bg-deep-primary hover:bg-primary-dark text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/30">
                                <Save className="w-5 h-5" /> Mettre à jour
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}