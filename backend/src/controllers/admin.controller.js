import pool from "../config/db.js";

// IT ADMIN
export const registerStaff = async (req, res) => {
  try {
    const orgId = req.user.npo_spca_id;
    const { personId } = req.params;
    const { staffType } = req.body;

    if (!staffType) {
      return res.status(400).json({
        message: "Staff Type must not be empty",
      });
    }

    const allowedRoles = ["manager", "rescue_operator"];

    if (!allowedRoles.includes(staffType)) {
      return res.status(400).json({
        message: "Only manager and rescue operator can be registered",
      });
    }

    // Determine subtype table
    const staffTable = staffType === "manager" ? "manager" : "rescue_operator";

    // Check if person exists
    const [userRows] = await pool.query(
      `
      SELECT person_id, email, firstname, lastname, role
      FROM person
      WHERE person_id = ?
      `,
      [personId],
    );

    if (userRows.length === 0) {
      return res.status(404).json({
        message: "Person not found",
      });
    }

    const user = userRows[0];

    // Person must currently be a community member
    if (user.role !== "community_member") {
      return res.status(400).json({
        message: `You can only register a community member as ${staffTable}`,
      });
    }

    // Start transaction
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Update person's role
      await connection.query(
        `
        UPDATE person
        SET role = ?
        WHERE person_id = ?
        `,
        [staffType, personId],
      );

      // Register person under organization
      await connection.query(
        `
        INSERT INTO ${staffTable} (person_id, npo_spca_id)
        VALUES (?, ?)
        `,
        [personId, orgId],
      );

      await connection.commit();

      // Get updated user
      const [updatedUserRows] = await connection.query(
        `
        SELECT person_id, email, firstname, lastname, role, location_id
        FROM person
        WHERE person_id = ?
        `,
        [personId],
      );

      return res.status(201).json({
        message: `${staffTable} successfully registered to org ${orgId}`,
        updatedUser: updatedUserRows[0],
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.log("Error in registerStaff:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getOrgStaffMembers = async (req, res) => {
  try {
    const adminOrg = req.user.npo_spca_id;

    if (!adminOrg) {
      return res.status(400).json({
        message: "Admin is not assigned to an organization",
      });
    }

    const [workerResults] = await pool.query(
      `
      SELECT
        p.person_id,
        p.firstname,
        p.lastname,
        p.email,
        p.role,
        m.npo_spca_id
      FROM person p
      INNER JOIN manager m
          ON p.person_id = m.person_id
      WHERE m.npo_spca_id = ?

      UNION ALL

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
      WHERE ro.npo_spca_id = ?; 
    `,
      [adminOrg, adminOrg],
    );

    res.status(200).json(workerResults);
  } catch (error) {
    console.log("Error in getOrgStaffMembers:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const personId = req.user.person_id;

    const [rows] = await pool.query(
      `
      SELECT
          p.person_id,
          p.firstname,
          p.lastname,
          p.email,
          p.role,
          p.location_id,

          i.npo_spca_id,
          n.npo_spca_name,
          n.email AS org_email,
          n.phone AS org_phone,

          l.location_id AS org_location_id,
          l.street AS org_street,

          nh.neighbourhood_id AS org_neighbourhood_id,
          nh.neighbourhood_name AS org_neighbourhood,

          c.city_id AS org_city_id,
          c.city_name AS org_city

      FROM person p

      INNER JOIN itadmin i
          ON p.person_id = i.person_id

      INNER JOIN npo_spca n
          ON i.npo_spca_id = n.npo_spca_id

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
        message: "Admin profile not found",
      });
    }

    return res.status(200).json({
      profile: rows[0],
    });
  } catch (error) {
    console.log("Error in getAdminProfile:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAllPersons = async (req, res) => {
  try {
    const [persons] = await pool.query(`
      SELECT person_id,email,firstname,lastname,profileImage FROM person
      WHERE role = 'community_member'
    `);

    res.status(200).json(persons);
  } catch (error) {
    console.log("Error in getAdminProfile", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRecentStaff = async (req, res) => {
  try {
    const orgId = req.user.npo_spca_id;

    if (!orgId) {
      return res.status(400).json({
        message: "Organization ID is required",
      });
    }

    const [staff] = await pool.query(
      `
      SELECT
        p.person_id,
        p.firstname,
        p.lastname,
        p.email,
        p.role,
        p.profileImage,
        p.location_id,
        o.npo_spca_id

      FROM PERSON p

      INNER JOIN (
        SELECT person_id, npo_spca_id
        FROM MANAGER

        UNION ALL

        SELECT person_id, npo_spca_id
        FROM RESCUE_OPERATOR

        UNION ALL

        SELECT person_id, npo_spca_id
        FROM ITADMIN
      ) o
        ON p.person_id = o.person_id

      WHERE o.npo_spca_id = ?

      ORDER BY p.person_id DESC
      LIMIT 6
      `,
      [orgId],
    );

    return res.status(200).json(staff);
  } catch (error) {
    console.error("Error in getRecentStaff:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
