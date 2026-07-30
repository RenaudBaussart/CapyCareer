// fichier gerant la politique de confidentialité

import { Link } from "react-router-dom";
import MainNavbar from "../components/layout/MainNavbar";
import Footer from "../components/layout/Footer";
import { Lock } from "lucide-react";

export default function Privacy() {
  return (
    <main className="bg-main-layout flex flex-col min-h-screen">
      <MainNavbar />

      <div className="grow flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-4xl backdrop-blur-2xl bg-bone-light/70 p-8 lg:p-12 shadow-[0_0_15px_rgba(0,0,0,0.15)] rounded-3xl space-y-10">

          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-8 h-8 text-primary" aria-hidden="true" />
            <h1 className="text-3xl md:text-4xl font-bold text-font-primary-dark">
              Politique de Confidentialité
            </h1>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
              1. Collecte et protection de vos données
            </h2>
            <p className="leading-relaxed">
              Dans le cadre de l'utilisation de CapyCareer, l'équipe projet (<strong>Lohan Lefèvre, Alison Dehaies, Vincent Lesniak, Renaud Baussart, Jonathan Decroix</strong>) est amenée à collecter certaines de vos données personnelles (nom, prénom, nom d'utilisateur, adresse e-mail, biographie, lien d'avatar).
            </p>
            <p className="leading-relaxed">Ces données sont collectées dans le but exclusif de :</p>
            <ul className="list-disc list-inside space-y-2 ml-2 font-medium">
              <li>Créer et gérer votre compte utilisateur.</li>
              <li>Vous permettre de consulter et de postuler aux offres d'emploi.</li>
              <li>Personnaliser votre expérience et vos recommandations sur la plateforme.</li>
              <li>Assurer le bon fonctionnement et la sécurité du service.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
              2. Partage des données
            </h2>
            <p className="leading-relaxed">
              Vos données personnelles ne sont jamais vendues ni cédées à des tiers. Elles sont uniquement accessibles à l'équipe de développement à des fins de maintenance et d'amélioration du service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
              3. Conservation & Droits (RGPD)
            </h2>
            <p className="leading-relaxed">
              Vos informations sont conservées tant que votre compte reste actif.
            </p>
            <p className="leading-relaxed">
              Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de portabilité et de suppression de vos données personnelles. Vous pouvez à tout moment :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2 font-medium">
              <li>Consulter l'ensemble des données stockées sur votre compte directement depuis votre <strong>Espace Candidat</strong> (section RGPD).</li>
              <li>Télécharger une copie intégrale de vos données au format structuré (JSON).</li>
              <li>Procéder à la suppression définitive de votre compte et de toutes vos informations rattachées.</li>
            </ul>
            <p className="leading-relaxed pt-2">
              Pour toute question ou demande spécifique, vous pouvez également nous contacter à : <a href="mailto:cap.career.contact@gmail.com" className="text-primary font-bold hover:text-deep-primary hover:underline transition-colors px-1 rounded focus-visible:ring-2 focus-visible:ring-primary outline-none">cap.career.contact@gmail.com</a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
              4. Gestion des Cookies
            </h2>
            <p className="leading-relaxed">
              CapyCareer utilise uniquement des jetons d'authentification et des cookies strictement nécessaires au fonctionnement technique du site (maintien de session sécurisée). Nous n'utilisons aucun cookie de traçage publicitaire ou de profilage à des fins commerciales.
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