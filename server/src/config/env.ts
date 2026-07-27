import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' }); 
import { z } from 'zod';

// zod schema pour valider les variables d'environnement
const envSchema = z.object({
  OVH_DB_HOST: z.string(),
  OVH_DB_USER: z.string(),
  OVH_DB_PASSWORD: z.string(),
  OVH_DB_NAME: z.string(),
  OVH_DB_PORT: z.string().transform(Number),


  ATTACK_DB_HOST: z.string(),
  ATTACK_DB_USER: z.string(),
  ATTACK_DB_PASSWORD: z.string(),
  ATTACK_DB_NAME: z.string(),
  ATTACK_DB_PORT: z.string().transform(Number),

  
  SERVER_PORT: z.string().transform(Number).optional().default(5000),


});

// Parse et valider les variables d'environnement
export const env = envSchema.parse(process.env);