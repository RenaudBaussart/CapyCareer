import fs from 'fs';
import path from 'path';

const logDirectory = path.join(__dirname, '../../../logs');

// Initialisation du dossier de logs s'il n'existe pas encore
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

/**
 * Ajoute un message d'erreur dans un fichier quotidien nommé AAAA-MM-JJ.log
 * @param message - Le message d'erreur ou la description
 * @param error - L'objet Error natif optionnel pour extraire la trace de la pile
 */
export const logErrorToFile = (message: string, error?: Error): void => {
  // Récupération des composants de la date pour le nom de fichier
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  const fileName = `${year}-${month}-${day}.log`;
  const filePath = path.join(logDirectory, fileName);

  // Création d'un horodatage propre pour la ligne de log
  const time = now.toTimeString().split(' ')[0];
  
  // Formatage clair de notre ligne de texte
  let logLine = `[${time}] ERROR: ${message}
`;
  if (error && error.stack) {
    // Ajout de la stack trace si fournie par le crash de l'application
    logLine += `Stack: ${error.stack}
`;
  }
  logLine += `-------------------------------------------
`;

  // Écriture dans le fichier de manière synchrone pour éviter les flux superposés
  fs.appendFileSync(filePath, logLine, 'utf8');

  // Log de secours dans la console pour maintenir le feedback du terminal
  console.error(`// logged to ${fileName}: ${message}`);
};
