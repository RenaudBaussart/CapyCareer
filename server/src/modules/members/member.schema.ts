import { z } from "zod";
import profanity from 'leo-profanity';
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import sanitizeHtml from "sanitize-html";

extendZodWithOpenApi(z);

const sanitizeConfig = {
    allowedTags: [], 
    allowedAttributes: {}
};

const sanitizePreprocess = (val: string) => (typeof val === "string" ? sanitizeHtml(val, sanitizeConfig) : val);

const FrWords = profanity.getDictionary('fr');
const EnWords = profanity.getDictionary('en');
const EsWords = profanity.getDictionary('es');

profanity.add(FrWords);
profanity.add(EnWords);
profanity.add(EsWords);

export const createMemberSchema = z.object({
    email: z.preprocess(
        sanitizePreprocess,
        z.string()
            .email("email format invalid !")
            .max(100, "email can't exceed 100 letters")
    ).openapi({
        example: "jojo@gmail.com",
        description: "L'adresse email unique du membre"
    }),

    password: z.string()
        .min(6, "Password lenght must have at least 6 letters")
        .regex(/[A-Z]/, "Password must have at least one uppercase")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain a special caracter")
        .openapi({
            example: "HelloWorld0/",
            description: "Le mot de passe en clair (minimum 6 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial)"
        }),

    role: z.enum(["candidat", "entreprise"]).openapi({
        example: "candidat",
        description: "Le rôle du membre sur la plateforme"
    }),

    firstname: z.preprocess(
        sanitizePreprocess,
        z.string()
            .min(3, "Firstname must have at least 3 letters")
            .max(50, "Firstname can't exceed 50 letters")
            .refine((value) => !profanity.check(value), "Unauthorized words")
    ).openapi({
        example: "Jojo",
        description: "Le prénom du membre (filtre anti-vulgarité actif)"
    }),

    lastname: z.preprocess(
        sanitizePreprocess,
        z.string()
            .min(3, "Lastname must have at least 3 letters")
            .max(20, "Lastname can't exceed 20 letters")
            .refine((value) => !profanity.check(value), "Unauthorized words")
    ).openapi({
        example: "Bernard",
        description: "Le nom de famille du membre (filtre anti-vulgarité actif)"
    }),

    username: z.preprocess(
        sanitizePreprocess,
        z.string()
            .min(3, "Username must have at least 3 letters")
            .max(20, "Username can't exceed 20 letters")
            .regex(/[0-9]/, "Username must have a number")
            .refine((value) => !profanity.check(value), "Unauthorized words")
    ).openapi({
        example: "Jojodu59",
        description: "Le pseudonyme public du membre (doit contenir au moins un chiffre)"
    }),

    biography: z.preprocess(
        sanitizePreprocess,
        z.string()
            .min(3, "Write more than 3 letters")
            .max(1000, "You can't exceed 1000 characters")
            .refine((value) => !profanity.check(value), "Unauthorized terms")
    ).optional()
    .openapi({
        example: "Développeur passionné par le backend et les architectures robustes.",
        description: "Une courte présentation de l'utilisateur"
    }),

    profil_pic_link: z.preprocess(
        sanitizePreprocess,
        z.string()
    ).optional()
    .openapi({
        example: "https://mon-stockage.com/images/jojo.png",
        description: "L'URL de la photo de profil"
    })
}).openapi("Member");

const baseUpdateSchema = createMemberSchema.partial().omit({ 
    password: true,
    role: true     
});

export const updateMemberSchema = baseUpdateSchema.extend({
    role: z.enum(["candidat", "entreprise", "admin"]).optional(),
    
    newPassword: z.string()
        .min(6, "Password length must have at least 6 letters")
        .regex(/[A-Z]/, "Password must have at least one uppercase")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain a special character")
        .optional(),
        
    password: z.string().optional() 
}).openapi("AdminUpdateMember");

export const updateProfileSchema = createMemberSchema.pick({
    firstname: true,
    lastname: true,
    biography: true,
    profil_pic_link: true
}).partial().strict().openapi("UpdateProfile");

export const updateAccountSchema = createMemberSchema.pick({
    email: true,
    username: true
}).partial().strict().openapi("UpdateAccount");

export const updatePasswordSchema = z.object({
    password: z.string()
        .min(6, "Password length must have at least 6 letters")
        .regex(/[A-Z]/, "Password must have at least one uppercase")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain a special character")
        .openapi({
            example: "NewSecurePassword1/",
            description: "Le nouveau mot de passe sécurisé"
        })
}).strict().openapi("UpdatePassword");

export const member = createMemberSchema;