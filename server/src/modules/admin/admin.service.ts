import { Pool, RowDataPacket } from "mysql2/promise";
import { ConflictError, UnauthorizedError, NotFoundError, InternalServerError, BadRequestError } from '../../core/errors/HttpError';

export class AdminService {
    private pool: Pool;

    // DI
    constructor(dbPool: Pool) {
        this.pool = dbPool;
    }
    /**
     * Dictionnaire des rôles valides pour la récupération des membres par rôle.
     * Les clés sont les noms des rôles en minuscules, et les valeurs sont les mêmes.
     * Cela permet de valider le rôle fourni et de le mapper à la valeur attendue dans la base de données.
     * @private
     * @readonly
     * @type {Record<string, string>}
     * @memberof AdminService
     */
    private readonly ROLE_MAP: Record<string, string> = {
        'candidat': "candidat",
        'entreprise': "entreprise",
        'admin': "admin"
    };

    /**
     * Récupère tous les profils des membres de la base de données.
     * @param excludedMemberId (optionnel) L'ID du membre à exclure de la liste.
     * @returns Une promesse qui résout un tableau d'objets représentant les profils des membres.
     * @throws Une erreur si aucun membre n'est trouvé ou si une erreur de base de données se produit.
     */
    async getAllMembers(excludedMemberId?: number) {
        const connection = await this.pool.getConnection();
        try {            
            const [rows] = await connection.execute<RowDataPacket[]>(
                "SELECT PK_id, email, FK_role_id, firstname, lastname, username, biography, profil_pic_link, creation_date, last_connection FROM User_", 
            );

            const members = rows.map(row => ({
                id: row.PK_id,
                email: row.email,
                role: row.FK_role_id,
                firstname: row.firstname,
                lastname: row.lastname,
                username: row.username,
                biography: row.biography,
                profil_pic_link: row.profil_pic_link,
                creation_date: row.creation_date,
                last_connection: row.last_connection
            }));
            // pour filtrer l'admin actuel qui regarde la liste
            const visibleMembers = excludedMemberId
                ? members.filter(member => member.id !== excludedMemberId)
                : members;

            if (visibleMembers.length === 0) {
                throw new NotFoundError("NO_MEMBERS_FOUND");
            }

            return visibleMembers;
        } finally {
            connection.release();
        }
        
    }
    /**
     * Récupère les profils des membres filtrés par rôle.
     * @param roleName Le nom du rôle pour filtrer les membres.
     * @param excludedMemberId (optionnel) L'ID du membre à exclure de la liste.
     * @returns Une promesse qui résout un tableau d'objets représentant les profils des membres filtrés par rôle.
     * @throws BadRequestError si le rôle fourni n'est pas valide.
     * @throws NotFoundError si aucun membre n'est trouvé pour le rôle spécifié.
     * @throws InternalServerError si une erreur de base de données se produit.
     */
    async getMemberByRoleName(roleName: string, excludedMemberId?: number) {
        const roleStr = this.ROLE_MAP[roleName.toLowerCase()];

        if (!roleStr) {
            throw new BadRequestError("Rôle invalide. Utilisez 'admin', 'candidat' ou 'entreprise'.");
        }

        const connection = await this.pool.getConnection();
        try {
            const [rows] = await connection.execute(
                "SELECT PK_id, email, FK_role_id, firstname, lastname, username, biography, profil_pic_link, creation_date, last_connection FROM User_ WHERE FK_role_id = ?", 
                [roleStr]
            );

        const memberRows = rows as RowDataPacket[];

        let members = memberRows.map(row => ({
            id: row.PK_id,
            email: row.email,
            role: row.FK_role_id,
            firstname: row.firstname,
            lastname: row.lastname,
            username: row.username,
            biography: row.biography,
            profil_pic_link: row.profil_pic_link,
            creation_date: row.creation_date,
            last_connection: row.last_connection
        }));

        if (excludedMemberId) {
            members = members.filter(member => member.id !== excludedMemberId);
        }

        if (members.length === 0) {
            throw new NotFoundError("Aucun membre trouvé pour ce rôle.");
        }

        return members;
        } finally {
            connection.release();
        }
    }
}