// fichier du component qui gere validation, accessibilité champs & erreurs

// import
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContextObject";
// hook gere les formulaire react
import { useForm } from "react-hook-form";
// permet de co react hook form avec la validation zod
import { zodResolver } from "@hookform/resolvers/zod";
// schema zod
import { registerSchema } from "../../schemas/auth.schema";
// icone
// import { UserPlus } from "lucide-react";
// navigation
import { Link, useNavigate } from "react-router-dom";
// afficher/masquer mdp
import PasswordInput from "../ui/PasswordInput";
// communication API & gestion des erreurs
import { registerUser } from "../../services/auth.service";
import { getFriendlyErrorMessage } from "../../utils/errorHandler";

export default function RegisterForm() {
  // recupere fonction login du contexte pour se co apres l inscription
  const { login: contextLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  // etat pour gerer les erreurs renvoyees par API
  const [apiError, setApiError] = useState("");

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
    // reset des erreurs api avant chaque tentative
    setApiError("");

    try {

      const registerData = {
        username: data.username,
        email: data.email,
        password: data.password,
        firstname: data.firstName,
        lastname: data.lastName,
        role: "candidat"
      };

      // call service externe register
      const result = await registerUser(registerData);

      // SI back return bien token à l'inscription
      if (result && result.token) {

        // co luser avec ses datas
        const userInfos = result.user || {
          username: registerData.username,
          email: registerData.email,
          role: "candidat"
        };

        contextLogin(result.token, userInfos);
        navigate("/");

      } else {
        // SI back ne renvoie pas de token alors redirection login
        navigate("/login");
      }

    } catch (error) {
      console.error("Erreur d'inscription :", error.message);
      setApiError(getFriendlyErrorMessage(error.message));
    }
  };

  return (
    <div className="w-full max-w-md">

      {/* inscription simple */}
      <form
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate>

        {/* titre */}
        <h1 className="text-3xl font-bold text-white bg-bone/20 p-5 rounded-2xl text-center mb-6 tracking-normal shadow-[0_0_15px_rgba(0,0,0,0.05)]">
          Inscription
        </h1>

        {/* affichage des erreurs api traduites */}
        {apiError && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm font-semibold text-center mb-4">
            {apiError}
          </div>
        )}

        {/* informations */}
        <div>

          <span className="block text-lg font-bold text-font-primary-dark mb-1" id="Userinfos">
            Informations *
          </span>

          <div className="flex gap-3">
            {/* nom */}
            <div className="w-1/2">

              <label htmlFor="lastName" className="sr-only">Nom</label>
              <input
                className={`w-full px-4 py-2 bg-bone-light border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.lastName
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

              <label htmlFor="firstName" className="sr-only">Prénom</label>
              <input
                className={`w-full px-4 py-2 bg-bone-light border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.firstName
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

          <label htmlFor="username" className="sr-only">Identifiant de connexion</label>
          <input
            className={`w-full px-4 py-2 bg-bone-light border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.username
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

          <label htmlFor="email" className="sr-only">Adresse email</label>
          <input
            className={`w-full px-4 py-2 bg-bone-light border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.email
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

        {/* mdp */}
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
          className="w-full bg-deep-primary text-light-bone font-bold py-3 px-4 rounded-3xl mt-6 hover:bg-primary-dark transition-colors focus:ring-2 focus:ring-primary-dark focus:outline-none disabled:opacity-50"
        >
          {isSubmitting ? "Inscription..." : "S'inscrire"}
        </button>

        {/* séparateur */}
        <div className="relative flex items-center py-2 mb-6">
          <div className="grow border-t border-primary-light/50"></div>
          <span className="shrink-0 mx-4 text-primary-light text-sm">ou</span>
          <div className="grow border-t border-primary-light/50"></div>
        </div>

        {/* btn co google
        <button
          type="button"
          className="w-full mb-6 flex items-center justify-center gap-2 bg-bone-light text-font-primary-dark border border-primary-light font-semibold py-3 px-4 rounded-3xl transition-colors focus:ring-2 focus:ring-primary focus:outline-none"
          aria-label="S'inscrire avec Google"
        >
          <UserPlus className="w-5 h-5" />
          S'inscrire avec Google
        </button>
        */}

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