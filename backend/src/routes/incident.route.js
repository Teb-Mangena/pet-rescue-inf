import { Router } from "express";
import { protectAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import {
  getAllFoundPets,
  getAllMissingPets,
  ReportFoundPet,
} from "../controllers/petowner.controller.js";

const router = Router();

router.use(protectAuth);
router.use(requireRole("pet_owner", "community_member", "rescue_operator"));

router.get("/lost-pets", getAllMissingPets);

router.post("/found-pet", ReportFoundPet);

router.get("/found-pets", getAllFoundPets);

export default router;
