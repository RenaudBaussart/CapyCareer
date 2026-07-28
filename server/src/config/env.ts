import fs from 'fs';
import path from 'path';
import { z } from 'zod';


let envPath = path.resolve(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  envPath = path.resolve(process.cwd(), '../.env'); 
}
let envConfig: Record<string, string | undefined> = { ...process.env };

try {
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf-8');
    const parsedFile = envFile.split('\n').reduce((acc: Record<string, string>, line) => {
      const [key, value] = line.split('=');
      if (key && value) {
        acc[key.trim()] = value.trim().replace(/^["']|["']$/g, ''); 
      }
      return acc;
    }, {});
    
    envConfig = { ...parsedFile, ...process.env };
  }
} catch (error) {
  console.warn("Impossible de lire le fichier .env local, utilisation des variables d'environnement du système.");
}


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

  // pour que zod accepte les url n8n
  N8N_REFRESH_JOB_OFFERS_WEBHOOK_URL: z.string().url(),

});

// Parse et valider les variables d'environnement
export const env = envSchema.parse(envConfig);