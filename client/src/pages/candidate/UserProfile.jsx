// fichier gerant la page de profil candidat

// import
// call le hook
import { useUserProfile } from "../../hook/useUserProfile";
// component
import Navbar from "../../components/layout/Navbar";
// img
import Leaves from "../../assets/images/Leaves.png";
// icone
import {
    User, Mail, Save, GraduationCap, Globe,
    Phone, MapPin, Upload, Shield, BellOff, Trash2,
    Cat
} from "lucide-react";

export default function UserProfile() {
    // on recupere la logique depuis le hook
    const {
        profileData,
        handleChange,
        handleSubmit,
        handleCVUpload,
        disableNotifications,
        requestAccountDeletion
    } = useUserProfile();

    return (
        <div
            className="bg-main-layout">
            <Navbar />
            <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col">
                <div className="bg-white/60 backdrop-blur-2xl rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.10)] border border-white/50 p-8 md:p-10 w-full">

                    {/* haut de page */}
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-primary-dark/10 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-primary/10 rounded-full text-primary">
                                <GraduationCap className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-primary-dark">Espace Candidat</h1>
                                <p className="text-deep-primary mt-1">Mettez en valeur vos compétences et vos projets.</p>
                            </div>
                        </div>

                        {/* initiales  user */}
                        <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-full border-2 border-primary-dark/20 text-xl font-bold text-primary-dark bg-white/50">
                            {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* informations */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-primary-dark">Mes informations</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <input type="text" name="firstName" placeholder="Prénom" value={profileData.firstName} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-primary-dark transition-all" />
                                    <User className="w-5 h-5 text-primary-dark/40 absolute left-3 top-1/2 -translate-y-1/2" />
                                </div>
                                <div className="relative">
                                    <input type="text" name="lastName" placeholder="Nom" value={profileData.lastName} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-primary-dark transition-all" />
                                    <User className="w-5 h-5 text-primary-dark/40 absolute left-3 top-1/2 -translate-y-1/2" />
                                </div>
                                <div className="relative">
                                    <input type="email" name="email" placeholder="mail@mail.fr" value={profileData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-primary-dark transition-all" />
                                    <Mail className="w-5 h-5 text-primary-dark/40 absolute left-3 top-1/2 -translate-y-1/2" />
                                </div>
                                <div className="relative">
                                    <input type="tel" name="phone" placeholder="06 06 06 06 06" value={profileData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-primary-dark transition-all" />
                                    <Phone className="w-5 h-5 text-primary-dark/40 absolute left-3 top-1/2 -translate-y-1/2" />
                                </div>
                                <div className="relative md:col-span-2">
                                    <input type="text" name="location" placeholder="Localisation" value={profileData.location} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-primary-dark transition-all" />
                                    <MapPin className="w-5 h-5 text-primary-dark/40 absolute left-3 top-1/2 -translate-y-1/2" />
                                </div>
                            </div>
                        </div>

                        {/* liens reseaux */}
                        <div className="space-y-4 pt-2">
                            <h2 className="text-lg font-semibold text-primary-dark">Liens professionnels</h2>

                            <div className="relative">
                                <input type="text" name="github" placeholder="Lien de votre GitHub" value={profileData.github} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-primary-dark transition-all" />
                                <Cat className="w-5 h-5 text-primary-dark/40 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>

                            <div className="relative">
                                <input type="text" name="portfolio" placeholder="Lien vers votre Portfolio / Projets" value={profileData.portfolio} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-primary-dark transition-all" />
                                <Globe className="w-5 h-5 text-primary-dark/40 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>

                        {/* CV & RGPD */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-primary-dark/10">

                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-primary-dark">CV</h3>
                                <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 border border-primary/20 text-primary font-medium rounded-xl hover:bg-primary/10 transition-colors">
                                    <Upload className="w-5 h-5" />
                                    Importer un CV
                                    {/* evenement onchange input file */}
                                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleCVUpload} />
                                </label>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-primary-dark">RGPD</h3>
                                <button type="button" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 border border-blue-200 text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-colors">
                                    <Shield className="w-5 h-5" />
                                    Consulter mes données
                                </button>
                            </div>

                        </div>

                        {/* -zone suppression */}
                        <div className="space-y-4 pt-6 border-t border-primary-dark/10">
                            <h3 className="text-xl font-bold text-red-600">Zone dangereuse</h3>

                            <div className="flex flex-col sm:flex-row gap-4">

                                <button type="button" onClick={disableNotifications} className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-white/60 border border-red-200 text-red-500 font-medium rounded-xl hover:bg-red-50 transition-colors">
                                    <BellOff className="w-5 h-5" />
                                    Désactivation des notifications
                                </button>
                                <button type="button" onClick={requestAccountDeletion} className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-red-100/80 border border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-200 transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                    Suppression définitive
                                </button>
                            </div>
                        </div>

                        {/* btn valider changement */}
                        <div className="pt-8 flex justify-end">
                            <button type="submit" className="px-8 py-3 bg-deep-primary hover:bg-primary-dark text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/30">
                                <Save className="w-5 h-5" />
                                Valider mon profil
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
}