import bcrypt from "bcrypt";
import { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { generatememberToken, TokenMember } from "../../core/utils/authUtility";
import { z } from "zod";
import { member } from "../members/member.schema";
import jwtTool from 'jsonwebtoken';
import { ConflictError, UnauthorizedError, NotFoundError, InternalServerError } from '../../core/errors/HttpError';

type ValidatedMemberData = z.infer<typeof member>;

export class AuthService {
    private pool: Pool;

    // DI
    constructor(dbPool: Pool) {
        this.pool = dbPool;
    }
    
    async register(validatedData: ValidatedMemberData) {
        const connection = await this.pool.getConnection();

        try {
            // verifie le mail en premier
            const [existingMembers] = await connection.execute<RowDataPacket[]>(
                "SELECT PK_id FROM User_ WHERE email = ?",
                [validatedData.email]
            );

            const [existingMembersByUsername] = await connection.execute<RowDataPacket[]>(
                "SELECT PK_id FROM User_ WHERE username = ?",
                [validatedData.username]
            );

            if (existingMembersByUsername.length > 0) {
                throw new ConflictError("USERNAME_EXISTS");
            }

            if (existingMembers.length > 0) {
                throw new ConflictError("EMAIL_EXISTS");
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

    async login(username: string, password: string) {
        const connection = await this.pool.getConnection();

        try {
            // récupère l'user par son username
            const [rows] = await connection.execute<RowDataPacket[]>(
                "SELECT PK_id, hashed_password, FK_role_id FROM User_ WHERE username = ?",
                [username]
            );

            if (rows.length === 0) {
                throw new NotFoundError("USER_NOT_FOUND");
            }
            // typage strict pour typescript
            const user = rows[0] as any;
            const isPasswordValid = await bcrypt.compare(password, user.hashed_password);
            const isUsernameValid = user.username === username;

            if (!isPasswordValid || !isUsernameValid) {
                throw new UnauthorizedError("INVALID_CREDENTIALS");
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

    async logout(token: string) {
    const connection = await this.pool.getConnection();
    try {
        const decoded = jwtTool.verify(token, process.env.JWT_SECRET as string) as TokenMember;

        await connection.execute(
            "UPDATE User_ SET last_connection = NOW() WHERE PK_id = ?",
            [decoded.id]
        );


        await connection.execute(
            "INSERT INTO BlacklistedTokens (token, blacklisted_at) VALUES (?, NOW())",
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
