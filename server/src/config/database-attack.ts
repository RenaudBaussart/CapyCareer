import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { env } from "./env";

dotenv.config();

export const attackPool = mysql.createPool({
    host: env.ATTACK_DB_HOST,
    user: env.ATTACK_DB_USER,
    password: env.ATTACK_DB_PASSWORD,
    database: env.ATTACK_DB_NAME,
    port: env.ATTACK_DB_PORT,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
});