// fichier gerant le schema de validation des champs du form zod

// librairie validation de donnée
import * as z from "zod";

// validation zod
// verif de chaque champ avant envoi du form
export const registerSchema = z.object({
  firstName: z.string().trim().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères"),
  username: z.string().trim().min(3, "L'identifiant doit contenir au moins 3 caractères"),
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string()

  // verif que les 2 mdps soit identiques
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

// validation pour la connexion
export const loginSchema = z.object({
  username: z.string().min(3, "L'identifiant est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});