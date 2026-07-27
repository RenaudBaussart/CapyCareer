// fichier gerant logique & actions de la page offres admin

// import
import { useState, useEffect } from "react";
import { fetchJobOffers } from "../services/jobs.service";

export function useAdminJobs() {
    // etats principaux
    const [jobs, setJobs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // etats pagination & compteur total
    const [currentPage, setCurrentPage] = useState(0);
    const [isTheEnd, setIsTheEnd] = useState(false);
    const [totalJobsCount, setTotalJobsCount] = useState(0);

    // etats modale & configuration actions
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({ actionType: null, jobId: null });
    const token = localStorage.getItem("token");

    // effet fetch les offres & nbr total selon la page
    useEffect(() => {
        const loadJobs = async () => {
            try {
                setIsLoading(true);

                // recupere les offres de la page courante & total
                const [data, countResponse] = await Promise.all([
                    fetchJobOffers({ page: currentPage }),
                    fetch(`${import.meta.env.VITE_API_URL}/jobs/count`)
                ]);

                const countData = await countResponse.json();

                setJobs(data.job_offers || []);
                setIsTheEnd(data.is_the_end);
                setTotalJobsCount(countData.total);

            } catch (err) {
                console.error("erreur api get jobs:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadJobs();
    }, [currentPage]);

    // filtrer offres (titre ou entreprise)
    const filteredJobs = jobs.filter((job) =>
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // preparer la modale pour supprimer une offre
    const requestDeleteJob = (jobData) => {
        const idToDelete = typeof jobData === 'object' ? jobData.PK_id : jobData;
        setModalConfig({ actionType: 'delete', jobId: idToDelete });
        setIsModalOpen(true);
    };

    // fonction pour editer une offre
    const handleEditJob = (jobId) => {
        console.log("redirection vers la modification de l offre :", jobId);
    };

    // executer l action confirmee dans la modale
    const executeAction = async () => {
        if (modalConfig.actionType === 'delete') {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs/${modalConfig.jobId}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) throw new Error("erreur lors de la suppression de l offre en bdd");

                setJobs(jobs.filter(job => job.PK_id !== modalConfig.jobId));
                setIsModalOpen(false);
            } catch (err) {
                console.error("erreur de suppression:", err);
            }
        }
    };

    // return des datas & fonctions du hook
    return {
        jobs: filteredJobs,
        searchQuery,
        setSearchQuery,
        isModalOpen,
        setIsModalOpen,
        modalConfig,
        requestDeleteJob,
        handleEditJob,
        executeAction,
        isLoading,
        error,
        currentPage,
        setCurrentPage,
        isTheEnd,
        totalJobsCount
    };
}