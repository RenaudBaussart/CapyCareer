// fichier de la page d'accueil

// import
// component
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import CapyGlasses from "../assets/images/CapyGlasses.png"
// icone
import { Banana , Apple, Citrus } from "lucide-react";
// img
import Leaves from "../assets/images/Leaves.png";

export default function Home() {

    return (
        <main className="flex flex-col min-h-screen bg-bone text-primary-dark font-sans">
            <Navbar />

            {/* section hero */}
            <section
                className="relative px-6 pt-12 pb-16 lg:pt-16 lg:pb-20"
                style={{
                    backgroundImage: `url(${Leaves})`,
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                    {/* texte de présentation */}
                    <div className="text-center backdrop-blur-3xl overflow-hidden rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.15)]">

                        <div className="w-full h-auto p-5 relative bg-primary">
                        <h1 className="text-4xl lg:text-5xl font-bold text-bone mb-4">
                            Bienvenue !
                        </h1>

                        
                        <p className="text-bone/80 mb-2">
                            *Texte de présentation du site*
                        </p>
                        </div>

                        <div className="bg-bone-light p-8">
                        <p className="text-primary-dark/70 mb-6">
                            *Texte autre*
                        </p>

                        {/* fruits qui sautent */}
                        <div className="flex items-center gap-4 justify-center text-3xl">
                                <Apple className="animate-bounce" />
                                <Citrus className="animate-bounce [animation-delay:100ms]" />
                                <Banana className="animate-bounce [animation-delay:200ms]" />
                        </div>
                        </div>
                    </div>

                    {/* dessin capybara */}
                    <div className="flex justify-center ">
                        <div
                            className="w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.15)]"
                            aria-hidden="true"
                        >
                            <img src={CapyGlasses} alt="Capybara avec des lunettes" loading="lazy" />
                        </div>
                    </div>

                </div>
            </section>
            <Footer />
        </main>
    );
}