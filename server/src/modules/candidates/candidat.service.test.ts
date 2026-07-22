import { CandidatService } from "./candidat.service";
import { Pool } from "mysql2/promise";
import { BadRequestError, NotFoundError, ConflictError } from "../../core/errors/HttpError";

jest.mock("mysql2/promise", () => ({
    Pool: jest.fn().mockImplementation(() => ({
        getConnection: jest.fn().mockResolvedValue({
            execute: jest.fn(),
            release: jest.fn()
        })
    }))
}));

describe("CandidatService", () => {
    let candidatService: CandidatService;
    let mockConnection: any;
    let mockPool: Pool;

    beforeEach(() => {
        mockConnection = { 
            execute: jest.fn(), 
            release: jest.fn(),
            beginTransaction: jest.fn(),
            commit: jest.fn(),
            rollback: jest.fn()
        };
        
        mockPool = { 
            getConnection: jest.fn().mockResolvedValue(mockConnection) 
        } as unknown as Pool; 
        
        candidatService = new CandidatService(mockPool);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("redirectToSite", () => {
        it("should throw NotFoundError if job offer does not exist", async () => {
            (candidatService as any).checkIfJobOfferExists = jest.fn().mockResolvedValue(false);

            await expect(candidatService.redirectToSite(1, 1)).rejects.toThrow(NotFoundError);
            expect((candidatService as any).checkIfJobOfferExists).toHaveBeenCalledWith(1);
        });

        it("should throw NotFoundError if candidate does not exist", async () => {
            (candidatService as any).checkIfJobOfferExists = jest.fn().mockResolvedValue(true);
            (candidatService as any).checkIfCandidateExists = jest.fn().mockResolvedValue(false);

            await expect(candidatService.redirectToSite(1, 1)).rejects.toThrow(NotFoundError);
            expect((candidatService as any).checkIfCandidateExists).toHaveBeenCalledWith(1);
        });

        it("should throw ConflictError if candidate has already applied", async () => {
            (candidatService as any).checkIfJobOfferExists = jest.fn().mockResolvedValue(true);
            (candidatService as any).checkIfCandidateExists = jest.fn().mockResolvedValue(true);
            (candidatService as any).checkIfAlreadyApplied = jest.fn().mockResolvedValue(true);

            await expect(candidatService.redirectToSite(1, 1)).rejects.toThrow(ConflictError);
            expect((candidatService as any).checkIfAlreadyApplied).toHaveBeenCalledWith(1, 1);
        });

        it("should throw UnauthorizedError if user is not a candidate", async () => {
            (candidatService as any).checkIfJobOfferExists = jest.fn().mockResolvedValue(true);
            (candidatService as any).checkIfCandidateExists = jest.fn().mockResolvedValue(true);
            (candidatService as any).checkIfAlreadyApplied = jest.fn().mockResolvedValue(false);
            (candidatService as any).checkIfRoleIsCandidate = jest.fn().mockResolvedValue(false);

            await expect(candidatService.redirectToSite(1, 1)).rejects.toThrow("USER_NOT_CANDIDATE");
            expect((candidatService as any).checkIfRoleIsCandidate).toHaveBeenCalledWith(1);
        });

        it("should return the job offer URL if all checks pass", async () => {
            const mockUrl = "http://example.com/job";
            (candidatService as any).checkIfJobOfferExists = jest.fn().mockResolvedValue(true);
            (candidatService as any).checkIfCandidateExists = jest.fn().mockResolvedValue(true);
            (candidatService as any).checkIfAlreadyApplied = jest.fn().mockResolvedValue(false);
            (candidatService as any).checkIfRoleIsCandidate = jest.fn().mockResolvedValue(true);
            (candidatService as any).pool.getConnection = jest.fn().mockResolvedValue({
                execute: jest.fn().mockResolvedValue([[{ url: mockUrl }]]),
                release: jest.fn()
            });

            const result = await candidatService.redirectToSite(1, 1);
            expect(result).toBe(mockUrl);
        });
    });
});