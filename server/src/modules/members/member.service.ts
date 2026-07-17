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