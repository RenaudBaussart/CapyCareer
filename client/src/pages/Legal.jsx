// fichier gerant la page mentions légales du site

// imports
import { Link } from "react-router-dom";
// component
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
// icones
import { Shield } from "lucide-react";
// img
import Leaves from "../assets/images/Leaves.png";
import BGLeaves from "../assets/images/BackgroundLeavesCream.png";

export default function Legal() {
    return (
        // conteneur principal
        <main
            className="flex flex-col min-h-screen bg-bone text-primary-dark font-sans"
            style={{
                backgroundImage: `url(${Leaves}), url(${BGLeaves})`,
                backgroundRepeat: "no-repeat, repeat",
                backgroundSize: "100%, 100%",
                backgroundPosition: "top, top",
            }}
        >
            <Navbar />

            {/* conteneur pour centrer */}
            <div className="grow flex items-center justify-center p-6 lg:p-12">

                {/* grande card */}
                <div className="w-full max-w-4xl backdrop-blur-2xl bg-white/70 p-8 lg:p-12 shadow-[0_0_15px_rgba(0,0,0,0.15)] rounded-3xl space-y-10">

                    {/* haut de la page */}
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-8 h-8 text-primary" aria-hidden="true" />
                        <h1 className="text-3xl md:text-4xl font-bold text-primary-dark">
                            Mentions Légales
                        </h1>
                    </div>

                    {/* section 1 */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
                            1. Édition du site
                        </h2>
                        <p className="leading-relaxed font-medium">
                            Le site <strong>CapyCareer</strong> est un projet académique réalisé dans le cadre de la formation Web@cadémie par Epitech Lille.
                        </p>
                        <p className="leading-relaxed">
                            Il est édité et développé conjointement par l'équipe projet composée de :<br />
                            <strong>Lohan Lefèvre, Alison Dehaies, Vincent Lesniak, Renaud Baussart, Jonathan Decroix.</strong>
                        </p>
                        <p className="leading-relaxed">
                            Contact de l'équipe : <a href="mailto:cap.career.contact@gmail.com" className="text-primary font-bold hover:text-deep-primary hover:underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">cap.career.contact@gmail.com</a>
                        </p>
                    </section>

                    {/* section 2 */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
                            2. Directeur de la publication
                        </h2>
                        <p className="leading-relaxed">
                            Le poste de directeur de la publication est assuré conjointement par l'ensemble des membres de l'équipe projet CapyCareer citée ci-dessus.
                        </p>
                    </section>

                    {/* section 3 */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
                            3. Hébergement du site
                        </h2>
                        <div className="bg-bone-light/80 p-4 rounded-lg border border-primary-light/20">

                            <p className="leading-relaxed">
                                Le site CapyCareer n'est pas hébergé pour le moment.
                            </p>

                            {/* <p className="leading-relaxed">
                              Le site CapyCareer est hébergé par la société <strong>WARNING : a renseigner</strong>.
                               </p> */}

                            {/* <p className="leading-relaxed mt-2">
                             Adresse : <br />
                              Téléphone :
                              </p> */}
                        </div>
                    </section>

                    {/* section 4 */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
                            4. Propriété intellectuelle
                        </h2>
                        <p className="leading-relaxed">
                            L'ensemble de ce site, y compris les textes, logos (notamment le logo CapyCareer), graphismes, icônes et codes sources, relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle.
                        </p>
                        <p className="leading-relaxed">
                            Toute reproduction, représentation ou diffusion, en tout ou partie, du contenu de ce site sur quelque support ou par quelque procédé que ce soit, est interdite sans l'autorisation expresse de l'équipe projet.
                        </p>
                    </section>

                    {/* WARNING a remplir */}
                    {/* section 5 */}
                    {/* <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
                            5. Protection des données personnelles (RGPD)
                        </h2>
                        <p className="leading-relaxed">
                            Dans le cadre de l'utilisation de nos services, nous sommes amenés à collecter et traiter certaines de vos données personnelles.
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li><strong>Responsable du traitement :</strong> L'équipe projet CapyCareer.</li>
                            <li><strong>Finalité :</strong> La collecte des données a pour but la création de votre compte, la gestion des candidatures et la mise en relation avec les recruteurs.</li>
                            <li><strong>Durée de conservation :</strong> Vos données sont conservées pendant toute la durée de votre inscription, puis supprimées après une période d'inactivité de 2 ans.</li>
                            <li><strong>Vos droits :</strong> Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de portabilité et de suppression de vos données.</li>
                        </ul>
                        <p className="leading-relaxed">
                            Pour exercer ces droits, vous pouvez nous contacter à l'adresse suivante :
                            <a href="mailto:contact@capycareer.com" className="text-primary font-bold hover:text-deep-primary hover:underline transition-colors px-1">contact@capycareer.com</a>.
                        </p>
                    </section> */}

                    {/* section 6 */}
                    {/* <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-deep-primary border-b-2 border-primary-light/30 pb-2">
                            6. Gestion des cookies
                        </h2>
                        <p className="leading-relaxed">
                            Le site CapyCareer utilise des cookies techniques nécessaires au bon fonctionnement du service, notamment pour maintenir votre session de connexion sécurisée.
                        </p>
                        <p className="leading-relaxed">
                            Ces cookies ne sont pas utilisés à des fins publicitaires. Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela pourrait altérer votre expérience utilisateur (par exemple, vous devrez vous reconnecter à chaque visite).
                        </p>
                    </section> */}

                    {/* btn retour */}
                    <div className="pt-6 border-t border-primary-light/30">
                        <Link
                            to="/home"
                            className="inline-flex items-center justify-center font-bold text-primary hover:text-deep-primary hover:underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1"
                        >
                            ← Retour à l'accueil
                        </Link>
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    );
}