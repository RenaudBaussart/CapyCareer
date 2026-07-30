import { Request, Response, NextFunction } from "express";
import { pool } from '../../config/database';
import { z } from "zod";
import { BadRequestError, NotFoundError, InternalServerError } from '../../core/errors/HttpError';
import { createJobFullOffer, updateJobFullOffer, parseTagString } from "./job.offers.service";
import { env } from '../../config/env';

/**
 * récupère la liste des offres d'emploi paginée pour la page d'accueil
 * @param req la requête HTTP contenant le numéro de page dans la query
 * @param res la réponse HTTP renvoyant les offres et l'indicateur de fin
 * @param next la fonction pour transmettre les erreurs au middleware d'erreur
 */
const getJobOffers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        // recupere le param sil existe dans query
        const search = req.query.search as string || "";

        // verif si la page est nbr positif
        if (page < 1) {
            throw new BadRequestError("Le numéro de page doit être un entier positif.");
        }

        const limit = 50;
        // calcule le decalage pour la pagination
        const offset = (page - 1) * limit;

        // recupere filtre de recherche
        const { q, lieu, salaryMin, salaryMax, tags } = req.query;

        let query = "SELECT PK_id, title, description, contract_type, city, country, company, url, remote, hybrid, publish_date, salary_max, salary_min, currency, tag FROM Job_Offers WHERE active = 1";
        const queryParams: any[] = [];

        // SI la recherche globale/ID est présente
        if (search) {
    if (!isNaN(Number(search))) {
        query += " AND PK_id LIKE ?";
        queryParams.push(`%${search}%`);
    } else {
        query += " AND (title LIKE ? OR company LIKE ?)";
        queryParams.push(`%${search}%`, `%${search}%`);
    }
}

        // filtres spécifiques
        if (q && typeof q === "string") {
            query += " AND (title LIKE ? OR company LIKE ?)";
            queryParams.push(`%${q}%`, `%${q}%`);
        }

        if (lieu && typeof lieu === "string") {
            query += " AND (city LIKE ? OR country LIKE ?)";
            queryParams.push(`%${lieu}%`, `%${lieu}%`);
        }

        if (salaryMin && !isNaN(Number(salaryMin))) {
            query += " AND (salary_max >= ? OR (salary_max IS NULL AND salary_min >= ?))";
            queryParams.push(Number(salaryMin), Number(salaryMin));
        }

        if (salaryMax && !isNaN(Number(salaryMax))) {
            query += " AND (salary_min <= ? OR (salary_min IS NULL AND salary_max <= ?))";
            queryParams.push(Number(salaryMax), Number(salaryMax));
        }

        // filtre mots-clés/tags : chaque mot-clé doit apparaître dans le titre OU dans la colonne tag
        // tags peut arriver comme une chaîne unique ("React,TypeScript") ou un tableau (plusieurs query params identiques)
        if (tags) {
            const tagList = Array.isArray(tags)
                ? tags as string[]
                : (tags as string).split(",").map((t) => t.trim()).filter(Boolean);

            if (tagList.length > 0) {
                // chaque mot-clé doit matcher (titre OU tag) -> on ET-combine les mots-clés (tous doivent matcher)
                const tagConditions = tagList.map(() => "(title LIKE ? OR tag LIKE ?)").join(" AND ");
                query += ` AND (${tagConditions})`;
                tagList.forEach((t) => {
                    queryParams.push(`%${t}%`, `%${t}%`);
                });
            }
        }

        // ajoute le tri & la limite pour la pagination
        query += " ORDER BY publish_date DESC LIMIT ? OFFSET ?;";
        queryParams.push(limit + 1, offset);

        // recup 51 offres pour anticiper la page suivante (prise en compte des filtres)
        const [rows] = await pool.query(query, queryParams);

        //typage du tableau de result
        const offers = rows as any[];

        offers.forEach(offer => {
            offer.tag = parseTagString(offer.tag);
        });

        if (offers.length === 0 && page > 1) {
            throw new NotFoundError("Aucune offre d'emploi trouvée pour cette page.");
        }

        // SI la fin de la table bdd atteint
        const isTheEnd = offers.length <= limit;

        if (!isTheEnd) {
            //vire le 51ème élément bonus sil existe
            offers.pop();
        }

        // return result
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

        // Ajout d'une validation pour les ID non numériques
        if (isNaN(jobId)) {
            throw new BadRequestError("L'identifiant de l'offre doit être un nombre.");
        }

        if (!id) throw new BadRequestError("Identifiant d'offre manquant.");
        if (typeof id !== 'string' || id.trim() === '') {
            //lève une erreur si le paramètre est vide ou invalide
            throw new BadRequestError("Identifiant d'offre invalide.");
        }

        // cherche l'offre correspondante en base de données
        const [rows] = await pool.execute<any[]>(
            "SELECT PK_id, title, description, url, contract_type, city, country, company, remote, hybrid, publish_date, salary_max, salary_min, currency, tag FROM Job_Offers WHERE PK_id = ?;",
            [jobId]
        );

        const offer = (rows as any[])[0] as any;

        if (!offer) {
            // Si aucun résultat, renvoyer directement une 404
            return res.status(404).json({ message: "L'offre d'emploi demandée n'a pas été trouvée." });
        }

        if (offer) {
            offer.tag = parseTagString(offer.tag);
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
            jobOffer = createJobFullOffer(req.body);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Erreur de validation des données.",
                    errors: error.flatten().fieldErrors
                });
            }
            throw error;
        }

        const { title, description, url, contract_type, city, country, company, is_remote_job, is_hybride_job, publish_date, salary_max, salary_min, currency, tag, user_id } = jobOffer;
        const tagString = Array.isArray(tag) ? tag.join(', ') : (typeof tag === 'string' ? tag : null);
        const formattedPublishDate = publish_date ? new Date(publish_date).toISOString().slice(0, 19).replace('T', ' ') : null;
        const rawString = `${title}-${city}-${contract_type}-${company}-${publish_date}`.toLowerCase();
        let contentHash = 0;
        for (let i = 0; i < rawString.length; i++) {
            const char = rawString.charCodeAt(i);
            contentHash = ((contentHash << 5) - contentHash) + char;
            contentHash = contentHash & contentHash;
        }
        const finalHash = Math.abs(contentHash).toString(16);

        // Ajout d'un tableau vide par défaut au cas où le mock/driver renvoie undefined
        const [result] = (await pool.query(
            "INSERT INTO Job_Offers (content_hash ,title, description, url, contract_type, city, country, company, remote, hybrid, publish_date, salary_max, salary_min, currency, tag, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
            [finalHash, title, description, url, contract_type, city, country, company, is_remote_job, is_hybride_job, formattedPublishDate, salary_max, salary_min, currency, tagString, user_id]
        )) as [any, any[]] || [{}];

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
        const { id } = req.params;
        if (!id) throw new BadRequestError("Identifiant d'offre manquant.");
        if (typeof id !== 'string' || id.trim() === '') {
            throw new BadRequestError("Identifiant d'offre invalide.");
        }

        let jobOffer;
        try {
            // Utiliser la fonction dédiée à la mise à jour partielle
            jobOffer = updateJobFullOffer(req.body);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Erreur de validation des données.",
                    errors: error.flatten().fieldErrors
                });
            }
            throw error;
        }

        const { title, description, url, contract_type, city, country, company, is_remote_job, is_hybride_job, publish_date, salary_max, salary_min, currency, tag } = jobOffer;
        const tagString = Array.isArray(tag) ? tag.join(', ') : (typeof tag === 'string' ? tag : null);
        const formattedPublishDate = publish_date ? new Date(publish_date).toISOString().slice(0, 19).replace('T', ' ') : null;

        // Fallback || [{}] pour éviter le TypeError: undefined is not iterable
        const [result] = (await pool.query(
            "UPDATE Job_Offers SET title = ?, description = ?, url = ?, contract_type = ?, city = ?, country = ?, company = ?, remote = ?, hybrid = ?, publish_date = ?, salary_max = ?, salary_min = ?, currency = ?, tag = ? WHERE PK_id = ?;",
            [title, description, url, contract_type, city, country, company, is_remote_job, is_hybride_job, formattedPublishDate, salary_max, salary_min, currency, tagString, id]
        )) as [any, any[]] || [{}];

        if ((result as any).affectedRows === 0) {
            throw new NotFoundError("L'offre d'emploi à mettre à jour n'existe pas.");
        }

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
            // Si aucune ligne n'a été affectée, renvoyer directement une 404
            return res.status(404).json({ message: "L'offre d'emploi à supprimer n'existe pas." });
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
/**
 * recup nbrtotal d'offres d'emploi actives (filtrees si recherche)
 */
const totalJobOffersCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const search = req.query.search as string || "";
        const { q, lieu, salaryMin, salaryMax, tags } = req.query;

        let query = "SELECT COUNT(*) as total FROM Job_Offers WHERE active = 1";
        const queryParams: any[] = [];

        if (search) {
            if (!isNaN(Number(search))) {
                query += " AND (PK_id = ? OR title LIKE ? OR company LIKE ?)";
                queryParams.push(Number(search), `%${search}%`, `%${search}%`);
            } else {
                query += " AND (title LIKE ? OR company LIKE ?)";
                queryParams.push(`%${search}%`, `%${search}%`);
            }
        }

        if (q && typeof q === "string") {
            query += " AND (title LIKE ? OR company LIKE ?)";
            queryParams.push(`%${q}%`, `%${q}%`);
        }

        if (lieu && typeof lieu === "string") {
            query += " AND (city LIKE ? OR country LIKE ?)";
            queryParams.push(`%${lieu}%`, `%${lieu}%`);
        }

        if (salaryMin && !isNaN(Number(salaryMin))) {
            query += " AND (salary_max >= ? OR (salary_max IS NULL AND salary_min >= ?))";
            queryParams.push(Number(salaryMin), Number(salaryMin));
        }

        if (salaryMax && !isNaN(Number(salaryMax))) {
            query += " AND (salary_min <= ? OR (salary_min IS NULL AND salary_max <= ?))";
            queryParams.push(Number(salaryMax), Number(salaryMax));
        }

        if (tags) {
            const tagList = Array.isArray(tags)
                ? tags as string[]
                : (tags as string).split(",").map((t) => t.trim()).filter(Boolean);

            if (tagList.length > 0) {
                const tagConditions = tagList.map(() => "(title LIKE ? OR tag LIKE ?)").join(" AND ");
                query += ` AND (${tagConditions})`;
                tagList.forEach((t) => {
                    queryParams.push(`%${t}%`, `%${t}%`);
                });
            }
        }

        const [rows] = await pool.execute<any[]>(query, queryParams);

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
    const webhookUrl = env.N8N_REFRESH_JOB_OFFERS_WEBHOOK_URL;

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

/**
 * recup la date de la dernière mise à jour/synchronisation des offres
 * @param req la requête HTTP
 * @param res la réponse HTTP contenant la date de dernière synchro
 * @param next la fonction pour transmettre les erreurs au middleware d'erreur
 */
const getLastSyncDate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // recup date + récente
        const [rows] = await pool.execute<any[]>(
            "SELECT MAX(updated_at) as last_sync FROM Job_Offers;"
        );

        // return result
        res.status(200).json({ last_sync: rows[0].last_sync });
    } catch (error) {
        next(error);
    }
};
export { getJobOffers, getJobOfferById, createJobOffer, updateJobOffer, deleteJobOffer, totalJobOffersCount, refreshJobOffers, getLastSyncDate };