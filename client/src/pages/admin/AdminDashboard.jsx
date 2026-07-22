// fichier gerant la page du dashboard de ladmin (outils de controle, syncronisation datas n8n)

// import
import { useState, useEffect } from "react";
// component
import AdminNavbar from "../../components/admin/layout/AdminNavbar";
import AdminStatCard from "../../components/admin/AdminStatCard";
import N8nSyncCard from "../../components/admin/N8nSyncCard";
import SearchBar from "../../components/admin/SearchBar";

// icone
import { Users, Briefcase, Copy, Terminal, Building } from "lucide-react";
// navigation
import { Link } from "react-router-dom";

export default function AdminDashboard() {
    // etat pour stocker data
    const [stats, setStats] = useState({
        candidats: "...",
        entreprises: "...",
        // WARNING: fictive pour le moment
        offresActives: 342,
        doublons: 8,
        erreursApi: 3
    });

    // call API lors du chargement component
    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                // recupere token (localStorage ou sessionStorage)
                const token = localStorage.getItem("capy_token") || sessionStorage.getItem("capy_token");

                // call route back pour verifier lautorisation
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats/users`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des statistiques");
                }

                const data = await response.json();

                // maj letat selon les datas renvoyées par le back
                setStats(prevStats => ({
                    ...prevStats,
                    candidats: data.candidats,
                    entreprises: data.entreprises
                }));
            } catch (error) {
                console.error("Erreur lors de la récupération des stats utilisateurs :", error);
            }
        };

        fetchUserStats();
    }, []);

    return (
        <div className="bg-main-layout">
            <AdminNavbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col">

                {/* conteneur principal*/}
                <div className="bg-white/60 backdrop-blur-2xl rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.10)] border border-white/50 p-8 md:p-10 w-full flex-1">

                    {/* haut de page */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-primary-dark">Vue d'ensemble</h1>
                        <p className="text-deep-primary mt-1">Gérez la collecte de données et surveillez l'activité de CapyCareer.</p>
                    </div>

                    {/* controle N8N */}
                    <N8nSyncCard />

                    {/* statistiques */}
                    <section className="mt-10" aria-live="polite">
                        <h2 className="text-xl font-semibold text-deep-primary mb-6">Statistiques Rapides</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">

                            {/* nbr de candidats */}
                            <Link to="/admin/candidat" className="block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl">
                                <AdminStatCard
                                    title="Candidats"
                                    value={stats.candidats}
                                    icon={Users}
                                    trendText="Inscrits sur la plateforme"
                                    trendColor="text-primary-dark"
                                    colorClass="bg-primary/10 text-primary-deep"
                                />
                            </Link>

                            {/* nbr d'entreprises */}
                            <Link to="/admin/entreprise" className="block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl">
                                <AdminStatCard
                                    title="Entreprises"
                                    value={stats.entreprises}
                                    icon={Building}
                                    trendText="Recruteurs actifs"
                                    trendColor="text-primary-dark"
                                    colorClass="bg-primary/10 text-primary-deep"
                                />
                            </Link>

                            {/* nbr d'offres online */}
                            <Link to="/admin/jobs" className="block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl">
                                <AdminStatCard
                                    title="Offres Actives"
                                    value={stats.offresActives}
                                    icon={Briefcase}
                                    trendText="Synchronisées ajd"
                                    trendColor="text-primary-dark"
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
                                    trendColor="text-accent-deep"
                                    colorClass="bg-accent-deep/10 text-accent-deep"
                                />
                            </Link>

                            {/* nbr derreur API */}
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