import { Request, Response, NextFunction } from "express";
import { pool } from '../../config/database';
import { z } from "zod";
import { BadRequestError, NotFoundError, InternalServerError } from '../../core/errors/HttpError';
import { createJobFullOffer } from "./job.offers.service";

/**
 * récupère la liste des offres d'emploi paginée pour la page d'accueil
 * @param req la requête HTTP contenant le numéro de page dans la query
 * @param res la réponse HTTP renvoyant les offres et l'indicateur de fin
 * @param next la fonction pour transmettre les erreurs au middleware d'erreur
 */
const getJobOffers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;

        // vérifie si la page est un nombre positif valide
        if (page < 1) {
            throw new BadRequestError("Le numéro de page doit être un entier positif.");
        }

        const limit = 50;
        //calcule le décalage pour la pagination
        const offset = (page - 1) * limit;

        // récupère 51 offres au lieu de 50 pour anticiper la page suivante
        const [rows] = await pool.query(
            "SELECT PK_id, title, contract_type, city, country, company, url FROM Job_Offers ORDER BY publish_date DESC LIMIT ? OFFSET ?;",
            [limit + 1, offset]
        );

        //typage du tableau de résultats
        const offers = rows as any[];

        if (offers.length === 0 && page > 1) {
            throw new NotFoundError("Aucune offre d'emploi trouvée pour cette page.");
        }

        // détermine si la fin de la table est atteinte
        const isTheEnd = offers.length <= limit;

        if (!isTheEnd) {
            //vire le 51ème élément bonus si il existe
            offers.pop();
        }

        // renvoie la réponse bien structurée au client
        res.status(200).json({
            job_offers: offers,
            is_the_end: isTheEnd
        });
    }
    catch (error) {
        next(error);
    }
};

/**
 * récupère le détail d'une offre d'emploi spécifique grâce à son id
 * @param req la requête HTTP contenant l'id dans les paramètres
 * @param res la réponse HTTP renvoyant l'objet complet de l'offre
 * @param next la fonction pour transmettre les erreurs au middleware d'erreur
 */
const getJobOfferById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // récupère l'identifiant dans les paramètres d'url
        const { id } = req.params;
        const jobId = Number(id);

        if (!id) throw new BadRequestError("Identifiant d'offre manquant.");
        if (typeof id !== 'string' || id.trim() === '') {
            //lève une erreur si le paramètre est vide ou invalide
            throw new BadRequestError("Identifiant d'offre invalide.");
        }

        // cherche l'offre correspondante en base de données
        const [rows] = await pool.execute<any[]>(
            "SELECT PK_id, title, description, url, contract_type, city, country, company, remote, hybrid, publish_date, salary_max, salary_min, currency FROM Job_Offers WHERE PK_id = ?;",
            [id]
        );

        const offer = (rows as any[])[0] as any;

        if (!offer) {
            //lève une 404 si aucun résultat ne correspond
            throw new NotFoundError("L'offre d'emploi demandée n'a pas été trouvée.");
        }

        // renvoie le détail de l'offre
        res.status(200).json(offer);
    }
    catch (error) {
        next(error);
    }
};

/**
 * valide et ajoute une nouvelle offre d'emploi en base de données
 * @param req la requête HTTP contenant les champs de l'offre dans le body
 * @param res la réponse HTTP renvoyant un message de confirmation et l'id créé
 * @param next la fonction pour transmettre les erreurs au middleware d'erreur
 */
const createJobOffer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let jobOffer;
        try {
            // valide le corps de la requête avec le service
            jobOffer = createJobFullOffer(req.body);
        } catch (error: any) {
            //si c'est une erreur zod renvoie les détails de validation en 400
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Erreur de validation des données.",
                    errors: error.flatten().fieldErrors
                });
            }
            throw error;
        }

        // déstructure les champs nécessaires
        const { title, description, url, contract_type, city, country, company, is_remote_job, is_hybride_job, publish_date, salary_max, salary_min, currency } = jobOffer;
        const formattedPublishDate = publish_date ? new Date(publish_date).toISOString().slice(0, 19).replace('T', ' ') : null;
        const rawString = `${title}-${city}-${contract_type}-${company}-${publish_date}`.toLowerCase();
        let contentHash = 0;
        for (let i = 0; i < rawString.length; i++) {
            const char = rawString.charCodeAt(i);
            contentHash = ((contentHash << 5) - contentHash) + char;
            contentHash = contentHash & contentHash;
        }
        const finalHash = Math.abs(contentHash).toString(16)
        //insère la nouvelle offre en base de données
        const [result] = await pool.execute(
            "INSERT INTO Job_Offers (content_hash ,title, description, url, contract_type, city, country, company, remote, hybrid, publish_date, salary_max, salary_min, currency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
            [finalHash, title, description, url, contract_type, city, country, company, is_remote_job, is_hybride_job, formattedPublishDate, salary_max, salary_min, currency]
        );

        // confirme la création avec l'id généré
        res.status(201).json({ message: "Offre d'emploi ajoutée avec succès.", id: (result as any).insertId });
    } catch (error) {
        next(error);
    }
};

/**
 * met à jour les informations d'une offre d'emploi existante
 * @param req la requête HTTP contenant l'id en paramètre et les modifications dans le body
 * @param res la réponse HTTP confirmant la mise à jour
 * @param next la fonction pour transmettre les erreurs au middleware d'erreur
 */
const updateJobOffer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // récupère et valide la présence de l'id
        const { id } = req.params;
        if (!id) throw new BadRequestError("Identifiant d'offre manquant.");
        if (typeof id !== 'string' || id.trim() === '') {
            throw new BadRequestError("Identifiant d'offre invalide.");
        }

        let jobOffer;
        try {
            //contrôle les données envoyées avec le schéma zod
            jobOffer = createJobFullOffer(req.body);
        } catch (error: any) {
            // si l'erreur est une validation zod renvoie une réponse 400
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Erreur de validation des données.",
                    errors: error.flatten().fieldErrors
                });
            }
            throw error;
        }

        // déstructure les données validées
        const { title, description, url, contract_type, city, country, company, is_remote_job, is_hybride_job, publish_date, salary_max, salary_min, currency } = jobOffer;
        const formattedPublishDate = publish_date ? new Date(publish_date).toISOString().slice(0, 19).replace('T', ' ') : null;
        //exécute la requête de mise à jour sql
        const [result] = await pool.execute(
            "UPDATE Job_Offers SET title = ?, description = ?, url = ?, contract_type = ?, city = ?, country = ?, company = ?, remote = ?, hybrid = ?, publish_date = ?, salary_max = ?, salary_min = ?, currency = ? WHERE PK_id = ?;",
            [title, description, url, contract_type, city, country, company, is_remote_job, is_hybride_job, formattedPublishDate, salary_max, salary_min, currency, id]
        );

        if ((result as any).affectedRows === 0) {
            // signale que l'offre n'existe pas en base
            throw new NotFoundError("L'offre d'emploi à mettre à jour n'existe pas.");
        }

        //répond que la modification est effectuée
        res.status(200).json({ message: "Offre d'emploi mise à jour avec succès." });
    } catch (error) {
        next(error);
    }
};

/**
 * supprime une offre d'emploi existante en base de données
 * @param req la requête HTTP contenant l'id de l'offre en paramètre
 * @param res la réponse HTTP confirmant la suppression
 * @param next la fonction pour transmettre les erreurs au middleware d'erreur
 */
const deleteJobOffer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // récupère l'id passé dans la route
        const { id } = req.params;
        if (!id) throw new BadRequestError("Identifiant d'offre manquant.");
        if (typeof id !== 'string' || id.trim() === '') {
            //vérifie que l'id n'est pas une chaîne vide
            throw new BadRequestError("Identifiant d'offre invalide.");
        }

        // change la valeur active à 0 pour marquer la suppression
        const [result] = await pool.execute(
            "UPDATE Job_Offers SET active = 0 WHERE PK_id = ?;",
            [id]
        );

        if ((result as any).affectedRows === 0) {
            //lève une 404 si l'id n'a été trouvé nulle part
            throw new NotFoundError("L'offre d'emploi à supprimer n'existe pas.");
        }

        // confirme la suppression au client
        res.status(200).json({ message: "Offre d'emploi supprimée avec succès." });
    } catch (error) {
        next(error);
    }
};

/**
 * récupère le nombre total d'offres d'emploi actives enregistrées
 * @param req la requête HTTP
 * @param res la réponse HTTP contenant le nombre total d'offres
 * @param next la fonction pour transmettre les erreurs au middleware d'erreur
 */
const totalJobOffersCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // compte le nombre d'offres ayant le statut actif
        const [rows] = await pool.execute<any[]>(
            "SELECT COUNT(*) as total FROM Job_Offers WHERE active = 1;"
        );

        //renvoie le résultat au client
        res.status(200).json({ total: rows[0].total });
    } catch (error) {
        next(error);
    }
};

/** 
 * déclenche le rafraîchissement des offres d'emploi via un webhook N8N
 * @param req la requête HTTP
 * @param res la réponse HTTP confirmant le déclenchement du rafraîchissement
 * @param next la fonction pour transmettre les erreurs au middleware d'erreur
 */
const refreshJobOffers = async (req: Request, res: Response, next: NextFunction) => {
    // récupère l'URL du webhook depuis les variables d'environnement
    const webhookUrl = process.env.N8N_REFRESH_JOB_OFFERS_WEBHOOK_URL;

    try {
        // vérifie que l'URL du webhook est bien configurée
        if (!webhookUrl) {
            throw new InternalServerError("URL du webhook non configurée.");
        }

        //crée un contrôleur d'annulation pour gérer un timeout de 8 secondes
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        // effectue la requête POST vers le webhook N8N
        const response = await fetch(webhookUrl, {
            method: 'POST',
            signal: controller.signal
        });

        // nettoie le timer si la réponse arrive à temps
        clearTimeout(timeout);

        // vérifie que la requête a réussi
        if (!response.ok) {
            throw new InternalServerError(`Erreur lors du rafraîchissement des offres d'emploi. Code d'erreur : ${response.status}`);
        }

        // renvoie une confirmation au client
        res.status(200).json({ message: "Rafraîchissement des offres d'emploi déclenché avec succès." });
    } catch (error) {
        next(error);
    }
};
export { getJobOffers, getJobOfferById, createJobOffer, updateJobOffer, deleteJobOffer, totalJobOffersCount, refreshJobOffers };