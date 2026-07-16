// fichier gerant les conditions générales d'utilisation

// import
import { Link } from "react-router-dom";
// component
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
// icone
import { FileText } from "lucide-react";
// img
import Leaves from "../assets/images/Leaves.png";

export default function Terms() {
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
            <FileText className="w-8 h-8 text-primary" aria-hidden="true" />
            <h1 className="text-3xl md:text-4xl font-bold text-primary-dark">
              Conditions d'utilisation
            </h1>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
              1. Objet
            </h2>
            <p className="leading-relaxed">
              Les présentes Conditions Générales d'Utilisation ont pour objet d'encadrer l'accès et l'utilisation de la plateforme CapyCareer, développée dans le cadre de la formation Web@cadémie par Epitech Lille.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
              2. Accès à la plateforme et Obligations
            </h2>
            <p className="leading-relaxed">
              L'accès aux fonctionnalités de candidature nécessite la création d'un compte. L'utilisateur s'engage à fournir des informations véridiques et à garder ses identifiants confidentiels.
            </p>
            <p className="leading-relaxed">En utilisant CapyCareer, l'utilisateur s'engage à :</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Ne pas utiliser la plateforme à des fins illégales ou frauduleuses.</li>
              <li>Respecter les autres utilisateurs et les entreprises présentes.</li>
              <li>Ne pas tenter de perturber le bon fonctionnement technique du site.</li>
            </ul>
            <p className="leading-relaxed mt-2 italic text-sm">
              L'équipe d'administration se réserve le droit de suspendre ou supprimer le compte de tout utilisateur ne respectant pas ces règles.
            </p>
          </section>


          <div className="pt-6 border-t border-primary-light/30">
            <Link to="/index" className="inline-flex items-center justify-center font-bold text-primary hover:text-deep-primary hover:underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1">
              ← Retour à l'accueil
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}