// fichier gerant la modale de modification d'offre

import { useState, useEffect } from "react";
import { useClickOutside } from "../../../hook/useClickOutside";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function JobEditModal({ isOpen, onClose, onSave, job }) {
    // initialise data
    const [formData, setFormData] = useState({});
    const modalRef = useClickOutside(onClose);

    useEffect(() => {
        if (isOpen && job) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData({
                ...job,
                title: job.title || "",
                company: job.company || "",
                contract_type: job.contract_type || "",
                city: job.city || "",
                url: job.url || "",
                description: job.description || "",
            });
        }
    }, [job, isOpen]);


    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                const pickerLabels = document.querySelectorAll('.ql-picker-label');
                pickerLabels.forEach((label) => {
                    if (!label.getAttribute('aria-label')) {
                        label.setAttribute('aria-label', 'Style de texte');
                    }
                });
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // prev: pour pas ecraser les champs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // bloque effacement React Quill
    const handleDescriptionChange = (value, delta, source) => {
        // maj stat que luser ecrit
        if (source === 'user') {
            setFormData(prev => ({ ...prev, description: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-job-title"
                className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto"
            >
                <h2 id="edit-job-title" className="text-xl font-bold text-font-primary-dark mb-4">Modifier l'offre</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-gray-900">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium mb-1">Titre du poste</label>
                            <input id="title" name="title" value={formData.title || ""} onChange={handleChange} className="w-full border rounded-lg p-2" required />
                        </div>
                        <div>
                            <label htmlFor="company" className="block text-sm font-medium mb-1">Entreprise</label>
                            <input id="company" name="company" value={formData.company || ""} onChange={handleChange} className="w-full border rounded-lg p-2" required />
                        </div>
                        <div>
                            <label htmlFor="contract_type" className="block text-sm font-medium mb-1">Type de contrat</label>
                            <input id="contract_type" name="contract_type" value={formData.contract_type || ""} onChange={handleChange} className="w-full border rounded-lg p-2" />
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium mb-1">Ville</label>
                            <input id="city" name="city" value={formData.city || ""} onChange={handleChange} className="w-full border rounded-lg p-2" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="url" className="block text-sm font-medium mb-1">Lien URL</label>
                        <input id="url" name="url" value={formData.url || ""} onChange={handleChange} className="w-full border rounded-lg p-2" />
                    </div>

                    <div className="flex flex-col">
                        <label id="description-label" className="block text-sm font-medium mb-1">Description de l'offre</label>
                        <div className="h-64 mb-12">
                            <ReactQuill
                                theme="snow"
                                value={formData.description || ""}
                                onChange={handleDescriptionChange}
                                className="h-full"
                                aria-labelledby="description-label"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4 border-t pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Annuler</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    );
}