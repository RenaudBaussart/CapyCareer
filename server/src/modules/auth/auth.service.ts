import bcrypt from "bcrypt";
import { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { generatememberToken, TokenMember } from "../../core/utils/authUtility";
import { z } from "zod";
import { member } from "../members/member.schema";

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
            // on verifie le mail en premier
            const [existingMembers] = await connection.execute<RowDataPacket[]>(
                "SELECT PK_id FROM User_ WHERE email = ?",
                [validatedData.email]
            );

            if (existingMembers.length > 0) {
                throw new Error("EMAIL_EXISTS");
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
            const [rows] = await connection.execute<RowDataPacket[]>(
                "SELECT PK_id, hashed_password, FK_role_id FROM User_ WHERE username = ?",
                [username]
            );

            if (rows.length === 0) {
                throw new Error("USER_NOT_FOUND");
            }

            const user = rows[0] as any;
            const isPasswordValid = await bcrypt.compare(password, user.hashed_password);

            if (!isPasswordValid) {
                throw new Error("INVALID_PASSWORD");
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
}