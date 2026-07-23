import { Router } from "express";
import { insecureLoginDemo, insecureRegisterDemo, bruteForceLoginDemo } from "./security.controller";

const router = Router();

router.post("/demo-register-vulnerable", insecureRegisterDemo);
router.post("/demo-sql-injection", insecureLoginDemo);


router.post("/brute-force-login", bruteForceLoginDemo);

export default router;