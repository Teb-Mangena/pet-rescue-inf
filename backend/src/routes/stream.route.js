import express from "express";
import { protectAuth } from "../middlewares/auth.middleware.js";
import { getStreamToken } from "../controllers/stream.controller.js";

const router = express.Router();

router.use(protectAuth);

router.get("/token", getStreamToken);

export default router;
