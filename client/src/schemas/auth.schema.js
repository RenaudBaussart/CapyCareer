// fichier gerant le schema de validation des champs du form zod

// librairie validation de donnée
import * as z from "zod";

// validation zod
// verif de chaque champ avant envoi du form
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(3, "Le prénom doit contenir au moins 3 caractères")
      .max(20, "Le prénom ne peut pas dépasser 20 caractères"),
    lastName: z
      .string()
      .trim()
      .min(3, "Le nom doit contenir au moins 3 caractères")
      .max(20, "Le nom ne peut pas dépasser 20 caractères"),
    username: z
      .string()
      .trim()
      .min(3, "L'identifiant doit contenir au moins 3 caractères")
      .max(20, "L'identifiant ne peut pas dépasser 20 caractères")
      .regex(/[0-9]/, "L'identifiant doit contenir au moins un chiffre"),
    email: z
      .string()
      .email("Adresse email invalide")
      .max(100, "L'adresse email ne peut pas dépasser 100 caractères"),
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
      .regex(/[^a-zA-Z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
    confirmPassword: z.string(),
  })
  // verif que les 2 mdps soit identiques
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

// validation pour la connexion
export const loginSchema = z.object({
  username: z.string().min(3, "L'identifiant est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

// validation pour l'inscription entreprise
export const registerCompanySchema = z
  .object({
    companyName: z
      .string()
      .trim()
      .min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères"),
    siret: z
      .string()
      .trim()
      .regex(/^\d{14}$/, "Le SIRET doit contenir 14 chiffres")
      .optional()
      .or(z.literal("")),
    contactFirstName: z
      .string()
      .trim()
      .min(3, "Le prénom doit contenir au moins 3 caractères")
      .max(20, "Le prénom ne peut pas dépasser 20 caractères"),
    contactLastName: z
      .string()
      .trim()
      .min(3, "Le nom doit contenir au moins 3 caractères")
      .max(20, "Le nom ne peut pas dépasser 20 caractères"),
    email: z
      .string()
      .email("Adresse email invalide")
      .max(100, "L'adresse email ne peut pas dépasser 100 caractères"),
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
      .regex(/[^a-zA-Z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
    confirmPassword: z.string(),
  })
  // verif que les 2 mdps soit identiques
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });