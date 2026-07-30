// fichier du component formulaire de publication d'offre (dashboard entreprise)

// import
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema } from "../../schemas/job.schema";
import { Send, Briefcase } from "lucide-react";

const CONTRACT_TYPES = ["CDI", "CDD", "Stage", "Alternance"];

export default function PostJobForm({ onSubmitJob }) {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            contractType: "CDI",
            remote: false,
            hybrid: false,
        },
    });

    // Pour check si le contrat a besoin d'une durée ou non (genre si c'est un CDI, pas de durée définie)
    // eslint-disable-next-line react-hooks/incompatible-library
    const contractType = watch("contractType");
    const showDuration = contractType !== "CDI";

    // fonction appelée si le form est valide
    const onSubmit = async (data) => {
        onSubmitJob?.(data);
        reset();
    };

    return (
        <div className="w-full ">
            <div className="flex items-center gap-2 mb-5">
                <Briefcase size={20} className="text-font-primary-dark" aria-hidden="true" />
                <h2 className="text-xl font-bold text-font-primary-dark">Publier une offre</h2>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* titre du poste */}
                <div>
                    <label
                        className="block text-sm font-bold text-font-primary-dark mb-1"
                        htmlFor="title"
                    >
                        Intitulé du poste *
                    </label>
                    <input
                        className={`w-full px-4 py-2 bg-bone-light border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.title
                            ? "border-accent-dark focus:ring-accent-dark"
                            : "border-primary-light focus:ring-primary"
                            }`}
                        id="title"
                        type="text"
                        placeholder="Ex. Développeur·se Fullstack"
                        {...register("title")}
                        aria-invalid={errors.title ? "true" : "false"}
                        aria-describedby={errors.title ? "title-error" : undefined}
                    />
                    {errors.title && (
                        <p id="title-error" className="text-accent-dark font-medium text-xs mt-1">
                            {errors.title.message}
                        </p>
                    )}
                </div>

                {/* type de contrat */}
                <div>
                    <label
                        className="block text-sm font-bold text-font-primary-dark mb-1"
                        htmlFor="contractType"
                    >
                        Type de contrat *
                    </label>
                    <select
                        className={`w-full px-4 py-2 bg-bone-light border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.contractType
                            ? "border-accent-dark focus:ring-accent-dark"
                            : "border-primary-light focus:ring-primary"
                            }`}
                        id="contractType"
                        {...register("contractType")}
                        aria-invalid={errors.contractType ? "true" : "false"}
                        aria-describedby={errors.contractType ? "contractType-error" : undefined}
                    >
                        {CONTRACT_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    {errors.contractType && (
                        <p id="contractType-error" className="text-accent-dark font-medium text-xs mt-1">
                            {errors.contractType.message}
                        </p>
                    )}
                </div>

                {/* localisation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label
                            className="block text-sm font-bold text-font-primary-dark mb-1"
                            htmlFor="city"
                        >
                            Ville *
                        </label>
                        <input
                            className={`w-full px-4 py-2 bg-bone-light border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.city
                                ? "border-accent-dark focus:ring-accent-dark"
                                : "border-primary-light focus:ring-primary"
                                }`}
                            id="city"
                            type="text"
                            placeholder="Paris"
                            {...register("city")}
                            aria-invalid={errors.city ? "true" : "false"}
                            aria-describedby={errors.city ? "city-error" : undefined}
                        />
                        {errors.city && (
                            <p id="city-error" className="text-accent-dark font-medium text-xs mt-1">
                                {errors.city.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            className="block text-sm font-bold text-font-primary-dark mb-1"
                            htmlFor="country"
                        >
                            Pays *
                        </label>
                        <input
                            className={`w-full px-4 py-2 bg-bone-light border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.country
                                ? "border-accent-dark focus:ring-accent-dark"
                                : "border-primary-light focus:ring-primary"
                                }`}
                            id="country"
                            type="text"
                            placeholder="France"
                            {...register("country")}
                            aria-invalid={errors.country ? "true" : "false"}
                            aria-describedby={errors.country ? "country-error" : undefined}
                        />
                        {errors.country && (
                            <p id="country-error" className="text-accent-dark font-medium text-xs mt-1">
                                {errors.country.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* mode de travail */}
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-sm font-medium text-font-primary-dark cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-primary-light text-primary focus:ring-primary"
                            {...register("remote")}
                        />
                        Télétravail possible
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-font-primary-dark cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-primary-light text-primary focus:ring-primary"
                            {...register("hybrid")}
                        />
                        Hybride
                    </label>
                </div>

                {/* date de début et durée */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label
                            className="block text-sm font-bold text-font-primary-dark mb-1"
                            htmlFor="startDate"
                        >
                            Date de début *
                        </label>
                        <input
                            className={`w-full px-4 py-2 bg-bone-light border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.startDate
                                ? "border-accent-dark focus:ring-accent-dark"
                                : "border-primary-light focus:ring-primary"
                                }`}
                            id="startDate"
                            type="date"
                            {...register("startDate")}
                            aria-invalid={errors.startDate ? "true" : "false"}
                            aria-describedby={errors.startDate ? "startDate-error" : undefined}
                        />
                        {errors.startDate && (
                            <p id="startDate-error" className="text-accent-dark font-medium text-xs mt-1">
                                {errors.startDate.message}
                            </p>
                        )}
                    </div>

                    {showDuration && (
                        <div>
                            <label
                                className="block text-sm font-bold text-font-primary-dark mb-1"
                                htmlFor="duration"
                            >
                                Durée *
                            </label>
                            <input
                                className={`w-full px-4 py-2 bg-bone-light border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.duration
                                    ? "border-accent-dark focus:ring-accent-dark"
                                    : "border-primary-light focus:ring-primary"
                                    }`}
                                id="duration"
                                type="text"
                                placeholder="Ex. 6 mois"
                                {...register("duration")}
                                aria-invalid={errors.duration ? "true" : "false"}
                                aria-describedby={errors.duration ? "duration-error" : undefined}
                            />
                            {errors.duration && (
                                <p id="duration-error" className="text-accent-dark font-medium text-xs mt-1">
                                    {errors.duration.message}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* fourchette de salaire */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label
                            className="block text-sm font-bold text-font-primary-dark mb-1"
                            htmlFor="salaryMin"
                        >
                            Salaire min. (€/an)
                        </label>
                        <input
                            className={`w-full px-4 py-2 bg-bone-light border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.salaryMin
                                ? "border-accent-dark focus:ring-accent-dark"
                                : "border-primary-light focus:ring-primary"
                                }`}
                            id="salaryMin"
                            type="text"
                            inputMode="numeric"
                            placeholder="35000"
                            {...register("salaryMin")}
                            aria-invalid={errors.salaryMin ? "true" : "false"}
                            aria-describedby={errors.salaryMin ? "salaryMin-error" : undefined}
                        />
                        {errors.salaryMin && (
                            <p id="salaryMin-error" className="text-accent-dark font-medium text-xs mt-1">
                                {errors.salaryMin.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            className="block text-sm font-bold text-font-primary-dark mb-1"
                            htmlFor="salaryMax"
                        >
                            Salaire max. (€/an)
                        </label>
                        <input
                            className={`w-full px-4 py-2 bg-bone-light border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.salaryMax
                                ? "border-accent-dark focus:ring-accent-dark"
                                : "border-primary-light focus:ring-primary"
                                }`}
                            id="salaryMax"
                            type="text"
                            inputMode="numeric"
                            placeholder="45000"
                            {...register("salaryMax")}
                            aria-invalid={errors.salaryMax ? "true" : "false"}
                            aria-describedby={errors.salaryMax ? "salaryMax-error" : undefined}
                        />
                        {errors.salaryMax && (
                            <p id="salaryMax-error" className="text-accent-dark font-medium text-xs mt-1">
                                {errors.salaryMax.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* description */}
                <div>
                    <label
                        className="block text-sm font-bold text-font-primary-dark mb-1"
                        htmlFor="description"
                    >
                        Description du poste *
                    </label>
                    <textarea
                        className={`w-full px-4 py-2 bg-bone-light border rounded-2xl focus:ring-2 focus:outline-none transition-colors resize-none ${errors.description
                            ? "border-accent-dark focus:ring-accent-dark"
                            : "border-primary-light focus:ring-primary"
                            }`}
                        id="description"
                        rows={6}
                        placeholder="Décrivez les missions, le profil recherché, les avantages..."
                        {...register("description")}
                        aria-invalid={errors.description ? "true" : "false"}
                        aria-describedby={errors.description ? "description-error" : undefined}
                    />
                    {errors.description && (
                        <p id="description-error" className="text-accent-dark font-medium text-xs mt-1">
                            {errors.description.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-deep-primary text-white font-bold py-3 px-6 rounded-3xl mt-2 hover:bg-primary-dark transition-colors focus:ring-2 focus:ring-primary-dark focus:outline-none disabled:opacity-50"
                >
                    <Send size={16} aria-hidden="true" />
                    {isSubmitting ? "Publication..." : "Publier l'offre"}
                </button>
            </form>
        </div>
    );
}