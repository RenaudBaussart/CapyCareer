// fichier gerant afficher/masquer les mdps

// import
import { useState } from "react";
// icone
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ register, name, label, error, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-lg font-bold text-primary-dark mb-1" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <input
          className={`w-full px-4 py-2 pr-12 bg-white border rounded-3xl focus:ring-2 focus:outline-none transition-colors ${
            error ? "border-accent-dark focus:ring-accent-dark" : "border-primary-light focus:ring-primary"
          }`}
          id={name}
          type={showPassword ? "text" : "password"}
          {...register(name)}
          {...props}
        />
        {/* plus grande zone cliquable */}
        <button
          type="button"
          className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-primary-light hover:text-primary transition-colors"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {error && <p className="text-accent-dark font-medium text-xs mt-1">{error.message}</p>}
    </div>
  );
}