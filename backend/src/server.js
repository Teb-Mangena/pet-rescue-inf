import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { ENV } from "./config/env.js";
import pool from "./config/db.js";

import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import managerRoutes from "./routes/manager.route.js";
import roRoutes from "./routes/ro.route.js";
import petOwnerRoutes from "./routes/petowner.route.js";
// import communityRoutes from "./routes/communityRoutes.js";
import incidentRoutes from "./routes/incident.route.js";
import petRoutes from "./routes/pet.route.js";
import streamRoute from "./routes/stream.route.js";
import handoverRoutes from "./routes/handover.route.js";

const app = express();
const { PORT, FRONTEND_URL } = ENV;

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/rescue-operator", roRoutes);
app.use("/api/pet-owner", petOwnerRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/pets", petRoutes);
// app.use("/api/community", communityRoutes);
app.use("/api/handover", handoverRoutes);
app.use("/api/stream", streamRoute);

const startServer = async () => {
  try {
    const connection = await pool.getConnection();

    console.log("MySQL database connected successfully");

    connection.release();

    app.listen(ENV.PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MySQL database connection failed:", error);
    process.exit(1);
  }
};

startServer();
