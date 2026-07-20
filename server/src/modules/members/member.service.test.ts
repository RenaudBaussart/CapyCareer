import { MemberService } from "./member.service";
import { Pool } from "mysql2/promise";
import bcrypt from "bcrypt";
import { NotFoundError, ConflictError } from "../../core/errors/HttpError";

jest.mock("bcrypt");

describe("MemberService", () => {
    let memberService: MemberService;
    let mockConnection: any;
    let mockPool: any;

    beforeEach(() => {
        mockConnection = {
            execute: jest.fn(),
            release: jest.fn(),
            beginTransaction: jest.fn(),
            commit: jest.fn(),
            rollback: jest.fn()
        };
        
        mockPool = {
            getConnection: jest.fn().mockResolvedValue(mockConnection),
        };

        memberService = new MemberService(mockPool as unknown as Pool);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    describe("getMemberById", () => {
        describe("Cas d'erreurs", () => {
            it("devrait lancer une erreur si la requête échoue", async () => {
                const errorMessage = "Erreur de base de données";
                mockConnection.execute.mockRejectedValueOnce(new Error(errorMessage));

                await expect(memberService.getMemberById(1)).rejects.toThrow(errorMessage);
                expect(mockConnection.release).toHaveBeenCalled();
            });

            it("devrait lancer NotFoundError si aucun membre n'est trouvé", async () => {
                mockConnection.execute.mockResolvedValueOnce([[]]);

                await expect(memberService.getMemberById(1)).rejects.toThrow(NotFoundError);
                expect(mockConnection.release).toHaveBeenCalled();
            });
        });

        describe("Cas de succès", () => {
            it("devrait retourner le profil du membre si la requête réussit", async () => {
                const dbRow = { PK_id: 1, email: "john.doe@example.com", FK_role_id: "candidat", firstname: "John", lastname: "Doe", username: "johndoe", biography: "I am John Doe", profil_pic_link: "https://example.com/johndoe.jpg", creation_date: new Date(), last_connection: new Date() };
                mockConnection.execute.mockResolvedValueOnce([[dbRow]]);

                const result = await memberService.getMemberById(1);

                expect(mockConnection.execute).toHaveBeenCalledWith(
                    "SELECT PK_id, email, FK_role_id, firstname, lastname, username, biography, profil_pic_link, creation_date, last_connection FROM User_ WHERE PK_id = ?", 
                    [1]
                );

                expect(result).toEqual({
                    id: dbRow.PK_id,
                    email: dbRow.email,
                    role: dbRow.FK_role_id,
                    firstname: dbRow.firstname,
                    lastname: dbRow.lastname,
                    username: dbRow.username,
                    biography: dbRow.biography,
                    profil_pic_link: dbRow.profil_pic_link,
                    creation_date: dbRow.creation_date,
                    last_connection: dbRow.last_connection
                });

                expect(mockConnection.release).toHaveBeenCalled();
            });
        });
    });


    describe("modifyYourProfile", () => {
        beforeEach(() => {
            mockConnection.execute.mockImplementation(async (query: string) => {
                if (query.includes("SELECT 1 FROM Banned")) return [[]]; 
                if (query.includes("SELECT 1 FROM User_ WHERE email = ? AND PK_id !=")) return [[]]; 
                if (query.includes("SELECT 1 FROM User_ WHERE username = ? AND PK_id !=")) return [[]]; 
                return [[{ affectedRows: 1 }]]; 
            });
        });

        describe("Cas de succès", () => {
            it("devrait mettre à jour uniquement le profil public (sans mot de passe ni email)", async () => {
                const result = await memberService.modifyYourProfile(1, { firstname: "Jean", lastname: "Dupont" });
                
                expect(result).toEqual({ message: "Profil mis à jour avec succès." });
                expect(mockConnection.beginTransaction).toHaveBeenCalled();
                expect(mockConnection.execute).toHaveBeenCalledWith(
                    expect.stringContaining("UPDATE User_ SET firstname = ?, lastname = ? WHERE PK_id = ?"),
                    ["Jean", "Dupont", 1]
                );
                expect(mockConnection.commit).toHaveBeenCalled();
                expect(mockConnection.rollback).not.toHaveBeenCalled();
            });

            it("devrait hasher et mettre à jour le mot de passe", async () => {
                (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPwd123");

                await memberService.modifyYourProfile(1, { newPassword: "MonNouveauMotDePasse1/" });

                expect(bcrypt.hash).toHaveBeenCalledWith("MonNouveauMotDePasse1/", 10);
                expect(mockConnection.execute).toHaveBeenCalledWith(
                    "UPDATE User_ SET hashed_password = ? WHERE PK_id = ?",
                    ["hashedPwd123", 1]
                );
                expect(mockConnection.commit).toHaveBeenCalled();
            });
        });

        describe("Cas d'erreurs et conflits", () => {
            it("devrait lancer ConflictError si l'email est déjà banni", async () => {
                mockConnection.execute.mockImplementation(async (query: string) => {
                    if (query.includes("SELECT 1 FROM Banned WHERE email")) return [[{ 1: 1 }]]; // Banni !
                    return [[]];
                });

                await expect(memberService.modifyYourProfile(1, { email: "banned@test.com" })).rejects.toThrow(ConflictError);
                expect(mockConnection.rollback).toHaveBeenCalled();
            });

            it("devrait lancer ConflictError si le pseudo est déjà utilisé par un autre", async () => {
                mockConnection.execute.mockImplementation(async (query: string) => {
                    if (query.includes("SELECT 1 FROM Banned")) return [[]];
                    if (query.includes("SELECT 1 FROM User_ WHERE username = ? AND PK_id !=")) return [[{ 1: 1 }]]; // Déjà pris !
                    return [[]];
                });

                await expect(memberService.modifyYourProfile(1, { username: "PrisParUnAutre" })).rejects.toThrow(ConflictError);
                expect(mockConnection.rollback).toHaveBeenCalled();
            });

            it("devrait lancer NotFoundError si le profil à modifier n'existe plus en base (affectedRows = 0)", async () => {
                mockConnection.execute.mockImplementation(async (query: string) => {
                    if (query.includes("UPDATE User_ SET")) {
                        const result: any = [];
                        result.affectedRows = 0; 
                        return [result];
                    }
                    return [[]];
                });

                await expect(memberService.modifyYourProfile(999, { firstname: "Fantôme" })).rejects.toThrow(NotFoundError);
                expect(mockConnection.rollback).toHaveBeenCalled();
            });

            it("devrait faire un rollback si une erreur inattendue survient", async () => {
                mockConnection.execute.mockRejectedValueOnce(new Error("Crash BDD"));

                await expect(memberService.modifyYourProfile(1, { firstname: "Test" })).rejects.toThrow("Crash BDD");
                expect(mockConnection.rollback).toHaveBeenCalled();
                expect(mockConnection.release).toHaveBeenCalled();
            });
        });
    });
});