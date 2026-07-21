// fichier du component qui gere validation, accessibilité champs & erreurs

// import
// hook gere les formulaire react
import { useForm } from "react-hook-form";
// permet de co react hook form avec la validation zod
import { zodResolver } from "@hookform/resolvers/zod";
// schema zod
import { registerSchema } from "../../schemas/auth.schema";
// icone
import { UserPlus } from "lucide-react";
// navigation
import { Link } from "react-router-dom";
// afficher/masquer mdp
import PasswordInput from "../ui/PasswordInput";

export default function RegisterForm() {
  // initialisation rhf
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    // utilise schema zod pour valider les champs
    resolver: zodResolver(registerSchema),
  });

  // fonction appelée si le form est valide
  const onSubmit = async (data) => {
    // WARNING: connecter a lAPI
    console.log("Form data :", data);
  };

  return (
    <div className="w-full max-w-md">

      {/* inscription simple */}
      <form
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate>

        {/* informations */}
        <div>
          {/* Ce texte sert de titre de section visuel, on peut lui donner id="Userinfos" pour le lier au groupe si besoin */}
          <span className="block text-lg font-bold text-primary-dark mb-1" id="Userinfos">
            Informations *
          </span>
          
          <div className="flex gap-3">
            {/* nom */}
            <div className="w-1/2">
              {/* Label caché visuellement mais lu par les lecteurs d'écran */}
              <label htmlFor="lastName" className="sr-only">Nom</label>
              <input
                className={`w-full px-4 py-2 bg-white border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${
                  errors.lastName 
                    ? "border-2 border-red-600 focus:ring-red-500" 
                    : "border-primary-light focus:ring-primary"
                }`}
                id="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Nom"
                {...register("lastName")}
                aria-invalid={errors.lastName ? "true" : "false"}
                aria-describedby={errors.lastName ? "lastName-error" : undefined}
              />
              {errors.lastName && <p id="lastName-error" className="text-red-700 font-bold text-xs mt-1 ml-2">{errors.lastName.message}</p>}
            </div>

            {/* prénom */}
            <div className="w-1/2">
              {/* Label caché visuellement */}
              <label htmlFor="firstName" className="sr-only">Prénom</label>
              <input
                className={`w-full px-4 py-2 bg-white border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${
                  errors.firstName 
                    ? "border-2 border-red-600 focus:ring-red-500" 
                    : "border-primary-light focus:ring-primary"
                }`}
                id="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="Prénom"
                {...register("firstName")}
                aria-invalid={errors.firstName ? "true" : "false"}
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
              />
              {errors.firstName && <p id="firstName-error" className="text-red-700 font-bold text-xs mt-1 ml-2">{errors.firstName.message}</p>}
            </div>
          </div>
        </div>

      {/* login/id de connexion */}
        <div>
          {/* Label caché visuellement */}
          <label htmlFor="username" className="sr-only">Identifiant de connexion</label>
          <input
            className={`w-full px-4 py-2 bg-white border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${
              errors.username 
                ? "border-2 border-red-600 focus:ring-red-500" 
                : "border-primary-light focus:ring-primary"
            }`}
            id="username"
            type="text"
            placeholder="Identifiant de connexion"
            {...register("username")}
            aria-invalid={errors.username ? "true" : "false"}
            aria-describedby={errors.username ? "username-error" : undefined}
          />
          {errors.username && <p id="username-error" className="text-red-700 font-bold text-xs mt-1 ml-2">{errors.username.message}</p>}
        </div>
        
        {/* email */}
        <div>
          {/* Label caché visuellement */}
          <label htmlFor="email" className="sr-only">Adresse email</label>
          <input
            className={`w-full px-4 py-2 bg-white border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${
              errors.email 
                ? "border-2 border-red-600 focus:ring-red-500" 
                : "border-primary-light focus:ring-primary"
            }`}
            id="email"
            type="email"
            placeholder="Adresse email"
            autoComplete="email"
            {...register("email")}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && <p id="email-error" className="text-red-700 font-bold text-xs mt-1 ml-2">{errors.email.message}</p>}
        </div>

        {/* mdp (Le composant PasswordInput gère déjà son propre label de manière visible) */}
        <div>
          <PasswordInput
            label="Mot de passe *"
            name="password"
            register={register}
            error={errors.password}
            autoComplete="new-password"
          />
        </div>

        {/* confirmation mdp */}
        <div>
          <PasswordInput
            label="Confirmer le mot de passe *"
            name="confirmPassword"
            register={register}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-deep-primary text-white font-bold py-3 px-4 rounded-3xl mt-6 hover:bg-primary-dark transition-colors focus:ring-2 focus:ring-primary-dark focus:outline-none disabled:opacity-50"
        >
          {isSubmitting ? "Inscription..." : "S'inscrire"}
        </button>

        {/* séparateur */}
        <div className="relative flex items-center py-2 mb-6">
          <div className="grow border-t border-primary-light/50"></div>
          <span className="shrink-0 mx-4 text-primary-light text-sm">ou</span>
          <div className="grow border-t border-primary-light/50"></div>
        </div>

        {/* btn co google */}
        <button
          type="button"
          className="w-full mb-6 flex items-center justify-center gap-2 bg-white text-primary-dark border border-primary-light font-semibold py-3 px-4 rounded-3xl transition-colors focus:ring-2 focus:ring-primary focus:outline-none"
          aria-label="S'inscrire avec Google"
        >
          <UserPlus className="w-5 h-5" />
          S'inscrire avec Google
        </button>

        <Link
          to="/register-company"
          className="text-primary text-center block"
        >
          <p>Vous êtes un recruteur ?</p>
        </Link>

      </form>
    </div>
  );
}