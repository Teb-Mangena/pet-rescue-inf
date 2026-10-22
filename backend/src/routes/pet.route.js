import express from "express";
import { getPetDetails } from "../controllers/petowner.controller.js";

const router = express.Router();

router.get("/:id", getPetDetails);

export default router;
