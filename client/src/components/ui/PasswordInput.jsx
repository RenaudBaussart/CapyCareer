// fichier gerant afficher/masquer les mdps

// import
import { useState } from "react";
// icone
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ register, name, label, error, value, onChange, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  // permet detre utilisable sur les autres form et change selon le cas
  const registrationProps = register ? register(name) : { value, onChange };

  return (
    <div>
      {label && (
        <label className="block text-lg font-bold text-font-primary-dark mb-1" htmlFor={name}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`w-full px-4 py-2.5 pr-12 bg-bone-light/50 border rounded-xl focus:ring-2 focus:outline-none transition-colors ${error
            ? "border-2 border-red-600 focus:ring-red-500"
            : "border-white/60 focus:ring-primary text-font-primary-dark"
            }`}
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          {...registrationProps}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
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

      {error && (
        <p id={`${name}-error`} className="text-red-700 font-bold text-xs mt-1 ml-2">
          {error.message}
        </p>
      )}
    </div>
  );
}