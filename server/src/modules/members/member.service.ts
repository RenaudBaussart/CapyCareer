import { Pool, RowDataPacket } from "mysql2/promise";
import bcrypt from "bcrypt";
import { ConflictError, NotFoundError, InternalServerError } from '../../core/errors/HttpError';

export class MemberService {
    private pool: Pool;

    // DI
    constructor(dbPool: Pool) {
        this.pool = dbPool;
    }
      
    /**
     * Récupère le profil d'un membre spécifique par son ID.
     */
    async getMemberById(memberId: number) {
        const connection = await this.pool.getConnection();
        
        try {
            const [rows] = await connection.execute(
                "SELECT PK_id, email, FK_role_id, firstname, lastname, username, biography, profil_pic_link, creation_date, last_connection FROM User_ WHERE PK_id = ?", 
                [memberId] 
            );
            const typedRows = rows as RowDataPacket[];

            if (typedRows.length === 0) {
                throw new NotFoundError("MEMBER_NOT_FOUND"); 
            }

            const member = typedRows[0]!;

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

    /**
     * Met à jour le profil du membre (incluant la sécurité et le mot de passe).
     */
    async modifyYourProfile(memberId: number, profileData: Record<string, any>) {
        const connection = await this.pool.getConnection();
    
        try {
            await connection.beginTransaction();

            const passwordToUpdate = profileData.newPassword || profileData.password;
            if (passwordToUpdate) {
                await this.modifyPassword(connection, memberId, passwordToUpdate);
            }

            if (profileData.email) {
                await this.checkEmailAvailability(connection, memberId, profileData.email);
            }
            if (profileData.username) {
                await this.checkUsernameAvailability(connection, memberId, profileData.username);
            }

            const excludedKeys = ['newPassword', 'password', 'role'];
            const updateFields = Object.keys(profileData).filter(
                key => profileData[key] !== undefined && !excludedKeys.includes(key)
            );

            if (updateFields.length > 0) {
                const setClause = updateFields.map(field => `${field} = ?`).join(", ");
                const values = updateFields.map(field => profileData[field]);

                const [result] = await connection.execute(
                    `UPDATE User_ SET ${setClause} WHERE PK_id = ?`,
                    [...values, memberId]
                );
        
                if ((result as any).affectedRows === 0) {
                    throw new NotFoundError("MEMBER_NOT_FOUND");
                }
            }
    
            await connection.commit();
            return { message: "Profil mis à jour avec succès." };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }



    private async modifyPassword(connection: any, memberId: number, newPassword: string) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const [result] = await connection.execute(
            "UPDATE User_ SET hashed_password = ? WHERE PK_id = ?",
            [hashedPassword, memberId]
        );
        if ((result as any).affectedRows === 0) {
            throw new NotFoundError("MEMBER_NOT_FOUND");
        }
    }

    private async checkEmailAvailability(connection: any, memberId: number, email: string) {
        const [banned] = await connection.execute("SELECT 1 FROM Banned WHERE email = ?", [email]);
        if ((banned as RowDataPacket[]).length > 0) throw new ConflictError("L'utilisateur est banni.");

        const [exists] = await connection.execute("SELECT 1 FROM User_ WHERE email = ? AND PK_id != ?", [email, memberId]);
        if ((exists as RowDataPacket[]).length > 0) throw new ConflictError("Cet utilisateur est déjà enregistré.");
    }

    private async checkUsernameAvailability(connection: any, memberId: number, username: string) {
        const [banned] = await connection.execute("SELECT 1 FROM Banned WHERE username = ?", [username]);
        if ((banned as RowDataPacket[]).length > 0) throw new ConflictError("L'utilisateur est banni.");

        const [exists] = await connection.execute("SELECT 1 FROM User_ WHERE username = ? AND PK_id != ?", [username, memberId]);
        if ((exists as RowDataPacket[]).length > 0) throw new ConflictError("Cet utilisateur est déjà enregistré.");
    }
}