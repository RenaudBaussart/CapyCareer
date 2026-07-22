import { Pool, RowDataPacket } from "mysql2/promise";
import { ConflictError, UnauthorizedError, NotFoundError, InternalServerError, BadRequestError } from '../../core/errors/HttpError';


export class CandidatService {
    private pool: Pool;

    constructor(dbPool: Pool) {
        this.pool = dbPool;
    }

    private readonly ROLE_MAP: Record<string, string> = {
        'candidat': "candidat",
        'entreprise': "entreprise",
        'admin': "admin"
    };
    /**
     * Redirige l'utilisateur vers le site de l'offre d'emploi en fonction de l'ID du job.
     * @param jobId - L'ID de l'offre d'emploi.
     * @param candidateId - L'ID du candidat.
     * @returns L'URL du site de l'offre d'emploi.
     * @throws NotFoundError si l'offre d'emploi ou le candidat n'existe pas.
     * @throws ConflictError si le candidat a déjà postulé à cette offre.
     * @throws UnauthorizedError si l'utilisateur n'a pas le rôle de candidat.
     * @throws InternalServerError pour toute autre erreur de serveur.
     */
    async redirectToSite(jobId: number, candidateId: number){
        const connection = await this.pool.getConnection();
        try {
            const jobExists = await this.checkIfJobOfferExists(jobId);
            if (!jobExists) {
                throw new NotFoundError("JOB_OFFER_NOT_FOUND");
            }

            const candidateExists = await this.checkIfCandidateExists(candidateId);
            if (!candidateExists) {
                throw new NotFoundError("CANDIDATE_NOT_FOUND");
            }

            const alreadyApplied = await this.checkIfAlreadyApplied(candidateId, jobId);
            if (alreadyApplied) {
                throw new ConflictError("ALREADY_APPLIED");
            }

            const isCandidateRole = await this.checkIfRoleIsCandidate(candidateId);
            if (!isCandidateRole) {
                throw new UnauthorizedError("USER_NOT_CANDIDATE");
            }

            const [rows] = await connection.execute(
                "SELECT url FROM Job_Offers WHERE PK_id = ?",
                [jobId]
            );

            if ((rows as RowDataPacket[]).length === 0) {
                throw new NotFoundError("JOB_OFFER_NOT_FOUND");
            }

            const jobOffer = (rows as RowDataPacket[])[0];
            return jobOffer!.url;

        } finally {
            connection.release();
        }
    }
    /**
     * Vérifie si une offre d'emploi existe dans la base de données.
     * @param jobId - L'ID de l'offre d'emploi à vérifier.
     * @returns true si l'offre existe, false sinon.
     */
    private async checkIfJobOfferExists(jobId: number) {
        const connection = await this.pool.getConnection();
        try {
            const [rows] = await connection.execute(
                "SELECT 1 FROM Job_Offers WHERE PK_id = ?",
                [jobId]
            );
            return (rows as RowDataPacket[]).length > 0;
        } finally {
            connection.release();
        }
    }
    /**
     * Vérifie si un candidat existe dans la base de données.
     * @param candidateId - L'ID du candidat à vérifier.
     * @returns true si le candidat existe, false sinon.
     */
    private async checkIfCandidateExists(candidateId: number) {
        const connection = await this.pool.getConnection();
        try {
            const [rows] = await connection.execute(
                "SELECT 1 FROM User_ WHERE PK_id = ?",
                [candidateId]
            );
            return (rows as RowDataPacket[]).length > 0;
        } finally {
            connection.release();
        }
    }
    /**
     * Vérifie si un candidat a déjà postulé à une offre d'emploi spécifique.
     * @param candidateId - L'ID du candidat.
     * @param jobId - L'ID de l'offre d'emploi.
     * @returns true si le candidat a déjà postulé, false sinon.
     */
    private async checkIfAlreadyApplied(candidateId: number, jobId: number) {
        const connection = await this.pool.getConnection();
        try {
            const [rows] = await connection.execute(
                "SELECT 1 FROM Applied WHERE FK_user_id = ? AND FK_job_offer_id = ?",
                [candidateId, jobId]
            );
            return (rows as RowDataPacket[]).length > 0;
        } finally {
            connection.release();
        }
    }
    /**
     * Vérifie si l'utilisateur a le rôle de candidat.
     * @param candidateId - L'ID du candidat à vérifier.
     * @returns true si l'utilisateur est un candidat, false sinon.
     */
    private async checkIfRoleIsCandidate(candidateId: number) {
        const connection = await this.pool.getConnection();
        try {
            const [rows] = await connection.execute(
                "SELECT 1 FROM User_ WHERE PK_id = ? AND FK_role_id = ?",
                [candidateId, this.ROLE_MAP['candidat'] as string]
            );
            return (rows as RowDataPacket[]).length > 0;
        } finally {
            connection.release();
        }
    }
}