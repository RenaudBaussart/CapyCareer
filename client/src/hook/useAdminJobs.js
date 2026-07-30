// fichier gerant logique & actions de la page offres admin

// import
import { useState, useEffect } from "react";
// import { fetchJobOffers, fetchJobOfferDetail } from "../services/jobs.service";

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

    // etats modification offres (value par defaut cas dinputs non contrôlés)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [jobToEdit, setJobToEdit] = useState({
        title: "",
        company: "",
        contract_type: "",
        city: "",
        url: ""
    });

    const token = localStorage.getItem("token");

    // effet fetch les offres & nbr total selon page OU recherche
    useEffect(() => {
        const loadJobs = async () => {
            try {
                setIsLoading(true);

                // passe searchQuery a l'API (cible dans toute la bdd)
                const [data, countResponse] = await Promise.all([
                    fetchJobOffers({ page: currentPage, search: searchQuery }),
                    // count des recherches
                    fetch(`${import.meta.env.VITE_API_URL}/jobs/count${searchQuery ? `?search=${searchQuery}` : ''}`)
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
        // pour eviter une surchage de l'API sur la recherch
        const delaySearch = setTimeout(() => {
            loadJobs();
        }, 300);
        return () => clearTimeout(delaySearch);
    }, [currentPage, searchQuery]);

    // fonction pour editer une offre
    const handleEditJob = (id) => {
        // cherche l'offre directement dans tableau local
        const job = jobs.find(j => j.PK_id === id);

        if (job) {
            // maj state 
            setJobToEdit({
                ...job,
                title: job.title || "",
                company: job.company || "",
                contract_type: job.contract_type || "",
                city: job.city || "",
                url: job.url || "",
                description: job.description || "",

                // set champs save zod
                country: job.country || "France",
                is_remote_job: Boolean(job.remote),
                is_hybride_job: Boolean(job.hybrid),
                salary_min: Number(job.salary_min) || 0,
                salary_max: Number(job.salary_max) || 0,
                currency: job.currency || "EUR"
            });

            // ouvre modale
            setIsEditModalOpen(true);
        }
    };


    // preparer la modale pour supprimer une offre
    const requestDeleteJob = (jobData) => {
        const idToDelete = typeof jobData === 'object' ? jobData.PK_id : jobData;
        setModalConfig({ actionType: 'delete', jobId: idToDelete });
        setIsModalOpen(true);
    };

    // fonction pour envoyer modif en BDD
    const submitEditJob = async (updatedJobData) => {
        try {
            // date format ISO
            const safePublishDate = updatedJobData.publish_date
                ? new Date(updatedJobData.publish_date).toISOString()
                : new Date().toISOString();

            // creation du payload
            const fullPayload = {
                ...jobToEdit,
                ...updatedJobData,

                description: updatedJobData.description || "Cette offre ne possède pas de description détaillée pour le moment.",
                country: updatedJobData.country || "France",
                is_remote_job: Boolean(updatedJobData.is_remote_job),
                is_hybride_job: Boolean(updatedJobData.is_hybride_job),
                user_id: Number(updatedJobData.user_id) || 1,

                publish_date: safePublishDate,
                salary_max: Number(updatedJobData.salary_max) || 0,
                salary_min: Number(updatedJobData.salary_min) || 0,
                currency: updatedJobData.currency || "EUR"
            };

            const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs/${jobToEdit.PK_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(fullPayload)
            });

            if (!response.ok) throw new Error("Erreur lors de la modification de l'offre");

            // maj la liste locale pour un affichage instantané
            setJobs(jobs.map(job =>
                job.PK_id === jobToEdit.PK_id ? { ...job, ...fullPayload } : job
            ));

            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Erreur de modification:", error);
        }
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
        jobs,
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
        totalJobsCount,
        isEditModalOpen,
        setIsEditModalOpen,
        jobToEdit,
        submitEditJob
    };
}