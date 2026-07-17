// fichier gerant la page de profil admin

// import
import { useState } from "react";
// component
import AdminNavbar from "../../components/admin/layout/AdminNavbar";
// img
import Leaves from "../../assets/images/Leaves.png";
// icone
import { User, Mail, Lock, Save, ShieldCheck } from "lucide-react";

export default function AdminProfile() {
    const [profileData, setProfileData] = useState({
        firstName: "Capy", lastName: "Admin", email: "admin@capycareer.fr", currentPassword: "", newPassword: ""
    });

    const handleChange = (e) => setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e) => { e.preventDefault(); console.log("Maj:", profileData); };

    return (
        <div className="min-h-screen bg-bone text-primary-dark flex flex-col font-sans" style={{ backgroundImage: `url(${Leaves})`, backgroundRepeat: "no-repeat", backgroundSize: "100%" }}>
            <AdminNavbar />
            <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 flex flex-col">
                <div className="bg-white/60 backdrop-blur-2xl rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.10)] border border-white/50 p-8 md:p-10 w-full">

                    <div className="mb-8 flex items-center gap-4 border-b border-primary-dark/10 pb-6">
                        <div className="p-4 bg-primary/10 rounded-full text-primary">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-primary-dark">Mon Profil Admin</h1>
                            <p className="text-deep-primary mt-1">Gérez vos informations personnelles et votre sécurité.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-primary-dark mb-4">Informations</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative"><input type="text" name="firstName" value={profileData.firstName} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-white/60 rounded-xl" /><User className="w-5 h-5 text-primary-dark/40 absolute left-3 top-1/2 -translate-y-1/2" /></div>
                                <div className="relative"><input type="text" name="lastName" value={profileData.lastName} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-white/60 rounded-xl" /><User className="w-5 h-5 text-primary-dark/40 absolute left-3 top-1/2 -translate-y-1/2" /></div>
                            </div>
                            <div className="relative"><input type="email" name="email" value={profileData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-white/60 rounded-xl" /><Mail className="w-5 h-5 text-primary-dark/40 absolute left-3 top-1/2 -translate-y-1/2" /></div>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <button type="submit" className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium flex items-center gap-2 transition-all">
                                <Save className="w-5 h-5" /> Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}