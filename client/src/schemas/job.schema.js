// schema zod pour la validation du formulaire de publication d'offre
import { z } from "zod";

export const jobSchema = z
  .object({
    // titre du poste
    title: z
      .string()
      .min(3, "Le titre doit contenir au moins 3 caractères")
      .max(120, "Le titre est trop long (120 caractères max)"),

    // type de contrat
    contractType: z.enum(["CDI", "CDD", "Stage", "Alternance"], {
      errorMap: () => ({ message: "Sélectionnez un type de contrat" }),
    }),

    // localisation
    city: z.string().min(2, "Renseignez une ville"),
    country: z.string().min(2, "Renseignez un pays"),

    // mode de travail
    remote: z.boolean().optional(),
    hybrid: z.boolean().optional(),

    // date de début souhaitée
    startDate: z
      .string()
      .min(1, "Renseignez une date de début")
      .refine((v) => !Number.isNaN(Date.parse(v)), "Date de début invalide"),

    // durée du contrat (pertinent pour CDD, Stage, Alternance)
    duration: z.string().optional(),

    // fourchette de salaire (optionnelle, en texte pour l'input puis validée en nombre)
    salaryMin: z
      .string()
      .optional()
      .refine((v) => !v || !Number.isNaN(Number(v)), {
        message: "Le salaire minimum doit être un nombre",
      }),
    salaryMax: z
      .string()
      .optional()
      .refine((v) => !v || !Number.isNaN(Number(v)), {
        message: "Le salaire maximum doit être un nombre",
      }),

    // description du poste
    description: z
      .string()
      .min(50, "La description doit contenir au moins 50 caractères")
      .max(3000, "La description est trop longue (3000 caractères max)"),
  })
  // vérifie que salaire min <= salaire max quand les deux sont renseignés
  .refine(
    (data) =>
      !data.salaryMin ||
      !data.salaryMax ||
      Number(data.salaryMin) <= Number(data.salaryMax),
    {
      message: "Le salaire minimum doit être inférieur au salaire maximum",
      path: ["salaryMax"],
    },
  )
  // la durée est requise pour tout contrat qui n'est pas un CDI
  .refine(
    (data) =>
      data.contractType === "CDI" ||
      (data.duration && data.duration.trim().length > 0),
    {
      message: "Indiquez la durée du contrat",
      path: ["duration"],
    },
  );
