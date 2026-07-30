// fichier gerant logique & actions de la page des doublons
// WARNING: voir pertinence

// import
import { useState } from "react";

export function useAdminDuplicates() {
    // WARNING: vraies datas a mettre
    const mockDuplicates = [
        { id: 1, title: "Développeur Front-end React", company: "ADEO", source: "WeLoveDevs", confidence: 98, date: "2026-05-12" },
        { id: 2, title: "Développeur Web Fullstack", company: "Elosi", source: "WeLoveDevs", confidence: 85, date: "2026-06-01" },
        { id: 3, title: "Dev React JS", company: "ADEO", source: "CapyCareer", confidence: 92, date: "2026-07-10" },
    ];

    const [duplicates, setDuplicates] = useState(mockDuplicates);
    const [searchQuery, setSearchQuery] = useState("");

    // etat modale
    const [isModalOpen, setIsModalOpen] = useState(false);
    // stocke quelle action ciblé & quel doublon
    const [modalConfig, setModalConfig] = useState({ actionType: null, duplicateId: null });

    // filtrer par titre/entreprise
    const filteredDuplicates = duplicates.filter((dup) =>
        dup.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dup.company.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // en cas de faux positif alors conserve offre
    const requestKeep = (duplicateId) => {
        setModalConfig({ actionType: 'keep', duplicateId });
        setIsModalOpen(true);
    };

    // en cas de doublon alors supprime offre
    const requestDelete = (duplicateId) => {
        setModalConfig({ actionType: 'delete', duplicateId });
        setIsModalOpen(true);
    };

    // execution si confirmation
    const executeAction = () => {
        // peu importe lissu, loffre nest plus affiché à traiter
        setDuplicates(duplicates.filter(dup => dup.id !== modalConfig.duplicateId));
    };

    // return
    return {
        duplicates: filteredDuplicates,
        searchQuery,
        setSearchQuery,
        isModalOpen,
        setIsModalOpen,
        modalConfig,
        requestKeep,
        requestDelete,
        executeAction
    };
}