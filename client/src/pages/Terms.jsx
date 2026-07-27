// import
import { Link } from "react-router-dom";
// component
import MainNavbar from "../components/layout/MainNavbar";
import Footer from "../components/layout/Footer";
// icone
import { FileText } from "lucide-react";

export default function Terms() {
  return (
    <main className="bg-main-layout flex flex-col min-h-screen">
      <MainNavbar />

      <div className="grow flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-4xl backdrop-blur-2xl bg-bone-light/70 p-8 lg:p-12 shadow-[0_0_15px_rgba(0,0,0,0.15)] rounded-3xl space-y-10">

          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-primary" aria-hidden="true" />
            <h1 className="text-3xl md:text-4xl font-bold text-font-primary-dark">
              Conditions Générales d'Utilisation
            </h1>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
              1. Objet et cadre du projet
            </h2>
            <p className="leading-relaxed">
              Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet d'encadrer l'accès et l'utilisation de la plateforme <strong>CapyCareer</strong>. Il s'agit d'un projet d'agrégation d'offres d'emploi développé dans le cadre de la formation Web@cadémie par Epitech Lille.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
              2. Accès aux services et obligations de l'utilisateur
            </h2>
            <p className="leading-relaxed">
              L'accès à la recherche d'offres est ouvert à tous. La sauvegarde d'offres et la gestion de profil nécessitent la création d'un compte. L'utilisateur s'engage à fournir des informations exactes et à préserver la confidentialité de ses identifiants.
            </p>
            <p className="leading-relaxed">En utilisant CapyCareer, l'utilisateur s'engage à :</p>
            <ul className="list-disc list-inside space-y-2 ml-2 font-medium">
              <li>Ne pas utiliser la plateforme à des fins illégales ou frauduleuses.</li>
              <li>Respecter la courtoisie et la véracité des informations dans son profil.</li>
              <li>Ne pas tenter de perturber le fonctionnement technique ou d'extraire de manière massive des données du site.</li>
            </ul>
            <p className="leading-relaxed text-sm italic text-font-primary-dark/70">
              L'équipe d'administration se réserve le droit de suspendre ou supprimer tout compte ne respectant pas ces règles.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
              3. Origine des offres et liens externes
            </h2>
            <p className="leading-relaxed">
              CapyCareer est un agrégateur : certaines offres publiées proviennent d'API externes et de plateformes partenaires (notamment WeLoveDevs). 
            </p>
            <p className="leading-relaxed">
              CapyCareer ne saurait être tenu responsable du contenu, de la disponibilité ou de la modification des offres gérées directement par ces services tierces.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
              4. Limite de responsabilité
            </h2>
            <p className="leading-relaxed">
              La plateforme est fournie en l'état dans le cadre d'un projet d'évaluation académique. L'équipe s'efforce de maintenir le service accessible et sécurisé, mais ne garantit pas une disponibilité ininterrompue ni l'aboutissement systématique des candidatures envoyées auprès des recruteurs.
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