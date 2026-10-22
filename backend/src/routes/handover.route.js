import { Router } from "express";
import {
  createPetHandover,
  getMyHandovers,
} from "../controllers/handover.controller.js";
import { protectAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// BELONGS TO COMMUNITY MEMBER
router.use(protectAuth);

router.post("/", createPetHandover);
router.get("/my", getMyHandovers);

export default router;
