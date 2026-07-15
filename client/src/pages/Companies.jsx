// fichier gerant la page de presentation des entreprises proposant des offres demploi

// import
// component
import CompanyCard from "../components/companies/CompanyCard";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
// icone
import { Search } from "lucide-react";

// WARNING: fictif pour le moment voir pour proposer nos propres données
const mockCompanies = [
    { id: 1, name: "Castorama", rating: 4, reviewsCount: 1348, openJobs: 12, logoInitial: "C" },
    { id: 2, name: "Décalthon", rating: 4, reviewsCount: 99, openJobs: 5, logoInitial: "D" },
    { id: 3, name: "Boulanger", rating: 4, reviewsCount: 1096, openJobs: 24, logoInitial: "B" },
    { id: 4, name: "Ikea", rating: 4, reviewsCount: 193, openJobs: 8, logoInitial: "I" },
    { id: 5, name: "Amazon", rating: 3, reviewsCount: 1017, openJobs: 42, logoInitial: "A" },
    { id: 6, name: "Lidl", rating: 4, reviewsCount: 15333, openJobs: 156, logoInitial: "L" },
];

export default function Companies() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="min-h-screen bg-bone">
                <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20">

                    {/* section recherche */}
                    <section className="mb-16">
                        <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-8">
                            Trouvez les entreprises qui vous ressemblent
                        </h1>

                        <div className="max-w-3xl">
                            <label htmlFor="company-search" className="block text-sm font-medium text-deep-primary mb-2">
                                Nom de l'entreprise ou intitulé de poste
                            </label>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative grow">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-primary-dark/50" aria-hidden="true" />
                                    </div>
                                    <input
                                        type="text"
                                        id="company-search"
                                        className="block w-full pl-12 pr-4 py-4 border-2 border-primary-light/30 rounded-xl bg-light-bone text-primary-dark focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors"
                                        placeholder="Ex: Développeur Web, Castorama..."
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="bg-deep-primary text-bone font-bold py-4 px-8 rounded-xl hover:bg-deep-primary transition-colors focus:ring-2 focus:ring-primary focus:outline-none whitespace-nowrap"
                                >
                                    Rechercher
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* section avec liste entreprises */}
                    <section>
                        <h2 className="text-2xl font-bold text-primary-dark mb-8">
                            Entreprises les plus recherchées
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* boucle map pour afficher les datas & call component */}
                            {mockCompanies.map((company) => (
                                <CompanyCard key={company.id} company={company} />
                            ))}
                        </div>
                    </section>

                </div>
            </main>
            <Footer />

        </div>
    );
}