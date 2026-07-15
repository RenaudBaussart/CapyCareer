import { Pool, RowDataPacket } from "mysql2/promise";

export class MemberService {
    private pool: Pool;

    // DI
    constructor(dbPool: Pool) {
        this.pool = dbPool;
    }

    /**
     * Récupère tous les profils des membres de la base de données.
     * @returns {Promise<Array>} Une promesse qui résout un tableau d'objets représentant les profils des membres.
     * @throws {Error} Lance une erreur si aucun membre n'est trouvé ou si la requête échoue.
     */
    async getAllMembers() {
        const connection = await this.pool.getConnection();
        try {
            const [rows] = await connection.execute<RowDataPacket[]>(
                "SELECT PK_id, email, FK_role_id, firstname, lastname, username, biography, profil_pic_link, creation_date, last_connection FROM User_", 
            );

            if (rows.length === 0) {
                throw new Error("NO_MEMBERS_FOUND");
            }
            

            return rows.map(row => ({
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
        } finally {
            connection.release();
        }
        
    }
}