import z from "zod";
import profanity from 'leo-profanity';

const FrWords = profanity.getDictionary('fr');
const EnWords = profanity.getDictionary('en');
const EsWords = profanity.getDictionary('es');

profanity.add(FrWords);
profanity.add(EnWords);
profanity.add(EsWords);

const createMemberSchema = z.object({
    email: z.string().email("email format invalid !").max(100, "email can't exceed 100 letters"),

    password: z.string().min(6, "Password lenght must have at least 6 letters").regex(/[A-Z]/, "Password must have at least one uppercase").regex(/[0-9]/, "Password must contain at least one number").regex(/[^a-zA-Z0-9]/,"Password must contain a special caracter"),

    role: z.enum(["candidat", "entreprise"]),

    firstname: z.string().min(3,"Firstname must have at least 3 letters").max(20,"Firstname can't exceed 20 letters").refine((value) => !profanity.check(value), "Unauthorized words"),

    lastname: z.string().min(3,"Lastname must have at least 3 letters").max(20,"Lastname can't exceed 20 letters").refine((value) => !profanity.check(value), "Unauthorized words"),

    username: z.string().min(3, "Username must have at least 3 letters").max(20, "Username can't exceed 20 letters").regex(/[0-9]/,"Username must have a number").refine((value) => !profanity.check(value), "Unauthorized words"),

    biography: z.string().min(3, "Write more than 3 letters").max(1000, "You can't exceed 1000 characters").refine((value) => !profanity.check(value), "Unauthorized terms").optional(),

    profil_pic_link: z.string().optional()
})

export const member = createMemberSchema;
module.exports = {
    member
}
