// fichier gerant le component de connexion

// import
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContextObject";
// hook gere les formulaire react
import { useForm } from "react-hook-form";
// communique avec API
import { login } from "../../services/auth.service";
// permet de co react hook form avec la validation zod
import { zodResolver } from "@hookform/resolvers/zod";
// schema zod
import { loginSchema } from "../../schemas/auth.schema";
// navigation
import { Link, useNavigate } from "react-router-dom";
// lire jwt 
import { jwtDecode } from "jwt-decode";
// icone
// import { LogIn } from "lucide-react";
// utilitaire d'erreurs
import { getFriendlyErrorMessage } from "../../utils/errorHandler";
// afficher/masquer mdp
import PasswordInput from "../ui/PasswordInput";

export default function LoginForm() {
  // recupere la fonction login contexte
  const { login: contextLogin } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // etat pour gerer les erreurs renvoyees par l'API
  const [apiError, setApiError] = useState("");
  // hook pour rediriger apres la co
  const navigate = useNavigate();

  // fonction appelee quand le formulaire est valide
  const onSubmit = async (data) => {
    // efface ancienne valeur
    setApiError("");

    try {
      // isole rememberMe des autres datas
      const { rememberMe, ...apiData } = data;

      // prepare payload pour lenvoi en back
      const payloadForBackend = {
        ...apiData,
        stayConnected: rememberMe
      };

      // call back externe pour se co avec le bon payload
      const result = await login(payloadForBackend);

      // SI token alors il est stocké
      if (result.token) {
        // decode  token pour cbiler le role
        const decodedToken = jwtDecode(result.token);

        // transmet la value du token au contexte
        contextLogin(result.token, {
          username: data.username,
          rememberMe: rememberMe,
          roleId: decodedToken.role
        });


        // redirection selon le role (FK_role_id)
        switch (decodedToken.role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "entreprise":
            navigate("/company/dashboard");
            break;
          case "user":
            navigate("/");
            break;
          default:
            navigate("/");
            break;
        }
      }

    } catch (error) {
      console.error("Erreur brute :", error.message);
      // affiche erreur a luser
      setApiError(getFriendlyErrorMessage(error.message));
    }
  };

  return (
    <div className="w-full max-w-md">

      {/* connexion de base */}
      <form
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate>

        {/* titre */}
        <h1 className="text-3xl font-bold text-white bg-bone/20 p-5 rounded-2xl text-center mb-6 tracking-normal shadow-[0_0_15px_rgba(0,0,0,0.05)]">
          Connexion
        </h1>

        {/* affichage des erreurs api traduites */}
        {apiError && (
          <div role="alert" className="p-3 bg-red-50 border-2 border-red-600 text-red-700 rounded-xl text-sm font-bold text-center">
            {apiError}
          </div>
        )}

        {/* identifiant de connexion */}
        <div>
          <label
            className="block text-lg font-bold text-font-primary mb-1"
            htmlFor="username" >
            Identifiant de connexion *
          </label>
          <input
            className={`w-full px-4 py-2 bg-bone-light border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${errors.username
              ? "border-2 border-red-600 focus:ring-red-500"
              : "border-primary-light focus:ring-primary"
              }`}
            id="username"
            type="text"
            autoComplete="username"
            {...register("username")}
            aria-invalid={errors.username ? "true" : "false"}
            aria-describedby={errors.username ? "username-error" : undefined}
          />
          {errors.username && <p id="username-error" className="text-red-700 font-bold text-xs mt-1 ml-2">{errors.username.message}</p>}
        </div>

        {/* mdp */}
        <div>
        

          <PasswordInput
            label="Mot de passe *"
            name="password"
            register={register}
            error={errors.password}
            autoComplete="current-password"
          />
        </div>

        {/* rester connecté */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="rememberMe"
            {...register("rememberMe")}
            className="accent-primary w-4 h-4 cursor-pointer"
          />

          <label htmlFor="rememberMe" className="text-sm font-medium text-font-primary cursor-pointer">
            Rester connecté
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-deep-primary text-light-bone font-bold py-3 px-4 rounded-3xl mt-6 hover:bg-primary-dark transition-colors focus:ring-2 focus:ring-primary-dark focus:outline-none disabled:opacity-50"
        >
          {isSubmitting ? "Connexion..." : "Se connecter"}
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
          className="w-full mb-6 flex items-center justify-center gap-2 bg-bone-light text-font-primary border border-primary-light font-semibold py-3 px-4 rounded-3xl transition-colors focus:ring-2 focus:ring-primary focus:outline-none"
          aria-label="Se connecter avec Google"
        >
          <LogIn className="w-5 h-5" />
          Se connecter avec Google
        </button>
          */}

      </form>

      {/* link vers inscription */}
      <p className="text-center mt-6 text-sm text-font-primary/80">
        Pas encore de compte ?{" "}
        <Link to="/register" className="text-accent-dark font-bold hover:underline">
          S'inscrire
        </Link>
      </p>

    </div>
  );
}