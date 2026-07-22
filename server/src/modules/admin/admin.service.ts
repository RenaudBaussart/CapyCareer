import { Pool, RowDataPacket } from "mysql2/promise";
import bcrypt from "bcrypt";
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

    async banMember(email: string) {
        const connection = await this.pool.getConnection();

        try {
            await connection.beginTransaction();

            const [rows] = await connection.execute<RowDataPacket[]>(
                "SELECT PK_id, username, FK_role_id FROM User_ WHERE email = ?",
                [email]
            );

            if (email.trim() === "") {
                throw new BadRequestError("L'adresse e-mail ne peut pas être vide.");
            }

            if (!email) {
                throw new BadRequestError("L'adresse e-mail est requise pour bannir un membre.");
            }

            if (rows.length === 0) {
                throw new NotFoundError("MEMBER_NOT_FOUND");
            }

            if (rows[0]!.FK_role_id === 'admin') {
                throw new BadRequestError("Impossible de bannir un autre administrateur.");
            }

            await connection.execute(
                "INSERT INTO Banned (email, username, banned_at) VALUES (?, ?, NOW())",
                [email, rows[0]!.username]
            );


            await connection.execute("DELETE FROM User_ WHERE email = ?", [email]);

            await connection.commit();
            return { message: "Membre banni et supprimé avec succès." };

        } catch (error) {
            // annuler la transaction en cas d'erreur
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

    }

    /**
     * Débannit un membre en supprimant son email de la table Banned.
     * @param email - L'adresse e-mail du membre à débannir.
     * @returns Un message de succès.
     * @throws NotFoundError si l'email n'est pas trouvé dans la table Banned.
     * @throws InternalServerError si une erreur survient lors du débannissement.
     */
    async unbanMember(email: string) {
        const connection = await this.pool.getConnection();

        try {
            await connection.beginTransaction();

            const [rows] = await connection.execute<RowDataPacket[]>(
                "SELECT PK_banned_id FROM Banned WHERE email = ?",
                [email]
            );

            if (email.trim() === "") {
                throw new BadRequestError("L'adresse e-mail ne peut pas être vide.");
            }

            if (!email) {
                throw new BadRequestError("L'adresse e-mail est requise pour débannir un membre.");
            }

            if (rows.length === 0) {
                throw new NotFoundError("Cet email n'est pas dans la liste des bannis.");
            }

            await connection.execute(
                "DELETE FROM Banned WHERE email = ?",
                [email]
            );

            await connection.commit();
            return { message: "Membre débanni avec succès. Il peut désormais recréer un compte." };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async updateMemberProfile(connection: any, memberId: number, profileData: Record<string, any>) {
        try {
            const [rows] = await connection.execute("SELECT PK_id FROM User_ WHERE PK_id = ?", [memberId]);
            const typedRows = rows as RowDataPacket[];

            if (typedRows.length === 0) throw new NotFoundError("MEMBER_NOT_FOUND");

            const [roleRows] = await connection.execute("SELECT FK_role_id FROM User_ WHERE PK_id = ?", [memberId]);
            const typedRoleRows = roleRows as RowDataPacket[];

            if (typedRoleRows[0]?.FK_role_id === "admin") {
                throw new BadRequestError("Impossible de modifier le profil d'un administrateur.");
            }
            if (profileData.email) {
                await this.validateAndCheckEmailConflict(connection, memberId, profileData.email);
            }

            const excludedKeys = ['newPassword', 'password', 'role'];
            const updateFields = Object.keys(profileData).filter(
                key => profileData[key] !== undefined && !excludedKeys.includes(key)
            );

            if (updateFields.length === 0) {
                return { message: "Profil mis à jour avec succès." };
            }

            const setClause = updateFields.map(field => `${field} = ?`).join(", ");
            const values = updateFields.map(field => profileData[field]);

            await connection.execute(`UPDATE User_ SET ${setClause} WHERE PK_id = ?`, [...values, memberId] as any[]);
            return { message: "Profil mis à jour avec succès." };
        } catch (error) {
            throw error;
        }
    }

    private async validateAndCheckEmailConflict(connection: any, memberId: number, newEmail: string) {
        const [bannedRows] = await connection.execute(
            "SELECT 1 FROM Banned WHERE email = ?",
            [newEmail]
        ) as [RowDataPacket[], any];

        if (bannedRows.length > 0) {
            throw new ConflictError("Cet email est banni et ne peut pas être utilisé.");
        }

        const [rows] = await connection.execute(
            "SELECT PK_id FROM User_ WHERE email = ? AND PK_id != ?",
            [newEmail, memberId]
        ) as [RowDataPacket[], any];

        if (rows.length > 0) {
            throw new ConflictError("Cet email est déjà utilisé par un autre membre.");
        }
    }

    private async changeMemberRole(connection: any, memberId: number, newRole: string) {
        await this.checkMemberExistsAndIsNotAdmin(connection, memberId);

        if (!this.ROLE_MAP[newRole.toLowerCase()]) {
            throw new BadRequestError("Rôle invalide.");
        }

        await connection.execute(
            "UPDATE User_ SET FK_role_id = ? WHERE PK_id = ?",
            [newRole, memberId]
        );
    }

    private async changePassword(connection: any, memberId: number, newPassword: string) {
        await this.checkMemberExistsAndIsNotAdmin(connection, memberId);




        const hashedPassword = await bcrypt.hash(newPassword, 10);



        const [result] = await connection.execute(
            "UPDATE User_ SET hashed_password = ? WHERE PK_id = ?",
            [hashedPassword, memberId]
        );

    }

    private async checkMemberExistsAndIsNotAdmin(connection: any, memberId: number) {
        const [rows] = await connection.execute(
            "SELECT FK_role_id FROM User_ WHERE PK_id = ?",
            [memberId]
        ) as [RowDataPacket[], any];
        if (rows.length === 0) throw new NotFoundError("MEMBER_NOT_FOUND");
        if (rows[0]!.FK_role_id === 'admin') throw new BadRequestError("Impossible de modifier un administrateur.");
        return rows[0];
    }

    public async performAdminUpdate(memberId: number, data: any) {
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();

            await this.checkMemberExistsAndIsNotAdmin(connection, memberId);
            const passwordToUpdate = data.newPassword || data.password;

            if (passwordToUpdate) {
                await this.changePassword(connection, memberId, passwordToUpdate);
            }

            if (data.email || data.firstname || data.lastname || data.biography || data.profil_pic_link) {
                await this.updateMemberProfile(connection, memberId, data);
            }

            if (data.role) {
                await this.changeMemberRole(connection, memberId, data.role);
            }


            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // methode pour cibler les stats des users
    async getUserStats() {
        const connection = await this.pool.getConnection();
        try {
            // compte nbr duser selon le role
            const [rows] = await connection.execute<RowDataPacket[]>(
                "SELECT FK_role_id, COUNT(PK_id) as count FROM User_ GROUP BY FK_role_id"
            );

            // initialise les compteurs
            let candidatsCount = 0;
            let entreprisesCount = 0;

            // boucle map des datas pour set les var
            rows.forEach(row => {
                if (row.FK_role_id === 'candidat') candidatsCount = row.count;
                if (row.FK_role_id === 'entreprise') entreprisesCount = row.count;
            });

            return {
                candidats: candidatsCount,
                entreprises: entreprisesCount
            };
        } finally {
            connection.release();
        }
    }
}


