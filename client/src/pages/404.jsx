// fichier de la page 404

import Footer from "../components/layout/Footer";
import MainNavbar from "../components/layout/MainNavbar";
import Capy404 from "../assets/images/CappyNotFound2.png";

export default function Home() {
    return (
        <main>
            <MainNavbar />

            <section className="relative flex justify-center overflow-hidden">
                <img
                    src={Capy404}
                    alt="Page non trouvée"
                    className="w-full h-[50vh] sm:h-[60vh] md:h-auto object-cover md:object-contain"
                />

                <div className="absolute top-[12%] sm:top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-4 w-full">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                        ERREUR 404
                    </h1>
                    <h3 className="text-lg sm:text-xl md:text-2xl mt-2">
                        Page non trouvée
                    </h3>
                </div>
            </section>

            <Footer />
        </main>
    );
}