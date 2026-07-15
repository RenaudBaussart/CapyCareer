import { Pool, RowDataPacket } from "mysql2/promise";

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
                throw new Error("NO_MEMBERS_FOUND");
            }

            return visibleMembers;
        } finally {
            connection.release();
        }
        
    }
}