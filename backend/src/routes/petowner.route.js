import { Router } from "express";
import { protectAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import {
  deletePet,
  getAllFoundPets,
  getAllMissingPets,
  getMyFoundPets,
  getMyMissingPets,
  getMyPets,
  registerPet,
  ReportFoundPet,
  reportMyLostPet,
  updatePet,
  getUserProfile
} from "../controllers/petowner.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.use(protectAuth);
router.use(requireRole("pet_owner"));

router.get("/profile", getUserProfile);

router.post("/register-pet", upload.single("image"), registerPet);
router.get("/my-pets", getMyPets);

router.post("/report-lost", reportMyLostPet);

router.get("/lost-pets", getAllMissingPets);

router.get("/my-lost-pets", getMyMissingPets);

router.post("/found-pet", ReportFoundPet);

router.get("/found-pets", getAllFoundPets);

router.get("/my-found-pets", getMyFoundPets);

router.patch("/pets/:petId", upload.single("image"), updatePet);

router.delete("/pets/:petId", deletePet);

export default router;
