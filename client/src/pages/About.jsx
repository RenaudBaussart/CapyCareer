// fichier gerant la page de presentation de lequipe & le projet

// import
import { Link } from "react-router-dom";
// component
import MainNavbar from "../components/layout/MainNavbar";
import Footer from "../components/layout/Footer";
// icones
import { Users, Code } from "lucide-react";

// datas de la squad
const teamMembers = [
    {
        name: "Lohan Lefèvre",
        role: "Développeur Front-end & UI/UX Designer",
        github: "https://github.com/LohanL3F",
        linkedin: "https://www.linkedin.com/in/lohan-lef%C3%A8vre-4946962b4/",
    },
    {
        name: "Alison Dehaies",
        role: "Développeuse Front-end & Accessibilité",
        github: "https://github.com/Meegy-exe",
        linkedin: "https://www.linkedin.com/in/alison-dehaies-dev/",
    },
    {
        name: "Vincent Lesniak",
        role: "Développeur Back-end & Git Master",
        github: "https://github.com/VincentLesniak",
        linkedin: "https://www.linkedin.com/in/vincentlesniak/",
    },
    {
        name: "Renaud Baussart",
        role: "Développeur Back-end & Administrateur Base de Données",
        github: "https://github.com/RenaudBaussart",
        linkedin: "https://www.linkedin.com/in/renaud-baussart/",
    },
    {
        name: "Jonathan Decroix",
        role: "Développeur Back-end",
        github: "https://github.com/jonathandecroix28-max",
        linkedin: "https://www.linkedin.com/in/jonathan-decroix-8534a7397/",
    },
];

export default function About() {
    return (
       <main className="bg-main-layout">
            <MainNavbar />

            <div className="grow flex items-center justify-center p-6 lg:p-12">
                {/* grande card */}
                <div className="w-full max-w-4xl backdrop-blur-2xl bg-bone-light/70 p-8 lg:p-12 shadow-[0_0_15px_rgba(0,0,0,0.15)] rounded-3xl space-y-10">

                    {/* haut de page */}
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="w-8 h-8 text-primary" aria-hidden="true" />
                        <h1 className="text-3xl md:text-4xl font-bold text-font-primary-dark">
                            À propos de nous
                        </h1>
                    </div>

                    {/* section 1 (projet) */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
                            Le Projet CapyCareer
                        </h2>
                        <p className="leading-relaxed">
                            <strong>CapyCareer</strong> est une plateforme inspirée d'Indeed et de France Travail qui regroupe des offres d'emploi et de stage provenant de différentes sources, dont WeLoveDevs.
                        </p>
                        <p className="leading-relaxed">
                            Conçu comme une véritable application, <strong>CapyCareer</strong> offre une recherche d'emploi fluide et intègre des fonctionnalités de traitement de données et d'intelligence artificielle pour aider les candidats dans leur recherche.
                        </p>
                        <p className="leading-relaxed text-sm italic text-font-primary-dark/80">
                            Projet académique réalisé en équipe dans le cadre de la formation Web@cadémie d'Epitech Lille.
                        </p>
                    </section>

                    {/* section 2 (equipe) */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
                            L'Équipe de Développement
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {teamMembers.map((member, index) => (
                                <div key={index} className="bg-bone-light/80 p-5 rounded-2xl border border-primary-light/20 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-font-primary-dark">{member.name}</h3>
                                        <p className="text-sm text-primary font-medium mt-1">{member.role}</p>
                                    </div>

                                    {/* partie liens */}
                                    <div className="flex gap-4 mt-4 pt-4 border-t border-primary-light/10">
                                        <a
                                            href={member.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded px-1.5 py-0.5 outline-none"
                                        >
                                            GitHub
                                        </a>
                                        <a
                                            href={member.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded px-1.5 py-0.5 outline-none"
                                        >
                                            LinkedIn
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* section 3 (stack tech) */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2 flex items-center gap-2">
                            <Code className="w-6 h-6" /> Notre Stack Technique
                        </h2>
                        <p className="leading-relaxed">
                            Les principales technologies utilisées pour développer <strong>CapyCareer</strong> sont les suivantes :
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {["ReactJS", "Vite", "Tailwind CSS", "MySQL", "Docker", "Git"].map((tech) => (
                                <span key={tech} className="bg-primary/10 text-deep-primary font-bold px-3 py-1 rounded-full text-sm border border-primary/20">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* btn retour */}
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