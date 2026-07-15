import RegisterForm from "../components/auth/RegisterForm";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { Link } from "react-router-dom";
import CapyWrite from "../assets/images/CapyWriteSmoother.gif"
import Leaves from "../assets/images/Leaves.png"

export default function Register() {
  return (
    <main
      className="flex flex-col min-h-screen bg-bone text-primary-dark font-sans"
      style={{
        backgroundImage: `url(${Leaves})`,
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar />

      {/* conteneur principal contenu */}
      <div className="grow flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">


          {/* colonne gauche (form) */}
          <section className="order-2 lg:order-1 flex justify-center lg:justify-end lg:pr-12 backdrop-blur-2xl h-full p-5 shadow-[0_0_15px_rgba(0,0,0,0.15)] rounded-3xl">
            <RegisterForm />
          </section>

          {/* colonne droite (dessin capybara) */}
          <div className="order-1 lg:order-2 flex flex-col items-center text-center backdrop-blur-2xl rounded-3xl overflow-hidden bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)]">
            <img src={CapyWrite} alt="Capybara qui prend des notes" className="w-full" />
            <div className="  py-10 lg:py-16 px-6" >
              <div className="max-w-2xl mx-auto text-center ">
                <h1 className="text-4xl font-bold text-primary-dark ">Bienvenue !</h1>
                <p className="text-primary-dark">
                  Pour commencer votre inscription, veuillez renseigner vos informations ou vous inscrire via votre compte Google.
                </p>


                <p className="text-sm text-primary-dark">
                  En cliquant sur l'une des options "S'inscrire" ci-dessous, vous comprenez et acceptez les <Link to="#" className="text-accent-deep font-medium hover:underline">Conditions d'utilisation</Link> de CapyCareer. Vous confirmez également avoir pris connaissance de la <Link to="#" className="text-accent-deep font-medium hover:underline">Politique de confidentialité</Link>.
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