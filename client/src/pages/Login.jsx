// fichier gerant la page dinscription

// import
// component
import LoginForm from "../components/auth/LoginForm";
import Footer from "../components/layout/Footer";
import MainNavbar from "../components/layout/MainNavbar";
import { Link } from "react-router-dom";
import CapyWriteVideo from "../assets/images/CapyWrite.mp4"

export default function Login() {
    return (
        // conteneur principal
        <main className="bg-main-layout">
            <MainNavbar />

            {/* conteneur principal contenu */}
            <div className="grow flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* colonne gauche (form) */}
                    <section className="order-2 lg:order-1 flex justify-center lg:justify-end lg:pr-12 backdrop-blur-2xl h-full p-5 shadow-[0_0_15px_rgba(0,0,0,0.15)] rounded-3xl">
                        <LoginForm />
                    </section>

                    {/* colonne droite (dessin capybara) */}
                    {/* masqué si format mobile */}
                    <div className="order-1 lg:order-2 flex flex-col items-center text-center backdrop-blur-2xl rounded-3xl overflow-hidden bg-bone-light shadow-[0_0_15px_rgba(0,0,0,0.15)]">
                        <video src={CapyWriteVideo} autoPlay loop muted alt="Capybara qui prend des notes" className="w-full"></video>
                        <div className="  py-10 lg:py-16 px-6" >
                            <div className="max-w-2xl mx-auto text-center ">
                                <h1 className="text-4xl font-bold text-font-primary-dark ">Bienvenue !</h1>
                                <p className="text-font-primary-dark">
                                    Pour commencer, veuillez vous connecter {/* ou vous inscrire via votre compte Google */}.
                                </p>


                                <p className="text-sm text-font-primary-dark">
                                    En cliquant sur l'une des options "Se connecter" ci-dessous, vous comprenez et acceptez les <Link to="#" className="text-accent-deep font-medium hover:underline">Conditions d'utilisation</Link> de CapyCareer. Vous confirmez également avoir pris connaissance de la <Link to="#" className="text-accent-deep font-medium hover:underline">Politique de confidentialité</Link>.
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