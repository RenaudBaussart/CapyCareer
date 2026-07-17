// fichier gerant logique & actions de la page offres admin

// import
import { useState } from "react";

export function useAdminJobs() {
    // WARNING: vraies datas a mettre
    const mockJobs = [
        { id: 1, title: "Développeur Front-end React", company: "Décalthon", source: "CapyCareer", status: "actif", date: "2026-05-12" },
        { id: 2, title: "Développeur Fullstack Odoo", company: "Eliot", source: "WeLoveDevs", status: "actif", date: "2026-06-01" },
        { id: 3, title: "Expert Data Science", company: "Google", source: "WeLoveDevs", status: "obsolète", date: "2026-07-10" },
    ];

    const [jobs, setJobs] = useState(mockJobs);
    const [searchQuery, setSearchQuery] = useState("");

    // etat modale
    const [isModalOpen, setIsModalOpen] = useState(false);
    // stocke quelle action ciblé & quelle offre
    const [modalConfig, setModalConfig] = useState({ actionType: null, jobId: null });

    // filtrer par titre/entreprise
    const filteredJobs = jobs.filter((job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // prepare modale pour la suppression/masquage
    const requestDeleteJob = (jobId) => {
        setModalConfig({ actionType: 'delete', jobId });
        setIsModalOpen(true);
    };

    // fonction pour editer 
    // WARNING: redirigera plus tard vers form
    const handleEditJob = (jobId) => {
        console.log("Redirection vers la modification de l'offre :", jobId);
    };

    // SI confirmation
    const executeAction = () => {
        if (modalConfig.actionType === 'delete') {
            // ALORs retire du tableau
            setJobs(jobs.filter(job => job.id !== modalConfig.jobId));
        }
    };

    // return
    return {
        jobs: filteredJobs,
        searchQuery,
        setSearchQuery,
        isModalOpen,
        setIsModalOpen,
        modalConfig,
        requestDeleteJob,
        handleEditJob,
        executeAction
    };
}