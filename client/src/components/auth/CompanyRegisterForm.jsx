// fichier du component qui gere validation, accessibilité champs & erreurs (version entreprise)

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerCompanySchema } from "../../schemas/auth.schema";

// navigation
import { Link } from "react-router-dom";

export default function CompanyRegisterForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerCompanySchema),
    });

    const onSubmit = async (data) => {
        // WARNING: connecter a lAPI 
        console.log("Form data entreprise :", data);
    };

    return (
        <div className="w-full max-w-md">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>

                {/* raison sociale */}
                <div>
                    <label
                        className="block text-lg font-bold text-primary-dark mb-1"
                        htmlFor="companyName"
                    >
                        Entreprise *
                    </label>
                    <input
                        className={`w-full px-4 py-2 bg-white border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.companyName ? "border-accent-dark focus:ring-accent-dark" : "border-primary-light focus:ring-primary"}`}
                        id="companyName"
                        type="text"
                        autoComplete="organization"
                        placeholder="Nom de l'entreprise"
                        {...register("companyName")}
                        aria-invalid={errors.companyName ? "true" : "false"}
                        aria-describedby={errors.companyName ? "companyName-error" : undefined}
                    />
                    {errors.companyName && <p id="companyName-error" className="text-accent-dark font-medium text-xs mt-1">{errors.companyName.message}</p>}
                </div>

                {/* siret */}
                <div>
                    <input
                        className={`w-full px-4 py-2 bg-white border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.siret ? "border-accent-dark focus:ring-accent-dark" : "border-primary-light focus:ring-primary"}`}
                        id="siret"
                        type="text"
                        placeholder="Numéro de SIRET (facultatif)"
                        {...register("siret")}
                        aria-invalid={errors.siret ? "true" : "false"}
                        aria-describedby={errors.siret ? "siret-error" : undefined}
                    />
                    {errors.siret && <p id="siret-error" className="text-accent-dark font-medium text-xs mt-1">{errors.siret.message}</p>}
                </div>

                {/* personne de contact */}
                <div>
                    <label
                        className="block text-lg font-bold text-primary-dark mb-1"
                        htmlFor="contactInfos"
                    >
                        Personne de contact *
                    </label>
                    <input
                        className={`w-full px-4 py-2 bg-white border rounded-3xl focus:ring-2 focus:outline-none transition-colors mb-3 ${errors.contactFirstName ? "border-accent-dark focus:ring-accent-dark" : "border-primary-light focus:ring-primary"}`}
                        id="contactFirstName"
                        type="text"
                        autoComplete="given-name"
                        placeholder="Prénom"
                        {...register("contactFirstName")}
                        aria-invalid={errors.contactFirstName ? "true" : "false"}
                        aria-describedby={errors.contactFirstName ? "contactFirstName-error" : undefined}
                    />
                    {errors.contactFirstName && <p id="contactFirstName-error" className="text-accent-dark font-medium text-xs mt-1">{errors.contactFirstName.message}</p>}

                    <input
                        className={`w-full px-4 py-2 bg-white border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.contactLastName ? "border-accent-dark focus:ring-accent-dark" : "border-primary-light focus:ring-primary"}`}
                        id="contactLastName"
                        type="text"
                        autoComplete="family-name"
                        placeholder="Nom"
                        {...register("contactLastName")}
                        aria-invalid={errors.contactLastName ? "true" : "false"}
                        aria-describedby={errors.contactLastName ? "contactLastName-error" : undefined}
                    />
                    {errors.contactLastName && <p id="contactLastName-error" className="text-accent-dark font-medium text-xs mt-1">{errors.contactLastName.message}</p>}
                </div>

                {/* email pro */}
                <div>
                    <input
                        className={`w-full px-4 py-2 bg-white border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.email ? "border-accent-dark focus:ring-accent-dark" : "border-primary-light focus:ring-primary"}`}
                        id="email"
                        type="email"
                        placeholder="Adresse email professionnelle"
                        autoComplete="email"
                        {...register("email")}
                        aria-invalid={errors.email ? "true" : "false"}
                        aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && <p id="email-error" className="text-accent-dark font-medium text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* mdp */}
                <div>
                    <label
                        className="block text-lg font-bold text-primary-dark mb-1"
                        htmlFor="password"
                    >
                        Mot de passe *
                    </label>
                    <input
                        className={`w-full px-4 py-2 bg-white border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.password ? "border-accent-dark focus:ring-accent-dark" : "border-primary-light focus:ring-primary"}`}
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Mot de passe"
                        {...register("password")}
                        aria-invalid={errors.password ? "true" : "false"}
                        aria-describedby={errors.password ? "password-error" : undefined}
                    />
                    {errors.password && <p id="password-error" className="text-accent-dark font-medium text-xs mt-1">{errors.password.message}</p>}
                </div>

                {/* confirmation mdp */}
                <div>
                    <input
                        className={`w-full px-4 py-2 bg-white border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.confirmPassword ? "border-accent-dark focus:ring-accent-dark" : "border-primary-light focus:ring-primary"}`}
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Confirmer votre mot de passe"
                        {...register("confirmPassword")}
                        aria-invalid={errors.confirmPassword ? "true" : "false"}
                        aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                    />
                    {errors.confirmPassword && <p id="confirmPassword-error" className="text-accent-dark font-medium text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-deep-primary text-white font-bold py-3 px-4 rounded-3xl mt-6 hover:bg-primary-dark transition-colors focus:ring-2 focus:ring-primary-dark focus:outline-none disabled:opacity-50"
                >
                    {isSubmitting ? "Inscription..." : "Créer mon espace recruteur"}
                </button>
            </form>

            <Link
                to="/register"
                className="text-primary text-center"
            >
                <p className="mt-5">Retour</p>
            </Link>
        </div>
    );
}