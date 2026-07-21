import bcrypt from "bcrypt";
import { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { generatememberToken, TokenMember } from "../../core/utils/authUtility";
import { z } from "zod";
import { member } from "../members/member.schema";
import jwtTool from 'jsonwebtoken';
import { ConflictError, UnauthorizedError, NotFoundError, InternalServerError, BadRequestError } from '../../core/errors/HttpError';

type ValidatedMemberData = z.infer<typeof member>;

export class AuthService {
    private pool: Pool;

    // Depedance Injection du pool de connexion à la base de données pour permettre l'accès aux méthodes de la classe AuthService.
    constructor(dbPool: Pool) {
        this.pool = dbPool;
    }
    /**
     * Enregistre un nouveau membre dans la base de données.
     * Vérifie si l'email ou le nom d'utilisateur existe déjà.
     * Si non, hache le mot de passe et insère les données du membre dans la base.
     * Génère un token JWT pour le membre enregistré.
     * @param validatedData - Les données validées du membre à enregistrer.
     * @returns Un token JWT pour le membre enregistré.
     * @throws ConflictError si l'email ou le nom d'utilisateur existe déjà.
     * @throws InternalServerError si une erreur survient lors de l'enregistrement.
     */
    async register(validatedData: ValidatedMemberData) {
        const connection = await this.pool.getConnection();

        try {

            const [bannedRows] = await connection.execute(
            "SELECT 1 FROM Banned WHERE email = ?",
            [validatedData.email]
            ) as [RowDataPacket[], any];

            if (bannedRows.length > 0) {
            throw new BadRequestError("Les champs de formulaire ne sont pas conformes");
            }
            // verifie le mail en premier
            const [existingMembers] = await connection.execute<RowDataPacket[]>(
                "SELECT PK_id FROM User_ WHERE email = ?",
                [validatedData.email]
            );

            const [existingMembersByUsername] = await connection.execute<RowDataPacket[]>(
                "SELECT PK_id FROM User_ WHERE username = ?",
                [validatedData.username]
            );

            if (existingMembersByUsername.length > 0 || existingMembers.length > 0) {
                throw new ConflictError("USER_ALREADY_EXISTS");
            }

            // hashage
            const hashedPassword = await bcrypt.hash(validatedData.password, 10);
        
            const currentDate = new Date().toISOString().split('T')[0]; 

            const [result] = await connection.execute<ResultSetHeader>(
                {
                    sql: "INSERT INTO User_ (email, hashed_password, FK_role_id, firstname, lastname, username, biography, profil_pic_link, creation_date, last_connection) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    values: [
                        validatedData.email,
                        hashedPassword,
                        validatedData.role,
                        validatedData.firstname,
                        validatedData.lastname,
                        validatedData.username,
                        validatedData.biography || null,
                        validatedData.profil_pic_link || null,
                        currentDate,
                        currentDate
                    ]
                }
            );

            // génération du token
            const tokenPayload: TokenMember = {
                id: result.insertId,
                role: validatedData.role,
                isFirstLogin: true
            };

            return generatememberToken(tokenPayload);

        } finally {
            if(connection) {
                connection.release();
            }
        }
    }
    /**
     * Authentifie un membre en vérifiant son nom d'utilisateur et son mot de passe.
     * Si les identifiants sont corrects, génère un token JWT pour le membre.
     * @param username - Le nom d'utilisateur du membre.
     * @param password - Le mot de passe du membre.
     * @returns Un token JWT pour le membre authentifié.
     * @throws UnauthorizedError si les identifiants sont incorrects.
     * @throws InternalServerError si une erreur survient lors de l'authentification.
     */
    async login(username: string, password: string) {
    const connection = await this.pool.getConnection();

    try {

            const [bannedRows] = await connection.execute(
        "SELECT 1 FROM Banned WHERE username = ?",
        [username]
        ) as [RowDataPacket[], any];

        if (bannedRows.length > 0) {
        throw new BadRequestError("Les champs de formulaire n'est pas conforme");
        }
        // ajoute username
        const [rows] = await connection.execute<RowDataPacket[]>(
            "SELECT PK_id, username, hashed_password, FK_role_id FROM User_ WHERE username = ?",
            [username]
        );

        if (rows.length === 0) {
            throw new UnauthorizedError("Identifiants incorrects.");
        }
        
        const user = rows[0] as any;
        
        const isUsernameValid = user.username === username;
        const isPasswordValid = await bcrypt.compare(password, user.hashed_password);

        if (!isPasswordValid || !isUsernameValid) {
            throw new UnauthorizedError("Identifiants incorrects.");
        }

        const tokenPayload: TokenMember = {
            id: user.PK_id,
            role: user.FK_role_id,
            isFirstLogin: false
        };

        return generatememberToken(tokenPayload);

    } finally {
        if(connection) {
            connection.release();
        }
    }
}
    /**
     * Déconnecte un membre en ajoutant son token JWT à la liste noire.
     * Met à jour la date de dernière connexion du membre dans la base de données.
     * @param token - Le token JWT du membre à déconnecter.
     * @returns Un message de succès.
     * @throws InternalServerError si une erreur survient lors de la déconnexion.
     */
    async logout(token: string) {
    const connection = await this.pool.getConnection();
    try {
        const decoded = jwtTool.verify(token, process.env.JWT_SECRET as string) as TokenMember;

        await connection.execute(
            "UPDATE User_ SET last_connection = NOW() WHERE PK_id = ?",
            [decoded.id]
        );


        await connection.execute(
            "INSERT INTO Blacklist (token, blacklisted_at) VALUES (?, NOW())",
            [token]
        );

    } catch (sqlError: any) {
            if (sqlError.errno !== 1062) {
                throw new InternalServerError("Échec de la mise en liste noire du token.");
            }
        }
    finally {
        if(connection) {
            connection.release();
        }
    }
    return { message: "Déconnexion réussie." };
}
}
