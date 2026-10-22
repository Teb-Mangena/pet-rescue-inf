import { Router } from "express";
import { protectAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import {
  getManagerProfile,
  getOrgRescueOperators,
} from "../controllers/manager.controller.js";
import {
  getOrganizationHandovers,
  updateHandoverStatus,
} from "../controllers/handover.controller.js";

const router = Router();

router.use(protectAuth);
router.use(requireRole("manager"));

router.get("/staff", getOrgRescueOperators);
router.get("/profile", getManagerProfile);
router.get("/handovers", getOrganizationHandovers);
router.patch("/handovers/:id/status", updateHandoverStatus);

export default router;
