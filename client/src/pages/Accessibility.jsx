// fichier gerant la déclaration d'accessibilité

// import
import { Link } from "react-router-dom";
// components
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
// img
import Leaves from "../assets/images/Leaves.png";

export default function AccessibilityPage() {
  return (
    <main
      className="flex flex-col min-h-screen bg-bone text-primary-dark font-sans"
      style={{
        backgroundImage: `url(${Leaves})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100%",
      }}
    >
      <Navbar />

      <div className="grow flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-4xl backdrop-blur-2xl bg-white/70 p-8 lg:p-12 shadow-[0_0_15px_rgba(0,0,0,0.15)] rounded-3xl space-y-10">
          
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-dark">
              Déclaration d'accessibilité
            </h1>
          </div>

          <section className="space-y-4">
            <p className="leading-relaxed">
              L'équipe de CapyCareer s'engage à rendre son site internet accessible, conformément à l'article 47 de la loi n° 2005-102 du 11 février 2005.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
              État de conformité
            </h2>
            <p className="leading-relaxed">
              Le site CapyCareer vise une conformité totale avec le référentiel général d’amélioration de l’accessibilité (RGAA) version 4.1, niveau AA. Nous apportons un soin particulier aux contrastes de couleurs, à la navigation au clavier (notamment sur nos formulaires d'authentification) et à la structure sémantique de nos pages.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
              Technologies utilisées
            </h2>
            {/* WARNING a mettre à jour */}
            <p className="leading-relaxed">L'accessibilité de CapyCareer s'appuie sur les technologies suivantes :</p>
            <ul className="list-disc list-inside space-y-2 ml-2 font-medium">
              <li>HTML5</li>
              <li>CSS (framework Tailwind CSS)</li>
              <li>JavaScript (bibliothèque ReactJS)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
              Retour d'information et contact
            </h2>
            <p className="leading-relaxed">
              Si vous n'arrivez pas à accéder à un contenu ou à un service de la plateforme, vous pouvez contacter l'équipe projet pour être orienté vers une alternative accessible ou obtenir le contenu sous une autre forme à l'adresse : <a href="mailto:cap.career.contact@gmail.com" className="text-primary font-bold hover:text-deep-primary hover:underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">cap.career.contact@gmail.com</a>
            </p>
          </section>

          <div className="pt-6 border-t border-primary-light/30">
            <Link to="/home" className="inline-flex items-center justify-center font-bold text-primary hover:text-deep-primary hover:underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1">
              ← Retour à l'accueil
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}