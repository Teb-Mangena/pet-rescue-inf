import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import pool from "../config/db.js";

export const protectAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    // Get person + role-specific NPO/SPCA
    const [rows] = await pool.query(
      `
      SELECT
        p.person_id,
        p.email,
        p.firstname,
        p.lastname,
        p.role,
        p.profileImage,
        p.location_id,

        COALESCE(
          ia.npo_spca_id,
          m.npo_spca_id,
          ro.npo_spca_id
        ) AS npo_spca_id

      FROM person p

      LEFT JOIN itadmin ia
        ON ia.person_id = p.person_id

      LEFT JOIN manager m
        ON m.person_id = p.person_id

      LEFT JOIN rescue_operator ro
        ON ro.person_id = p.person_id

      WHERE p.person_id = ?
      `,
      [decoded.id],
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const user = rows[0];

    // Attach authenticated user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("protectAuth error:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
