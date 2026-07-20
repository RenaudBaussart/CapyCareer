import request from "supertest";
import express from "express";
import { getMyProfile, updateMyProfile, deleteMyProfile } from "./member.controller";
import { middlewareAuth } from "../../core/middlewares/authMiddleware";
import jwtTool from "jsonwebtoken";
import { MemberService } from "./member.service";

import { errorHandlerMiddleware } from "../../core/errors/errorHandlerMiddleware";
import { NotFoundError, InternalServerError } from "../../core/errors/HttpError";

jest.mock("./member.service");
jest.mock('jsonwebtoken');

jest.mock("../../core/errors/ErrorsLogger", () => ({
    logErrorToFile: jest.fn()
}));

jest.mock("../../config/database", () => ({
    pool: { execute: jest.fn().mockResolvedValue([[]]) } 
}));

describe("MemberController", () => {
    let app: express.Application;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        
        app.get("/api/members/me", middlewareAuth, getMyProfile);
        
        app.put("/api/members/me", middlewareAuth, updateMyProfile);
        app.patch("/api/members/me/account", middlewareAuth, updateMyProfile);
        app.patch("/api/members/me/password", middlewareAuth, updateMyProfile);

        app.delete("/api/members/me", middlewareAuth, deleteMyProfile);
        
        app.use(errorHandlerMiddleware);
    });

    beforeEach(() => {
        (jwtTool.verify as jest.Mock).mockReturnValue({ id: 1, role: 'candidat' });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    describe("GET /api/members/me", () => {
        it("doit retourner un statut 200 et le profil du membre connecté en cas de succès", async () => {
            const fauxMembre = { id: 1, email: "jojo@gmail.com", firstname: "Jojo", lastname: "Bernard", username: "Jojodu59" };
            (MemberService.prototype.getMemberById as jest.Mock).mockResolvedValue(fauxMembre);

            const res = await request(app).get("/api/members/me").set("Authorization", "Bearer fake-jwt-token");

            expect(res.status).toBe(200);
            expect(MemberService.prototype.getMemberById).toHaveBeenCalledWith(1);
            expect(res.body).toEqual({
                message: "Mon profil récupéré.",
                member: fauxMembre
            });
        });

        it("doit retourner un statut 404 si le membre n'est pas trouvé", async () => {
            (MemberService.prototype.getMemberById as jest.Mock).mockRejectedValue(new NotFoundError("MEMBER_NOT_FOUND"));

            const res = await request(app).get("/api/members/me").set("Authorization", "Bearer fake-jwt-token");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ 
                success: false, 
                message: "MEMBER_NOT_FOUND"
            });
        });
    });

   
    describe("Mise à jour du profil (PUT & PATCH)", () => {
        
        it("doit mettre à jour les informations publiques du profil (PUT /me)", async () => {
            (MemberService.prototype.modifyYourProfile as jest.Mock).mockResolvedValue(undefined);

            const res = await request(app)
                .put("/api/members/me")
                .set("Authorization", "Bearer fake-token")
                .send({ firstname: "Jean", lastname: "Dupont" });

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: "Profil mis à jour avec succès." });
            expect(MemberService.prototype.modifyYourProfile).toHaveBeenCalledWith(1, { firstname: "Jean", lastname: "Dupont" });
        });

        it("doit mettre à jour le compte (email et username) avec succès (PATCH /me/account)", async () => {
            (MemberService.prototype.modifyYourProfile as jest.Mock).mockResolvedValue(undefined);

            const res = await request(app)
                .patch("/api/members/me/account")
                .set("Authorization", "Bearer fake-token")
                .send({ email: "nouveau@gmail.com", username: "NouveauPseudo59" });

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: "Informations de compte mises à jour avec succès." });
            expect(MemberService.prototype.modifyYourProfile).toHaveBeenCalledWith(1, { email: "nouveau@gmail.com", username: "NouveauPseudo59" });
        });

        it("doit mettre à jour le mot de passe et le mapper correctement (PATCH /me/password)", async () => {
            (MemberService.prototype.modifyYourProfile as jest.Mock).mockResolvedValue(undefined);

            const res = await request(app)
                .patch("/api/members/me/password")
                .set("Authorization", "Bearer fake-token")
                .send({ password: "ValidPassword1/" }); 
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: "Mot de passe mis à jour avec succès." });
            expect(MemberService.prototype.modifyYourProfile).toHaveBeenCalledWith(1, { newPassword: "ValidPassword1/" });
        });

        it("doit bloquer avec erreur 400 (Zod) si le mot de passe est trop faible", async () => {
            const res = await request(app)
                .patch("/api/members/me/password")
                .set("Authorization", "Bearer fake-token")
                .send({ password: "faible" });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Erreur de validation des données.");
            expect(res.body.errors).toHaveProperty("password");
        });

        it("doit bloquer avec erreur 400 (Zod) si l'email sur /account est invalide", async () => {
            const res = await request(app)
                .patch("/api/members/me/account")
                .set("Authorization", "Bearer fake-token")
                .send({ email: "mauvais-format-email" });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Erreur de validation des données.");
            expect(res.body.errors).toHaveProperty("email");
        });

        it("doit bloquer les tentatives de modification de champs non autorisés (ex: email sur la route /me)", async () => {
            const res = await request(app)
                .put("/api/members/me")
                .set("Authorization", "Bearer fake-token")
                .send({ firstname: "Jean", email: "hacker@test.com" }); 

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Erreur de validation des données.");
        });
    });

    describe("deleteMyProfile", () => {
        it("doit supprimer le profil du membre connecté avec succès", async () => {
            const successMessage = { message: "Profil supprimé et déconnexion réussie." };
            (MemberService.prototype.deleteYourProfile as jest.Mock).mockResolvedValue(successMessage);

            const res = await request(app)
                .delete("/api/members/me")
                .set("Authorization", "Bearer fake-token");

            expect(res.status).toBe(200); 
            expect(res.body).toEqual(successMessage);
            expect(MemberService.prototype.deleteYourProfile).toHaveBeenCalledWith(1, "fake-token");
        });

        it("doit retourner une erreur 500 si la suppression échoue", async () => {
            (MemberService.prototype.deleteYourProfile as jest.Mock).mockRejectedValue(new InternalServerError("Erreur interne du serveur."));

            const res = await request(app)
                .delete("/api/members/me")
                .set("Authorization", "Bearer fake-token");

            expect(res.status).toBe(500);
            expect(res.body).toEqual({
                success: false,
                message: "Erreur interne du serveur."
            });
            expect(MemberService.prototype.deleteYourProfile).toHaveBeenCalledWith(1, "fake-token");
        });
    });
})