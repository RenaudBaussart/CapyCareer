// fichier de la page d'accueil

// import
// components
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import JobsSection from "../components/home/JobsSection";
// icone
import { Banana, Apple, Citrus } from "lucide-react";
// img
import CapyGlasses from "../assets/images/CapyGlasses.png";
// data
import { fetchJobOffers, fetchJobOfferDetail } from "../services/jobs.service";

export default function Home() {
    return (
        <main className="bg-main-layout">
            <Navbar />

            <section className="relative px-4 sm:px-6 pt-12 pb-16 lg:pt-16 lg:pb-20">
                <div className="max-w-7xl mx-auto">

                    {/* hero */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 justify-center">

                        <div className="text-center backdrop-blur-3xl overflow-hidden rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.15)] flex flex-col">
                            <div className="w-full h-auto p-5 relative bg-primary">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-light mb-4">
                                    Bienvenue sur CapyCareer !
                                </h1>
                            </div>

                            <div className="bg-bone-light p-6 sm:p-8 grow flex flex-col justify-center">
                                <p className="text-font-primary/70 mb-6 text-start">
                                    Explorez des offres adaptées à votre profil, développez votre réseau professionnel
                                    et avancez dans votre carrière à votre rythme. Que vous soyez étudiant,
                                    jeune diplômé ou professionnel confirmé, CapyCareer vous accompagne à
                                    chaque étape de votre parcours.
                                </p>

                                <div className="flex items-center gap-4 justify-center text-3xl">
                                    <Apple className="animate-bounce" aria-hidden="true" />
                                    <Citrus className="animate-bounce [animation-delay:100ms]" aria-hidden="true" />
                                    <Banana className="animate-bounce [animation-delay:200ms]" aria-hidden="true" />
                                </div>
                            </div>
                        </div>

                        <div className="relative hidden lg:block">
                            <img
                                src={CapyGlasses}
                                alt="Capybara portant des lunettes"
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.15)]"
                            />
                        </div>

                    </div>
                    
                    {/* offres récupérées via l'API */}
                    <JobsSection fetchJobOffers={fetchJobOffers} fetchJobOfferDetail={fetchJobOfferDetail} />

                </div>
            </section>

            <Footer />
        </main>
    );
}