import { Router } from "express";
import { protectAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { getRescueOperatorProfile } from "../controllers/ro.controller.js";

const router = Router();

router.use(protectAuth);
router.use(requireRole("rescue_operator"));

router.get("/profile", getRescueOperatorProfile);

export default router;
