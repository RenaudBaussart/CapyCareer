// fichier gerant le component de connexion

// import
// hook gere les formulaire react
import { useForm } from "react-hook-form";
// permet de co react hook form avec la validation zod
import { zodResolver } from "@hookform/resolvers/zod";
// schema zod
import { loginSchema } from "../../schemas/auth.schema";
// navigation
import { Link } from "react-router-dom";
// icone
import { LogIn } from "lucide-react";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    // WARNING: connecter a lAPI
    console.log("Login data :", data);
  };

  return (
    <div className="w-full max-w-md">
      {/* titre */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary-dark mb-4">Bienvenue !</h1>
        <p className="text-primary-dark/80">
          Pour commencer, veuillez vous connecter ou vous inscrire via votre compte Google.
        </p>
      </div>

      <p className="text-sm text-primary-dark/70 mb-6">
        En cliquant sur l'une des options "Se connecter" ci-dessous, vous comprenez et acceptez les <Link to="/cgu" className="text-accent-dark font-medium hover:underline">Conditions d'utilisation</Link> de CapyCareer. Vous confirmez également avoir pris connaissance de la <Link to="/privacy" className="text-accent-dark font-medium hover:underline">Politique de confidentialité</Link>.
      </p>

      {/* btn co google */}
      <button
        type="button"
        className="w-full mb-6 flex items-center justify-center gap-2 bg-white text-primary-dark border border-primary-light font-semibold py-3 px-4 rounded-lg hover:bg-primary-light/10 transition-colors focus:ring-2 focus:ring-primary focus:outline-none"
        aria-label="Se connecter avec Google"
      >
        <LogIn className="w-5 h-5" />
        Se connecter avec Google
      </button>

      {/* séparateur */}
      <div className="relative flex items-center py-2 mb-6">
        <div className="grow border-t border-primary-light/50"></div>
        <span className="shrink-0 mx-4 text-primary-light text-sm">ou</span>
        <div className="grow border-t border-primary-light/50"></div>
      </div>

      {/* connexion classique */}
      <form
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate>
        
    {/* identifiant de connexion */}
        <div>
          <label
            className="block text-sm font-bold text-primary-dark mb-1"
            htmlFor="username" >
            Identifiant de connexion *
          </label>
          <input
            className={`w-full px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:outline-none transition-colors ${errors.username ? "border-accent-dark focus:ring-accent-dark" : "border-primary-light focus:ring-primary"}`}
            id="username"
            type="text"
            autoComplete="username"
            {...register("username")}
            aria-invalid={errors.username ? "true" : "false"}
            aria-describedby={errors.username ? "username-error" : undefined}
          />
          {errors.username && <p id="username-error" className="text-accent-dark font-medium text-xs mt-1">{errors.username.message}</p>}
        </div>

        {/* mdp */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label
              className="block text-sm font-bold text-primary-dark"
              htmlFor="password" >
              Mot de passe *
            </label>
            {/* WARNING: mdp oublié */}
            <Link to="/forgot-password" className="text-xs text-accent font-medium hover:text-accent-dark hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>

          <input
            className={`w-full px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:outline-none transition-colors ${errors.password ? "border-accent-dark focus:ring-accent-dark" : "border-primary-light focus:ring-primary"}`}
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && <p id="password-error" className="text-accent-dark font-medium text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-bone font-bold py-3 px-4 rounded-lg mt-6 hover:bg-primary-dark transition-colors focus:ring-2 focus:ring-primary-dark focus:outline-none disabled:opacity-50"
        >
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>

      </form>
      
      {/* link vers inscription */}
      <p className="text-center mt-6 text-sm text-primary-dark/80">
        Pas encore de compte ?{" "}
        <Link to="/register" className="text-accent-dark font-bold hover:underline">
          S'inscrire
        </Link>
      </p>
    </div>
  );
}