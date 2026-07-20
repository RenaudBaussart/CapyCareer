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

export default function RegisterForm() {
  // initialisation rhf
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    // utilise schema zod poru valider les champs
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

        {/* nom */}
        <div>
          <label
            className="block text-lg font-bold text-primary-dark mb-1"
            htmlFor="Userinfos" >
            Informations *
          </label>
          <input
            className={`w-full px-4 py-2 bg-white border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.lastName ? "border-accent-dark focus:ring-accent-dark" : "border-primary-light focus:ring-primary"}`}
            id="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Nom"
            {...register("lastName")}
            aria-invalid={errors.lastName ? "true" : "false"}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
          />
          {errors.lastName && <p id="lastName-error" className="text-accent-dark font-medium text-xs mt-1">{errors.lastName.message}</p>}
        </div>

        {/* prénom */}
        <div>
          <input
            className={`w-full px-4 py-2 bg-white border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.firstName ? "border-accent-dark focus:ring-accent-dark" : "border-primary-light focus:ring-primary"}`}
            id="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="Prénom"
            {...register("firstName")}
            aria-invalid={errors.firstName ? "true" : "false"}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
          />
          {errors.firstName && <p id="firstName-error" className="text-accent-dark font-medium text-xs mt-1">{errors.firstName.message}</p>}
        </div>

      {/* login/id de connexion */}
        <div>
          <input
            className={`w-full px-4 py-2 bg-white border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.username ? "border-accent-dark focus:ring-accent-dark" : "border-primary-light focus:ring-primary"}`}
            id="username"
            type="text"
            placeholder="Identifiant de connexion"
            {...register("username")}
            aria-invalid={errors.username ? "true" : "false"}
            aria-describedby={errors.username ? "username-error" : undefined}
          />
          {errors.username && <p id="username-error" className="text-accent-dark font-medium text-xs mt-1">{errors.username.message}</p>}
        </div>
        
        {/* email */}
        <div>

          <input
            className={`w-full px-4 py-2 bg-white border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.email ? "border-accent-dark focus:ring-accent-dark" : "border-primary-light focus:ring-primary"}`}
            id="email"
            type="email"
            placeholder="Adresse email"
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
            htmlFor="password" >
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
          className="text-primary text-center"
        >
          <p>Vous êtes un recruteur ?</p>
        </Link>


      </form>
    </div>
  );
}