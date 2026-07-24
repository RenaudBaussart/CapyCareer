// fichier gerant la page de connexion pour espace entreprise

import CompanyRegisterForm from "../../components/auth/CompanyRegisterForm";
import Footer from "../../components/layout/Footer";
import MainNavbar from "../../components/layout/MainNavbar";
import { Link } from "react-router-dom";

export default function CompanyRegister() {
    return (
        <main className="bg-main-layout">
            <MainNavbar />

            <div className="grow flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* colonne gauche (form) */}
                    <section className="order-2 lg:order-1 flex justify-center lg:justify-end lg:pr-12 backdrop-blur-2xl h-full p-5 shadow-[0_0_15px_rgba(0,0,0,0.15)] rounded-3xl">
                        <CompanyRegisterForm />
                    </section>

                    {/* colonne droite */}
                    <div className="order-1 lg:order-2 flex flex-col items-center text-center backdrop-blur-2xl rounded-3xl overflow-hidden bg-bone shadow-[0_0_15px_rgba(0,0,0,0.15)]">
                        <div className="py-10 lg:py-16 px-6">
                            <div className="max-w-2xl mx-auto text-center">
                                <h1 className="text-4xl font-bold text-font-primary-dark">Recrutez avec CapyCareer</h1>
                                <p className="text-font-primary-dark">
                                    Créez votre espace recruteur pour publier vos offres d'emploi et suivre vos candidatures en un seul endroit.
                                </p>

                                <p className="text-sm text-font-primary-dark mt-4">
                                    En cliquant sur "Créer mon espace recruteur", vous comprenez et acceptez les{" "}
                                    <Link to="#" className="text-accent-deep font-medium hover:underline">Conditions d'utilisation</Link> de CapyCareer. Vous confirmez également avoir pris connaissance de la{" "}
                                    <Link to="#" className="text-accent-deep font-medium hover:underline">Politique de confidentialité</Link>.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    );
}