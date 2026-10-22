import pool from "../config/db.js";

export const getOrgRescueOperators = async (req, res) => {
  try {
    const orgId = req.user.npo_spca_id;

    if (!orgId) {
      return res.status(400).json({
        message: "Manager is not assigned to an organization",
      });
    }

    const [rescueOperators] = await pool.query(
      `
      SELECT
        p.person_id,
        p.firstname,
        p.lastname,
        p.email,
        p.role,
        ro.npo_spca_id
      FROM person p
      INNER JOIN rescue_operator ro
        ON p.person_id = ro.person_id
      WHERE ro.npo_spca_id = ?
      ORDER BY p.firstname, p.lastname
      `,
      [orgId],
    );

    return res.status(200).json(rescueOperators);
  } catch (error) {
    console.log("Error in getOrgRescueOperators:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getManagerProfile = async (req, res) => {
  try {
    const personId = req.user.person_id;

    const [rows] = await pool.query(
      `
      SELECT
        -- Manager
        p.person_id,
        p.firstname,
        p.lastname,
        p.email,
        p.role,
        p.location_id,

        -- Organization
        m.npo_spca_id,
        n.npo_spca_name,
        n.email AS org_email,
        n.phone AS org_phone,

        -- Organization location
        l.location_id AS org_location_id,
        l.street AS org_street,

        nh.neighbourhood_id AS org_neighbourhood_id,
        nh.neighbourhood_name AS org_neighbourhood,

        c.city_id AS org_city_id,
        c.city_name AS org_city

      FROM person p

      INNER JOIN manager m
        ON p.person_id = m.person_id

      INNER JOIN npo_spca n
        ON m.npo_spca_id = n.npo_spca_id

      INNER JOIN location l
        ON n.location_id = l.location_id

      INNER JOIN neighbourhood nh
        ON l.neighbourhood_id = nh.neighbourhood_id

      INNER JOIN city c
        ON nh.city_id = c.city_id

      WHERE p.person_id = ?
      `,
      [personId],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Manager profile not found",
      });
    }

    return res.status(200).json({
      profile: rows[0],
    });
  } catch (error) {
    console.log("Error in getManagerProfile:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
