import { Router } from "express";
import { protectAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import {
  getAdminProfile,
  getAllPersons,
  getOrgStaffMembers,
  getRecentStaff,
  registerStaff,
} from "../controllers/admin.controller.js";
import { getUserDetails } from "../controllers/auth.controller.js";

const router = Router();

router.use(protectAuth);
router.use(requireRole("it_admin"));

router.get("/staff-members", getOrgStaffMembers);

router.get("/members", getAllPersons);

router.get("/recent-staff", getRecentStaff);

router.get("/profile", getAdminProfile);

router.get("/user/:id", getUserDetails);

router.post("/register-staff/:personId", registerStaff);

export default router;
