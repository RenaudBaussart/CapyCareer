import request from "supertest";
import express from "express";
import { getMyProfile } from "./member.controller";
import { middlewareAuthAdmin } from "../../core/middlewares/adminMiddleware";
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



describe("MemberController - getMyProfile", () => {
    let app: express.Application;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.get("/api/members/me", middlewareAuthAdmin, getMyProfile);
        app.use(errorHandlerMiddleware);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/members/me", () => {
        it("doit retourner un statut 200 et le profil du membre connecté en cas de succès", async () => {
            const fauxMembre = { id: 1, email: "jojo@gmail.com", firstname: "Jojo", lastname: "Bernard", username: "Jojodu59" };
            
            (MemberService.prototype.getMemberById as jest.Mock).mockResolvedValue(fauxMembre);
            (jwtTool.verify as jest.Mock).mockImplementation((token: any, secret: any, cb: any) => cb(null, { id: 1, role: 'admin' }));

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
            (jwtTool.verify as jest.Mock).mockImplementation((token: any, secret: any, cb: any) => cb(null, { id: 1, role: 'admin' }));

            const res = await request(app).get("/api/members/me").set("Authorization", "Bearer fake-jwt-token");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ 
                success: false, 
                message: "MEMBER_NOT_FOUND"
            });
        });
    });
});