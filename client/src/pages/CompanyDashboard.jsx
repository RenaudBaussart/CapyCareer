// fichier de la page dashboard entreprise (publication d'offres & suivi des candidatures)

// import
// components
import { useState } from "react";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import PostJobForm from "../components/dashboard/PostJobForm";
import CompanyJobsList from "../components/dashboard/CompanyJobsList";
// icone
import { PlusCircle, LayoutList } from "lucide-react";
// img
import Leaves from "../assets/images/Leaves.png";
import BGLeaves from "../assets/images/BackgroundLeavesCream.png";
// data
import { COMPANY_JOBS_MOCK } from "../data/companyJobsMock";

const TABS = [
    { id: "post", label: "Publier une offre", Icon: PlusCircle },
    { id: "manage", label: "Mes offres & candidatures", Icon: LayoutList },
];

export default function CompanyDashboard() {
    const [activeTab, setActiveTab] = useState("post");
    // WARNING: JOBS_MOCK à remplacer par les offres récupérées via l'API une fois branchée
    const [jobs, setJobs] = useState(COMPANY_JOBS_MOCK);

    // ajoute une nouvelle offre publiée depuis le formulaire
    function handleCreateJob(data) {
        const newJob = {
            id: `job-${Date.now()}`,
            title: data.title,
            contractType: data.contractType,
            city: data.city,
            country: data.country,
            remote: data.remote,
            hybrid: data.hybrid,
            salaryMin: data.salaryMin ? Number(data.salaryMin) : null,
            salaryMax: data.salaryMax ? Number(data.salaryMax) : null,
            currency: "EUR",
            description: data.description,
            status: "active",
            createdAt: new Date().toISOString().slice(0, 10),
            applicants: [],
        };
        setJobs((prev) => [newJob, ...prev]);
        setActiveTab("manage");
    }

    // WARNING: à remplacer par un appel API (formulaire d'édition à construire)
    function handleEditJob(jobId) {
        console.log("Modifier l'offre :", jobId);
    }

    function handleDeleteJob(jobId) {
        setJobs((prev) => prev.filter((job) => job.id !== jobId));
    }

    function handleToggleJobStatus(jobId) {
        setJobs((prev) =>
            prev.map((job) =>
                job.id === jobId
                    ? { ...job, status: job.status === "active" ? "closed" : "active" }
                    : job
            )
        );
    }

    function handleUpdateApplicantStatus(jobId, applicantId, status) {
        setJobs((prev) =>
            prev.map((job) =>
                job.id !== jobId
                    ? job
                    : {
                        ...job,
                        applicants: job.applicants.map((applicant) =>
                            applicant.id === applicantId ? { ...applicant, status } : applicant
                        ),
                    }
            )
        );
    }

    return (
        <main className="flex flex-col min-h-screen bg-bone text-primary-dark font-sans">
            <Navbar />

            <section
                className="relative px-4 sm:px-6 pt-12 pb-16 lg:pt-16 lg:pb-20"
                style={{
                    backgroundImage: `url(${Leaves}), url(${BGLeaves})`,
                    backgroundRepeat: "no-repeat, repeat",
                    backgroundSize: "100%, 100%",
                    backgroundPosition: "top, top",
                }}
            >
                <div className="max-w-7xl mx-auto">
                    {/* en-tête */}
                    <div className="text-center backdrop-blur-3xl overflow-hidden rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.15)] mb-10">
                        <div className="w-full h-auto p-6 sm:p-8 bg-primary">
                            <h1 className="text-3xl sm:text-4xl font-bold text-bone">
                                Espace recruteur
                            </h1>
                            <p className="text-bone/80 mt-2 max-w-2xl mx-auto">
                                Publiez vos offres et suivez les candidatures reçues, le tout au
                                même endroit.
                            </p>
                        </div>
                    </div>

                    {/* onglets */}
                    <div
                        role="tablist"
                        aria-label="Sections du dashboard entreprise"
                        className="flex flex-col sm:flex-row gap-3 mb-8"
                    >
                        {TABS.map(({ id, label, Icon }) => (
                            <button
                                key={id}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === id}
                                onClick={() => setActiveTab(id)}
                                className={`flex items-center justify-center gap-2 flex-1 font-bold text-sm py-3 px-5 rounded-3xl border transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${activeTab === id
                                    ? "bg-deep-primary text-white border-deep-primary"
                                    : "bg-bone-light text-primary-dark border-primary-light/40 hover:bg-primary-light/10"
                                    }`}
                            >
                                <Icon size={16} aria-hidden="true" />
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* contenu de l'onglet actif */}
                    <div className="backdrop-blur-2xl bg-bone-light/40 rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.08)] border border-primary-light/40 p-5 sm:p-8">
                        {activeTab === "post" ? (
                            <PostJobForm onSubmitJob={handleCreateJob} />
                        ) : (
                            <CompanyJobsList
                                jobs={jobs}
                                onEditJob={handleEditJob}
                                onDeleteJob={handleDeleteJob}
                                onToggleJobStatus={handleToggleJobStatus}
                                onUpdateApplicantStatus={handleUpdateApplicantStatus}
                            />
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}