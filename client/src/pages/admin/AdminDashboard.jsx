// fichier gerant la page du dashboard de ladmin (outils de controle, syncronisation datas n8n)

// import
// component
import AdminNavbar from "../../components/admin/layout/AdminNavbar";
import AdminStatCard from "../../components/admin/AdminStatCard";
import N8nSyncCard from "../../components/admin/N8nSyncCard";
// icone
import { Users, Briefcase, Copy, Terminal } from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-bone text-primary-dark flex flex-col font-sans">
            <AdminNavbar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-primary-dark">Vue d'ensemble</h1>
                    <p className="text-deep-primary mt-1">Gérez la collecte de données et surveillez l'activité de CapyCareer.</p>
                </div>

                {/* controle N8N */}
                <N8nSyncCard />

                {/* statistiques */}
                <section>
                    <h2 className="text-lg font-semibold text-deep-primary mb-4">Statistiques Rapides</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                        {/* nbr duser */}
                        <AdminStatCard
                            title="Utilisateurs"
                            value="1,245"
                            icon={Users}
                            trendText="+12 cette semaine"
                            trendColor="text-primary-dark"
                            colorClass="bg-primary/10 text-primary-deep"
                        />

                        {/* nbr d'offres sur le marché */}
                        <AdminStatCard
                            title="Offres Actives"
                            value="342"
                            icon={Briefcase}
                            trendText="Synchronisées ajd"
                            trendColor="text-primary-dark"
                            colorClass="bg-accent-deep/10 text-accent-dark"
                        />

                        {/* offres en doublons */}
                        <AdminStatCard
                            title="Doublons (IA)"
                            value="8"
                            icon={Copy}
                            trendText="En attente de validation"
                            trendColor="text-accent-deep"
                            colorClass="bg-accent-deep/10 text-accent-deep"
                        />


                        {/* nbr derreur API */}
                        <AdminStatCard
                            title="Erreurs API (48h)"
                            value="3"
                            icon={Terminal}
                            trendText="Action requise"
                            trendColor="text-red-800"
                            colorClass="bg-red-100 text-red-600"
                        />

                    </div>
                </section>
            </main>
        </div>
    );
}