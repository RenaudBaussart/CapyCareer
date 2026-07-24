// fichier gerant la page du dashboard de l admin (outils de controle, synchronisation datas n8n)

// import
import { useState, useEffect } from "react";
// component
import MainNavbar from "../../components/layout/MainNavbar";
import AdminStatCard from "../../components/admin/AdminStatCard";
import N8nSyncCard from "../../components/admin/N8nSyncCard";
import SearchBar from "../../components/admin/SearchBar";

// icone
import { Users, Briefcase, Copy, Terminal, Building } from "lucide-react";
// navigation
import { Link } from "react-router-dom";

export default function AdminDashboard() {
    // etat pour stocker les donnees des statistiques
    const [stats, setStats] = useState({
        candidats: "...",
        entreprises: "...",
        offresActives: "...",
        // warning : fictif pour le moment
        doublons: 8,
        erreursApi: 3
    });

    // call api lors du chargement du component pour recuperer les stats reelles
    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                // recupere le token d authentification
                const token = localStorage.getItem("capy_token") || sessionStorage.getItem("capy_token");

                // lancement des requetes pour user & nbr offre
                const [usersResponse, jobsResponse] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/admin/stats/users`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    }),
                    fetch(`${import.meta.env.VITE_API_URL}/jobs/count`)
                ]);

                if (!usersResponse.ok || !jobsResponse.ok) {
                    throw new Error("erreur lors de la recuperation des statistiques");
                }

                const usersData = await usersResponse.json();
                const jobsData = await jobsResponse.json();

                // maj de l etat selon les datas renvoyees par le back
                setStats(prevStats => ({
                    ...prevStats,
                    candidats: usersData.candidats,
                    entreprises: usersData.entreprises,
                    offresActives: jobsData.total
                }));
            } catch (error) {
                console.error("erreur lors de la recuperation des stats :", error);
            }
        };

        fetchDashboardStats();
    }, []);

    return (
        <div className="bg-main-layout">
            <MainNavbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col">

                {/* conteneur principal */}
                <div className="bg-bone-light/60 backdrop-blur-2xl rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.10)] border border-white/50 p-8 md:p-10 w-full flex-1">

                    {/* haut de page */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-font-primary-dark">vue d ensemble</h1>
                        <p className="text-deep-primary mt-1">gerez la collecte de donnees et surveillez l activite de capycareer.</p>
                    </div>

                    {/* controle n8n */}
                    <N8nSyncCard />

                    {/* statistiques rapides */}
                    <section className="mt-10" aria-live="polite">
                        <h2 className="text-xl font-semibold text-deep-primary mb-6">statistiques rapides</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">

                            {/* nbr de candidats */}
                            <Link to="/admin/candidat" className="block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl">
                                <AdminStatCard
                                    title="Candidats"
                                    value={stats.candidats}
                                    icon={Users}
                                    trendText="Inscrits sur la plateforme"
                                    trendColor="text-font-primary-dark"
                                    colorClass="bg-primary/10 text-primary-deep"
                                />
                            </Link>

                            {/* nbr d entreprises */}
                            <Link to="/admin/entreprise" className="block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl">
                                <AdminStatCard
                                    title="Entreprises"
                                    value={stats.entreprises}
                                    icon={Building}
                                    trendText="Recruteurs actifs"
                                    trendColor="text-font-primary-dark"
                                    colorClass="bg-primary/10 text-primary-deep"
                                />
                            </Link>

                            {/* nbr d offres actives */}
                            <Link to="/admin/jobs" className="block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl">
                                <AdminStatCard
                                    title="Offres Actives"
                                    value={stats.offresActives}
                                    icon={Briefcase}
                                    trendText="Synchronisees ajd"
                                    trendColor="text-font-primary-dark"
                                    colorClass="bg-accent-deep/10 text-accent-dark"
                                />
                            </Link>

                            {/* offres en doublons */}
                            <Link to="/admin/duplicates" className="block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl">
                                <AdminStatCard
                                    title="Doublons (IA)"
                                    value={stats.doublons}
                                    icon={Copy}
                                    trendText="En attente de validation"
                                    trendColor="text-font-accent-deep"
                                    colorClass="bg-accent-deep/10 text-accent-deep"
                                />
                            </Link>

                            {/* nbr d erreurs api */}
                            <Link to="/admin/logs" className="block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl">
                                <AdminStatCard
                                    title="Erreurs API (48h)"
                                    value={stats.erreursApi}
                                    icon={Terminal}
                                    trendText="Action requise"
                                    trendColor="text-red-800"
                                    colorClass="bg-red-100 text-red-600"
                                />
                            </Link>

                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}