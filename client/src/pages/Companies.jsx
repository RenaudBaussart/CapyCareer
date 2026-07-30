// fichier gerant la page de presentation des entreprises proposant des offres demploi

// import component
import CompanyCard from "../components/companies/CompanyCard";
import Footer from "../components/layout/Footer";
import MainNavbar from "../components/layout/MainNavbar";

// data bdd
const companiesData = [
    { id: 1, name: "MARGO", openJobs: 86, averageSalary: 66500, logoInitial: "M" },
    { id: 2, name: "VO2 Group", openJobs: 15, averageSalary: 68750, logoInitial: "V" },
    { id: 3, name: "Bigblue", openJobs: 10, averageSalary: 110000, logoInitial: "B" },
    { id: 4, name: "Le Cab by WeLoveDevs", openJobs: 5, averageSalary: 60500, logoInitial: "L" },
    { id: 5, name: "Syntronic", openJobs: 5, averageSalary: 115000, logoInitial: "S" },
    { id: 6, name: "Agicap", openJobs: 5, averageSalary: 42000, logoInitial: "A" },
    { id: 7, name: "WINAMAX", openJobs: 5, averageSalary: 62500, logoInitial: "W" },
    { id: 8, name: "La Boîte Immo", openJobs: 2, averageSalary: 47250, logoInitial: "L" },
    { id: 9, name: "norsys", openJobs: 1, averageSalary: 40000, logoInitial: "N" },
];

export default function Companies() {
    return (
        // conteneur principal
        <main className="bg-main-layout">
            <MainNavbar />

            {/* conteneur card */}
            <div className="grow flex items-center justify-center p-6 lg:p-12">

                {/* grande card */}
                <div className="w-full max-w-5xl backdrop-blur-2xl bg-bone-light/70 p-8 lg:p-12 shadow-[0_0_15px_rgba(0,0,0,0.15)] rounded-3xl">

                    {/* section */}
                    <section>
                        <h1 className="text-3xl md:text-4xl font-bold text-font-primary-dark mb-10 text-center">
                            Entreprises qui recrutent le plus
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {companiesData.map((company) => (
                                <CompanyCard key={company.id} company={company} />
                            ))}
                        </div>
                    </section>

                </div>
            </div>

            <Footer />
        </main>
    );
}