// fichier gerant le footer de tout le site

// import
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
// img
import logo from "../../assets/logos/CapySquare.png";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            className="bg-primary-dark text-light-bone py-10 lg:py-16 border-t border-primary">
            <div className="max-w-6xl mx-auto px-6">

                {/* grid globale */}
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

                    {/* colonne 1/4 (marque, intro) */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-light flex items-center gap-2">
                            <img src={logo} alt="Logo CapyCareer" className="h-10 w-auto" />
                            CapyCareer
                        </h2>
                        <p className="text-sm text-light-bone leading-relaxed">
                            Trouvez l'opportunité qui vous correspond vraiment.
                        </p>
                    </div>

                    {/* colonne 2/4 (candidats) */}
                    {/* WARNING: à linké */}
                    <div>
                        <h3 className="text-light-bone font-semibold mb-4">Candidats</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="#" className="hover:text-white transition-colors">Parcourir les offres</Link></li>
                            <li><Link to="/companies" className="hover:text-white transition-colors">Découvrir les entreprises</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">Mon espace personnel</Link></li>
                        </ul>
                    </div>

                    {/* colonne 3/4 (doc projet) */}
                    <div>
                        <h3 className="text-light-bone font-semibold mb-4">+ d'informations</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/about" className="hover:text-white transition-colors">À propos de nous</Link></li>
                            {/* <li><Link to="/api-doc" className="hover:text-white transition-colors">Documentation API</Link></li> */}
                            <li><a href="https://epi-api.welovedevs.com/" target="_blank" rel="noopener noreferrer"
                                className="hover:text-white transition-colors">Partenaire WeLoveDevs</a></li>
                        </ul>
                    </div>

                    {/* colonne 4/4 (contact, reseaux) */}
                    <div>
                        <h3 className="text-light-bone font-semibold mb-4">Suivez-nous</h3>
                        <div className="flex gap-4 mb-6">
                            <a href="https://github.com/RenaudBaussart/CapyCareer" 
                            className="text-sm flex items-center gap-2 hover:text-white transition-colors" aria-label="GitHub">
                               GitHub
                            </a>

                        </div>
                        <a
                            className="text-sm flex items-center gap-2 hover:text-white transition-colors"
                            href="mailto:cap.career.contact@gmail.com">
                            <Mail className="w-4 h-4" />
                            cap.career.contact@gmail.com
                        </a>
                    </div>
                </div>

                {/* séparateur */}
                <div className="border-t border-primary pt-8 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-light-bone">

                    <p>© {currentYear} CapyCareer. Tous droits réservés.</p>

                    {/* liens) */}
                    {/* WARNING a relier (doc a faire) */}
                    <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-light-bone">
                        <li><Link to="/accessibility" className="hover:text-white transition-colors">Accessibilité : conforme (WCAG 2.1 AA)</Link></li>

                        <li><Link to="/privacy" className="hover:text-white transition-colors">Confidentialité & Cookies</Link></li>

                        <li><Link to="/terms" className="hover:text-white transition-colors">Conditions d'utilisation</Link></li>

                        <li><Link to="/legal" className="hover:text-white transition-colors">Mentions légales</Link></li>
                    </ul>
                </div>

            </div>
        </footer>
    );
}