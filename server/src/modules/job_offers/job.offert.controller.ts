import { Request, Response, NextFunction } from "express";
import { pool } from '../../config/database';
import { BadRequestError, NotFoundError } from '../../core/errors/HttpError'; 

const getJobOffers = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const page = parseInt(req.query.page as string) || 1;
        
        // je vérifie si la page est un nombre positif valide
        if (page < 1) {
            throw new BadRequestError("Le numéro de page doit être un entier positif.");
        }

        const limit = 50;
        const offset = (page - 1) * limit;
        
        // récupère 51 offres au lieu de 50 pour anticiper la page suivante
        const [rows] = await pool.execute<any[]>(
            "SELECT PK_id, name, contract_type, city, country, company FROM Job_Offers ORDER BY publish_date DESC LIMIT ? OFFSET ?",
            [limit + 1, offset]
        );

        //typage des lignes reçues pour pouvoir manipuler le tableau
        const offers = rows as any[]; 

        if(offers.length === 0 && page > 1) {
            throw new NotFoundError("Aucune offre d'emploi trouvée pour cette page.");
        }
        
        // détermine si la fin de la table est atteinte
        const isTheEnd = offers.length <= limit;

        if (!isTheEnd) {
            // vire le 51ème élément bonus si il existe
            offers.pop();
        }
        
        // renvoie la réponse bien structurée au client
        res.json({
            job_offers: offers,
            is_the_end: isTheEnd
        });
    }
    catch (error) {
        next(error);
    }
};

const getJobOfferById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) throw new BadRequestError("Identifiant d'offre manquant.");
        if (typeof id !== 'string' || id.trim() === '') {
            throw new BadRequestError("Identifiant d'offre invalide.");
        }

        const [rows] = await pool.execute<any[]>(
            "SELECT * FROM Job_Offers WHERE PK_content_hash = ?;",
            [id]
        );

        const offer = (rows as any[])[0] as any;

        if (!offer) {
            throw new NotFoundError("L'offre d'emploi demandée n'a pas été trouvée.");
        }

        res.json(offer);
    }
    catch (error) {
        next(error);
    }
};

export { getJobOffers, getJobOfferById };