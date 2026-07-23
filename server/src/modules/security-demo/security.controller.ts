import { Request, Response } from "express";
import { attackPool } from "../../config/database-attack"; 
import bycrypt from "bcrypt";

/**
 * Cette fonction est un exemple de démonstration d'une vulnérabilité d'injection SQL lors de la connexion d'un utilisateur.
 * Elle prend un nom d'utilisateur en entrée, puis construit une requête SQL vulnérable à l'injection SQL. 
 * Si l'utilisateur est trouvé, elle renvoie un message de succès. Sinon, elle renvoie un message d'erreur.
 */
export async function insecureLoginDemo(req: Request, res: Response) {
    const { username } = req.body;

    try {
        const sql = `SELECT PK_id, username, hashed_password FROM User_ WHERE username = '${username}'`;
        
        console.log("⚠️ Requête exécutée (Vulnérable) :", sql);

        const [rows]: any = await attackPool.query(sql);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Utilisateur non trouvé" });
        }

        const user = rows;

        return res.status(200).json({
            message: "⚠️ Succès de l'attaque ! L'injection SQL a fonctionné.",
            userFound: user
        });

    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

/**
 * Cette fonction est un exemple de démonstration d'une vulnérabilité d'injection SQL lors de l'enregistrement d'un utilisateur.
 * Elle prend un nom d'utilisateur, un email, un mot de passe, un prénom et un nom de famille en entrée,
 * puis construit une requête SQL vulnérable à l'injection SQL. Si l'utilisateur est créé avec succès,
 * elle renvoie un message de succès. Sinon, elle renvoie un message d'erreur.
 */
export async function insecureRegisterDemo(req: Request, res: Response) {
    const { username, email, password, firstname, lastname, role } = req.body;

    try {
        const hashedPassword = await bycrypt.hash(password, 10);

        const sql = `INSERT INTO User_ (username, email, hashed_password, firstname, lastname, FK_role_id, creation_date, last_connection) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`;
        await attackPool.query(sql, [username, email, hashedPassword, firstname, lastname, role || "candidat"]);

        return res.status(201).json({
            message: "⚠️ Utilisateur créé avec des données non nettoyées dans le prénom/nom !",
            savedFirstname: firstname,
            savedLastname: lastname
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

/**
 * Démonstration d'une attaque par force brute.
 * Elle vérifie à la fois le username et le password de manière non sécurisée (concaténation SQL).
 */
export async function bruteForceLoginDemo(req: Request, res: Response) {
    const { username, password } = req.body;

    try {
        const sql = `SELECT PK_id, username, hashed_password FROM User_ WHERE username = '${username}' AND hashed_password = '${password}'`;
        
        console.log("⚠️ Requête Force Brute exécutée :", sql);

        const [rows]: any = await attackPool.query(sql);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        return res.status(200).json({
            message: "⚠️ Succès du Brute Force ! Le mot de passe a été trouvé.",
            userFound: rows[0]
        });

    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}