// fichier gerant la documentation technique API REST
// WARNING A METTRE A JOUR


// import
import { Link } from "react-router-dom";
// component
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
// icones
import { Terminal, Code2, ShieldAlert } from "lucide-react";
// img
import Leaves from "../assets/images/Leaves.png";

export default function ApiDoc() {
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
        {/* grande card */}
        <div className="w-full max-w-4xl backdrop-blur-2xl bg-white/70 p-8 lg:p-12 shadow-[0_0_15px_rgba(0,0,0,0.15)] rounded-3xl space-y-10">
          
          {/* haut de page */}
          <div className="flex items-center gap-3 mb-2">
            <Terminal className="w-8 h-8 text-primary" aria-hidden="true" />
            <h1 className="text-3xl md:text-4xl font-bold text-primary-dark">
              Documentation API
            </h1>
          </div>

          {/* section 1 (introduction) */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
              Introduction
            </h2>
            <p className="leading-relaxed">
              L'API de CapyCareer est une API RESTful construite avec le framework <strong>TypeScript</strong> avec Express. Elle permet l'interaction de notre application frontend (React) avec notre base de données MySQL de manière sécurisée et normalisée.
            </p>
            <div className="bg-bone-light/80 p-4 rounded-xl border border-primary-light/20 space-y-2">
              <p className="text-sm font-medium"><strong>Format d'échange :</strong> JSON uniquement</p>
              <p className="text-sm font-medium"><strong>URL de base :</strong> <code className="bg-white/80 px-1.5 py-0.5 rounded border text-primary-dark font-mono text-xs">https://api.capycareer.com/api/v1</code></p>
            </div>
          </section>

          {/* section 2 (sécurité) */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-accent" /> Authentification & Sécurité
            </h2>
            <p className="leading-relaxed">
              Certaines routes nécessitent que l'utilisateur soit authentifié. Les requêtes sur ces points d'accès doivent inclure un token d'accès JWT dans l'en-tête de la requête HTTP :
            </p>
            <pre className="bg-bone-light p-4 rounded-xl border border-primary-light/20 overflow-x-auto text-xs font-mono text-primary-dark">
              Authorization: Bearer YOUR_ACCESS_TOKEN
            </pre>
          </section>

          {/* section 3 (endpoints table */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
              Endpoints Principaux
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-primary-light/30 text-deep-primary font-bold">
                    <th className="py-2 pr-4">Méthode</th>
                    <th className="py-2 px-4">Endpoint</th>
                    <th className="py-2 px-4">Auth</th>
                    <th className="py-2 pl-4">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-light/10 text-sm">
                  <tr>
                    <td className="py-3 pr-4 font-bold text-primary">POST</td>
                    <td className="py-3 px-4 font-mono">/auth/register</td>
                    <td className="py-3 px-4">Non</td>
                    <td className="py-3 pl-4">Inscription d'un utilisateur</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-bold text-primary">POST</td>
                    <td className="py-3 px-4 font-mono">/auth/login</td>
                    <td className="py-3 px-4">Non</td>
                    <td className="py-3 pl-4">Connexion et génération du Token</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-bold text-deep-primary">GET</td>
                    <td className="py-3 px-4 font-mono">/jobs</td>
                    <td className="py-3 px-4">Non</td>
                    <td className="py-3 pl-4">Récupérer la liste des offres d'emploi</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-bold text-primary">POST</td>
                    <td className="py-3 px-4 font-mono">/jobs</td>
                    <td className="py-3 px-4">Oui (Recruteur)</td>
                    <td className="py-3 pl-4">Publier une nouvelle offre d'emploi</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-bold text-deep-primary">GET</td>
                    <td className="py-3 px-4 font-mono">/companies</td>
                    <td className="py-3 px-4">Non</td>
                    <td className="py-3 pl-4">Récupérer la liste des entreprises</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* section 4 (ex code) */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2 flex items-center gap-2">
              <Code2 className="w-6 h-6" /> Exemple de réponse (GET /companies/1)
            </h2>
            <pre className="bg-bone-light p-4 rounded-xl border border-primary-light/20 overflow-x-auto text-xs font-mono text-primary-dark">
{`{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Castorama",
    "rating": 4,
    "reviewsCount": 1348,
    "openJobs": 12,
    "logoInitial": "C"
  }
}`}
            </pre>
          </section>

          {/* Bouton retour */}
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