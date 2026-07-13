// fichier gerant la page dinscription

// import
// component
import LoginForm from "../components/auth/LoginForm";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

export default function Login() {
    return (
        // conteneur principal
        <main className="flex flex-col min-h-screen">
            <Navbar />

            {/* conteneur principal contenu */}
            <div className="grow flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* colonne gauche (form) */}
                    <section className="flex justify-center lg:justify-end lg:pr-12">
                        <LoginForm />
                    </section>

                    {/* colonne droite (dessin capybara) */}
                    {/* masqué si format mobile */}
                    <section
                        className="flex-col items-center justify-center relative w-full hidden lg:flex max-w-md aspect-square bg-white/60 rounded-2xl border-2 border-dashed border-primary-light shadow-sm"
                        aria-hidden="true"
                    >
                        {/* WARNING: emplacement pour feuilles */}
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 text-primary">
                            [Emplacement Feuilles]
                        </div>

                        {/* WARNING: emplacement capybarra lunettes */}
                        <div className="text-center text-accent">
                            <span className="block text-5xl mb-4">🦦</span>
                            <p className="font-semibold">Emplacement :</p>
                            <p className="text-sm italic">Dessin capybara</p>
                        </div>
                    </section>

                </div>
            </div>

            <Footer />
        </main>
    );
}