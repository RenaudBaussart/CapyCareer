import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const envPath = path.resolve(__dirname, '../../../.env');
let envConfig = {};
try {
  const envFile = fs.readFileSync(envPath, 'utf-8');
  envConfig = envFile.split('\n').reduce((acc: { [key: string]: string }, line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {});
} catch (error) {
  console.error("Could not read .env file:", error);
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


});

// Parse et valider les variables d'environnement
export const env = envSchema.parse(envConfig);