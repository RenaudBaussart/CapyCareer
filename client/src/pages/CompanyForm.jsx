// fichier de la page formulaire & candidatures entreprise (publication d'offres & suivi des candidatures)

// import
// components
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import MainNavbar from "../components/layout/MainNavbar";
import PostJobForm from "../components/dashboard/PostJobForm";
import CompanyJobsList from "../components/dashboard/CompanyJobsList";
// icone
import { PlusCircle, LayoutList, ArrowLeft } from "lucide-react";
// img
import BGLeaves from "../assets/images/BackgroundLeavesCream.png";
// data
import { COMPANY_JOBS_MOCK } from "../data/companyJobsMock";

const TABS = [
    { id: "post", label: "Publier une offre", Icon: PlusCircle },
    { id: "manage", label: "Mes offres & candidatures", Icon: LayoutList },
];

export default function CompanyForm() {
    const [searchParams, setSearchParams] = useSearchParams();
    // lit l'onglet demandé dans l'URL (ex: /company/dashboard/form?tab=manage), "post" par défaut
    const tabParam = searchParams.get("tab");
    const [activeTab, setActiveTab] = useState(tabParam === "manage" ? "manage" : "post");
    // WARNING: JOBS_MOCK à remplacer par les offres récupérées via l'API une fois branchée
    const [jobs, setJobs] = useState(COMPANY_JOBS_MOCK);

    // change d'onglet et met à jour l'URL en conséquence
    function handleTabChange(tabId) {
        setActiveTab(tabId);
        setSearchParams(tabId === "manage" ? { tab: "manage" } : {});
    }

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
        handleTabChange("manage");
    }

    // WARNING: à remplacer par un appel API (formulaire d'édition à construire)
    function handleEditJob(jobId) {
        
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
        <main className="flex flex-col min-h-screen bg-bone text-font-primary-dark font-sans">
            <MainNavbar />

            <section className="bg-main-layout">
                <div className="w-full p-10">
                    <div className="max-w-7xl mx-auto">
                        {/* en-tête */}
                        <div className="text-center backdrop-blur-3xl overflow-hidden rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.15)] mb-10">
                            <div className="w-full h-auto p-6 sm:p-8 bg-primary">
                                <h1 className="text-3xl sm:text-4xl font-bold text-light">
                                    Espace recruteur
                                </h1>
                                <p className="text-light/80 mt-2 max-w-2xl mx-auto">
                                    Publiez vos offres et suivez les candidatures reçues, le tout au
                                    même endroit.
                                </p>
                            </div>

                        </div>

                        <Link
                            to="/company/dashboard/"
                            className=" mb-5 flex items-center justify-center gap-2 flex-1 font-bold text-sm text-font-primary-dark hover:text-primary"
                        >
                            <ArrowLeft />    Retour
                        </Link>

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
                                    onClick={() => handleTabChange(id)}
                                    className={`flex items-center justify-center gap-2 flex-1 font-bold text-sm py-3 px-5 rounded-3xl border transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${activeTab === id
                                        ? "bg-deep-primary text-white border-deep-primary"
                                        : "bg-bone-light text-font-primary-dark border-primary-light/40 hover:bg-primary-light/10"
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
                </div>
            </section>

            <Footer />
        </main>
    );
}