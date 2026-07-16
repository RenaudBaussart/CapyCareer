// fichier gerant la politique de confidentialité

import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Lock } from "lucide-react";
import Leaves from "../assets/images/Leaves.png";

export default function Privacy() {
  return (
    <main
      className="flex flex-col min-h-screen bg-bone text-primary-dark font-sans"
      style={{
        backgroundImage: `url(${Leaves})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />

      <div className="grow flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-4xl backdrop-blur-2xl bg-white/70 p-8 lg:p-12 shadow-[0_0_15px_rgba(0,0,0,0.15)] rounded-3xl space-y-10">
          
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-8 h-8 text-primary" aria-hidden="true" />
            <h1 className="text-3xl md:text-4xl font-bold text-primary-dark">
              Politique de Confidentialité
            </h1>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
              1. Collecte et protection de vos données
            </h2>
            <p className="leading-relaxed">
              Dans le cadre de l'utilisation de CapyCareer, l'équipe projet (<strong>Lohan Lefèvre, Alison Dehaies, Vincent Lesniak, Renaud Baussart, Jonathan Decroix</strong>) est amenée à collecter certaines de vos données personnelles (nom, adresse e-mail, informations professionnelles).
            </p>
            <p className="leading-relaxed">Ces données sont collectées dans le but exclusif de :</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Créer et gérer votre compte utilisateur.</li>
              <li>Vous permettre de consulter et de postuler aux offres d'emploi.</li>
              <li>Assurer le bon fonctionnement et la sécurité de la plateforme.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
              2. Partage des données
            </h2>
            <p className="leading-relaxed">
              Vos données personnelles ne sont jamais vendues à des tiers. Elles sont uniquement accessibles à l'équipe de développement à des fins de maintenance, et aux recruteurs lorsque vous décidez activement de postuler à une de leurs annonces.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
              3. Conservation & Droits (RGPD)
            </h2>
            <p className="leading-relaxed">
              Vos informations sont conservées tant que votre compte reste actif. En cas d'inactivité prolongée (supérieure à 2 ans) ou sur simple demande, vos données seront effacées de nos bases.
            </p>
            <p className="leading-relaxed">
              Vous disposez d'un droit d'accès, de modification, de portabilité et de suppression de vos données personnelles. Pour toute demande, contactez-nous à : <a href="mailto:cap.career.contact@gmail.com" className="text-primary font-bold hover:text-deep-primary hover:underline transition-colors px-1">cap.career.contact@gmail.com</a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
              4. Gestion des Cookies
            </h2>
            <p className="leading-relaxed">
              CapyCareer utilise uniquement des cookies strictement nécessaires au fonctionnement technique du site (maintien de session sécurisée). Nous n'utilisons aucun cookie de traçage publicitaire ou de profilage à des fins commerciales.
            </p>
          </section>

          <div className="pt-6 border-t border-primary-light/30">
            <Link to="/" className="inline-flex items-center justify-center font-bold text-primary hover:text-deep-primary hover:underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1">
              ← Retour à l'accueil
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}