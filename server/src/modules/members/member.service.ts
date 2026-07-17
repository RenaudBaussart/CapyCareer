import { Pool, RowDataPacket } from "mysql2/promise";
import jwtTool from 'jsonwebtoken';
import { ConflictError, UnauthorizedError, NotFoundError, InternalServerError } from '../../core/errors/HttpError';

export class MemberService {
    private pool: Pool;

    // DI
    constructor(dbPool: Pool) {
        this.pool = dbPool;
    }
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
     * Récupère le profil d'un membre spécifique par son ID.
     * @param memberId L'ID du membre à récupérer.
     * @returns Une promesse qui résout un objet représentant le profil du membre.
     * @throws NotFoundError si aucun membre n'est trouvé avec l'ID fourni.
     * @throws InternalServerError si une erreur de base de données se produit.
     */
    async getMemberById(memberId: number) {
    const connection = await this.pool.getConnection();
    
    try {
        const [rows] = await connection.execute<RowDataPacket[]>(
            "SELECT PK_id, email, FK_role_id, firstname, lastname, username, biography, profil_pic_link, creation_date, last_connection FROM User_ WHERE PK_id = ?", 
            [memberId] 
        );

        if (rows.length === 0) {
            throw new NotFoundError("MEMBER_NOT_FOUND"); 
        }

        const member = rows[0] as RowDataPacket;

        return {
            id: member.PK_id,
            email: member.email,
            role: member.FK_role_id,
            firstname: member.firstname,
            lastname: member.lastname,
            username: member.username,
            biography: member.biography,
            profil_pic_link: member.profil_pic_link,
            creation_date: member.creation_date,
            last_connection: member.last_connection
        };
    } finally {
        connection.release();
    }
}
}