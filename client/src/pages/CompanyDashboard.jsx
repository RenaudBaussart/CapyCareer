// fichier du dashboard de l'entreprise

// import
// components
import Footer from "../components/layout/Footer";
import MainNavbar from "../components/layout/MainNavbar";
import { Link } from "react-router-dom";
// icone
import { PlusCircle, LayoutList, Briefcase, Users, Sparkles, XCircle } from "lucide-react";
// img
import BGLeaves from "../assets/images/BackgroundLeavesCream.png";
// data
import { COMPANY_JOBS_MOCK } from "../data/companyJobsMock";

// calcule les indicateurs clés à partir des offres de l'entreprise
function computeStats(jobs) {
    const activeJobs = jobs.filter((job) => job.status === "active");
    const closedJobs = jobs.filter((job) => job.status === "closed");
    const allApplicants = jobs.flatMap((job) => job.applicants);
    const newApplicants = allApplicants.filter((applicant) => applicant.status === "pending");

    return {
        activeCount: activeJobs.length,
        closedCount: closedJobs.length,
        applicantsCount: allApplicants.length,
        newApplicantsCount: newApplicants.length,
    };
}

function StatCard({ icon: Icon, label, value, accent }) {
    return (
        <div className="bg-bone-light rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.08)] border border-primary-light/40 p-5 flex items-center gap-4">
            <div className={`shrink-0 p-3 rounded-2xl ${accent}`}>
                <Icon size={20} aria-hidden="true" />
            </div>
            <div>
                <p className="text-2xl font-bold text-font-primary-dark">{value}</p>
                <p className="text-sm text-font-primary-dark/60">{label}</p>
            </div>
        </div>
    );
}

// liste condensée des offres les plus récentes (aperçu, pas la gestion complète)
function RecentJobRow({ job }) {
    const pendingCount = job.applicants.filter((a) => a.status === "pending").length;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 py-3 border-b border-primary-light/20 last:border-0">
            <div className="min-w-0">
                <p className="font-semibold text-sm text-font-primary-dark truncate">{job.title}</p>
                <p className="text-xs text-font-primary-dark/60">
                    {job.city}, {job.country} · {job.contractType}
                </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${job.status === "active"
                        ? "bg-accent/15 text-accent-dark"
                        : "bg-primary-light/20 text-font-primary-dark/60"
                        }`}
                >
                    {job.status === "active" ? "Active" : "Clôturée"}
                </span>
                <span className="text-xs font-medium text-font-primary-dark/70">
                    {job.applicants.length} candidature{job.applicants.length > 1 ? "s" : ""}
                    {pendingCount > 0 && (
                        <span className="text-accent-dark"> ({pendingCount} nouvelle{pendingCount > 1 ? "s" : ""})</span>
                    )}
                </span>
            </div>
        </div>
    );
}

export default function CompanyDashboard() {
    // WARNING: JOBS_MOCK à remplacer par les offres récupérées via l'API une fois branchée
    const jobs = COMPANY_JOBS_MOCK;
    const stats = computeStats(jobs);
    const recentJobs = jobs.slice(0, 5);

    return (
        <main className="flex flex-col min-h-screen bg-bone text-font-primary-dark font-sans">
            <MainNavbar />

            <section className="bg-main-layout">
                <div className="w-full p-4 sm:p-6 lg:p-10">
                    <div className="max-w-7xl mx-auto">
                        {/* en-tête */}
                        <div className="text-center backdrop-blur-3xl overflow-hidden rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.15)] mb-10">
                            <div className="w-full h-auto p-6 sm:p-8 bg-primary">
                                <h1 className="text-3xl sm:text-4xl font-bold text-light">
                                    Tableau de bord
                                </h1>
                                <p className="text-light/80 mt-2 max-w-2xl mx-auto">
                                    Vue d'ensemble de vos offres et de vos candidatures.
                                </p>
                            </div>
                        </div>

                        {/* indicateurs clés */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <StatCard
                                icon={Briefcase}
                                label="Offres actives"
                                value={stats.activeCount}
                                accent="bg-accent/15 text-accent-dark"
                            />
                            <StatCard
                                icon={Users}
                                label="Candidatures reçues"
                                value={stats.applicantsCount}
                                accent="bg-primary/15 text-font-primary-dark"
                            />
                            <StatCard
                                icon={Sparkles}
                                label="Nouvelles candidatures"
                                value={stats.newApplicantsCount}
                                accent="bg-orange-500/15 text-orange-700"
                            />
                            <StatCard
                                icon={XCircle}
                                label="Offres clôturées"
                                value={stats.closedCount}
                                accent="bg-primary-light/20 text-font-primary-dark/70"
                            />
                        </div>

                        {/* raccourcis */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-8">
                            <Link
                                to="/company/dashboard/form"
                                className="flex items-center justify-center gap-2 flex-1 font-bold text-sm py-3 px-5 rounded-3xl bg-deep-primary text-white hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <PlusCircle size={16} aria-hidden="true" />
                                Publier une offre
                            </Link>
                            <Link
                                to="/company/dashboard/form?tab=manage"
                                className="flex items-center justify-center gap-2 flex-1 font-bold text-sm py-3 px-5 rounded-3xl bg-bone-light text-font-primary-dark border border-primary-light/40 hover:bg-primary-light/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <LayoutList size={16} aria-hidden="true" />
                                Gérer mes offres & candidatures
                            </Link>
                        </div>

                        {/* offres récentes */}
                        <div className="backdrop-blur-2xl bg-bone-light/40 rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.08)] border border-primary-light/40 p-5 sm:p-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-font-primary-dark">Offres récentes</h2>
                                <Link
                                    to="/entreprise/offres?tab=manage"
                                    className="text-sm font-semibold text-primary hover:underline"
                                >
                                    Tout voir
                                </Link>
                            </div>

                            {recentJobs.length > 0 ? (
                                <div>
                                    {recentJobs.map((job) => (
                                        <RecentJobRow key={job.id} job={job} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-font-primary-dark/60 text-center py-6">
                                    Aucune offre publiée pour le moment.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}