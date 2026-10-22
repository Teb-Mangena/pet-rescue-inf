import pool from "../config/db.js";

export const createPetHandover = async (req, res) => {
  try {
    const { petId, npoSpcaId, reason } = req.body;
    const personId = req.user.person_id;

    if (!petId || !npoSpcaId) {
      return res.status(400).json({
        message: "Pet ID and NPO/SPCA ID are required",
      });
    }

    // Find the community member
    const [memberRows] = await pool.query(
      `
      SELECT member_id
      FROM MEMBER
      WHERE person_id = ?
      `,
      [personId],
    );

    if (memberRows.length === 0) {
      return res.status(403).json({
        message: "Community member record not found",
      });
    }

    const memberId = memberRows[0].member_id;

    // Check that the pet exists and is missing
    const [petRows] = await pool.query(
      `
      SELECT pet_id, pet_status
      FROM PET
      WHERE pet_id = ?
      `,
      [petId],
    );

    if (petRows.length === 0) {
      return res.status(404).json({
        message: "Pet not found",
      });
    }

    const pet = petRows[0];

    // Pet must be missing before it can be handed over
    if (pet.pet_status !== "missing") {
      return res.status(400).json({
        message: "Only a missing pet can be handed over",
      });
    }

    // Check if there is already an active handover
    const [existingHandover] = await pool.query(
      `
      SELECT handover_id
      FROM PET_HANDOVER
      WHERE pet_id = ?
        AND status IN ('pending', 'accepted')
      `,
      [petId],
    );

    if (existingHandover.length > 0) {
      return res.status(409).json({
        message: "This pet already has an active handover",
      });
    }

    // Make sure the NPO/SPCA exists
    const [orgRows] = await pool.query(
      `
      SELECT npo_spca_id
      FROM NPO_SPCA
      WHERE npo_spca_id = ?
      `,
      [npoSpcaId],
    );

    if (orgRows.length === 0) {
      return res.status(404).json({
        message: "NPO/SPCA not found",
      });
    }

    // Create handover
    const [result] = await pool.query(
      `
      INSERT INTO PET_HANDOVER (
        pet_id,
        member_id,
        npo_spca_id,
        handover_date,
        reason,
        status
      )
      VALUES (?, ?, ?, CURDATE(), ?, 'pending')
      `,
      [petId, memberId, npoSpcaId, reason || null],
    );

    return res.status(201).json({
      message: "Pet handover created successfully",
      handover_id: result.insertId,
    });
  } catch (error) {
    console.log("Error in createPetHandover", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * Community member gets their own handovers
 */
export const getMyHandovers = async (req, res) => {
  try {
    const personId = req.user.person_id;

    const [rows] = await pool.query(
      `
      SELECT
        h.handover_id,
        h.pet_id,
        h.npo_spca_id,
        h.handover_date,
        h.reason,
        h.status,

        -- Pet information
        ps.species_name,
        pc.colour_name,
        pi.url AS pet_image_url,

        -- Organization information
        o.npo_spca_name,
        o.email AS organization_email,
        o.phone AS organization_phone,

        -- Organization location
        l.location_id AS organization_location_id,
        l.street AS organization_street,
        n.neighbourhood_id AS organization_neighbourhood_id,
        n.neighbourhood_name AS organization_neighbourhood,
        c.city_id AS organization_city_id,
        c.city_name AS organization_city

      FROM PET_HANDOVER h

      JOIN MEMBER m
        ON h.member_id = m.member_id

      JOIN PET p
        ON h.pet_id = p.pet_id

      JOIN PET_SPECIES ps
        ON p.species_id = ps.species_id

      JOIN PET_COLOUR pc
        ON p.colour_id = pc.colour_id

      LEFT JOIN PET_IMAGE pi
        ON p.pet_image_id = pi.pet_image_id

      JOIN NPO_SPCA o
        ON h.npo_spca_id = o.npo_spca_id

      LEFT JOIN LOCATION l
        ON o.location_id = l.location_id

      LEFT JOIN NEIGHBOURHOOD n
        ON l.neighbourhood_id = n.neighbourhood_id

      LEFT JOIN CITY c
        ON n.city_id = c.city_id

      WHERE m.person_id = ?

      ORDER BY h.handover_id DESC
      `,
      [personId],
    );

    return res.status(200).json({
      message: "Handovers retrieved successfully",
      handovers: rows,
    });
  } catch (error) {
    console.log("Error in getMyHandovers", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * Get one handover
 */
export const getHandoverDetails = async (req, res) => {
  try {
    const { id: handoverId } = req.params;

    if (!handoverId) {
      return res.status(400).json({
        message: "Handover ID is required",
      });
    }

    const [rows] = await pool.query(
      `
      SELECT
        h.handover_id,
        h.pet_id,
        h.member_id,
        h.npo_spca_id,
        h.handover_date,
        h.reason,
        h.status,

        -- Pet
        ps.species_name,
        pc.colour_name,
        p.pet_status,
        p.pet_description,
        pi.url AS pet_image_url,

        -- Community member
        person.person_id AS member_person_id,
        person.firstname AS member_firstname,
        person.lastname AS member_lastname,
        person.email AS member_email,

        -- NPO/SPCA
        o.npo_spca_name,
        o.email AS npo_email,
        o.phone AS npo_phone

      FROM PET_HANDOVER h

      JOIN PET p
        ON h.pet_id = p.pet_id

      JOIN PET_SPECIES ps
        ON p.species_id = ps.species_id

      JOIN PET_COLOURS pc
        ON p.colour_id = pc.colour_id

      LEFT JOIN PET_IMAGE pi
        ON p.pet_image_id = pi.pet_image_id

      JOIN MEMBER m
        ON h.member_id = m.member_id

      JOIN PERSON person
        ON m.person_id = person.person_id

      JOIN NPO_SPCA o
        ON h.npo_spca_id = o.npo_spca_id

      WHERE h.handover_id = ?
      `,
      [handoverId],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Handover not found",
      });
    }

    return res.status(200).json({
      message: "Handover details retrieved successfully",
      handover: rows[0],
    });
  } catch (error) {
    console.log("Error in getHandoverDetails", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * NPO/SPCA gets incoming handovers
 *
 * IT admin / manager can use this to view
 * handovers belonging to their organization.
 */
export const getOrganizationHandovers = async (req, res) => {
  try {
    const personId = req.user.person_id;

    // Find the organization of the logged-in staff member
    const [managerRows] = await pool.query(
      `
      SELECT npo_spca_id
      FROM MANAGER
      WHERE person_id = ?

      UNION

      SELECT npo_spca_id
      FROM ITADMIN
      WHERE person_id = ?

      UNION

      SELECT npo_spca_id
      FROM RESCUE_OPERATOR
      WHERE person_id = ?
      `,
      [personId, personId, personId],
    );

    if (managerRows.length === 0) {
      return res.status(403).json({
        message: "Organization staff record not found",
      });
    }

    const npoSpcaId = managerRows[0].npo_spca_id;

    const [rows] = await pool.query(
      `
      SELECT
        h.handover_id,
        h.pet_id,
        h.handover_date,
        h.reason,
        h.status,

        ps.species_name,
        pc.colour_name,
        pi.url AS pet_image_url,
        p.pet_name,

        person.firstname AS member_firstname,
        person.lastname AS member_lastname,
        person.email AS member_email

      FROM PET_HANDOVER h

      JOIN PET p
        ON h.pet_id = p.pet_id

      JOIN PET_SPECIES ps
        ON p.species_id = ps.species_id

      JOIN PET_COLOUR pc
        ON p.colour_id = pc.colour_id

      LEFT JOIN PET_IMAGE pi
        ON p.pet_image_id = pi.pet_image_id

      JOIN MEMBER m
        ON h.member_id = m.member_id

      JOIN PERSON person
        ON m.person_id = person.person_id

      WHERE h.npo_spca_id = ?

      ORDER BY h.handover_id DESC
      `,
      [npoSpcaId],
    );

    return res.status(200).json({
      message: "Organization handovers retrieved successfully",
      handovers: rows,
    });
  } catch (error) {
    console.log("Error in getOrganizationHandovers", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * Update handover status
 *
 * Used by NPO/SPCA staff.
 */
export const updateHandoverStatus = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id: handoverId } = req.params;
    const { status } = req.body;
    const personId = req.user.person_id;

    const allowedStatuses = [
      "pending",
      "accepted",
      "rejected",
      "completed",
      "cancelled",
    ];

    if (!handoverId || !status) {
      return res.status(400).json({
        message: "Handover ID and status are required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid handover status",
      });
    }

    await connection.beginTransaction();

    // Find manager or IT admin's organization
    const [staffRows] = await connection.query(
      `
      SELECT npo_spca_id
      FROM MANAGER
      WHERE person_id = ?

      UNION

      SELECT npo_spca_id
      FROM ITADMIN
      WHERE person_id = ?
      `,
      [personId, personId],
    );

    if (staffRows.length === 0) {
      await connection.rollback();

      return res.status(403).json({
        message: "You are not authorized to update handovers",
      });
    }

    const npoSpcaId = staffRows[0].npo_spca_id;

    // Find handover belonging to this organization
    const [handoverRows] = await connection.query(
      `
      SELECT
        handover_id,
        pet_id,
        member_id,
        status
      FROM PET_HANDOVER
      WHERE handover_id = ?
        AND npo_spca_id = ?
      `,
      [handoverId, npoSpcaId],
    );

    if (handoverRows.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        message: "Handover not found",
      });
    }

    const handover = handoverRows[0];

    const petId = handover.pet_id;

    // Update handover status
    await connection.query(
      `
      UPDATE PET_HANDOVER
      SET status = ?
      WHERE handover_id = ?
        AND npo_spca_id = ?
      `,
      [status, handoverId, npoSpcaId],
    );

    // When the handover is completed
    if (status === "completed") {
      // Get organization name
      const [organizationRows] = await connection.query(
        `
        SELECT npo_spca_name
        FROM NPO_SPCA
        WHERE npo_spca_id = ?
        `,
        [npoSpcaId],
      );

      if (organizationRows.length === 0) {
        await connection.rollback();

        return res.status(404).json({
          message: "Organization not found",
        });
      }

      const organizationName = organizationRows[0].npo_spca_name;

      // Description for the found pet
      const foundDescription = `Pet found and captured by ${organizationName}`;

      // 1. Change pet status from missing to found
      await connection.query(
        `
        UPDATE PET
        SET pet_status = 'found'
        WHERE pet_id = ?
        `,
        [petId],
      );

      // 2. Update the missing pet record
      await connection.query(
        `
        UPDATE MISSING_PET
        SET status = 'found'
        WHERE pet_id = ?
          AND status = 'missing'
        `,
        [petId],
      );

      // 3. Check if FOUND_PET record already exists
      const [foundRows] = await connection.query(
        `
        SELECT found_pet_id
        FROM FOUND_PET
        WHERE pet_id = ?
        `,
        [petId],
      );

      // 4. Create FOUND_PET record if it doesn't exist
      if (foundRows.length === 0) {
        await connection.query(
          `
          INSERT INTO FOUND_PET (
            pet_id,
            reporter_id,
            location_id,
            date_found,
            description,
            status
          )
          SELECT
            h.pet_id,
            m.person_id,
            mp.location_id,
            CURDATE(),
            ?,
            'found'
          FROM PET_HANDOVER h

          JOIN MEMBER m
            ON h.member_id = m.member_id

          LEFT JOIN MISSING_PET mp
            ON h.pet_id = mp.pet_id

          WHERE h.handover_id = ?
          `,
          [foundDescription, handoverId],
        );
      } else {
        // 5. FOUND_PET already exists, so update it
        await connection.query(
          `
          UPDATE FOUND_PET
          SET
            status = 'found',
            description = ?
          WHERE pet_id = ?
          `,
          [foundDescription, petId],
        );
      }
    }

    await connection.commit();

    return res.status(200).json({
      message: "Handover status updated successfully",
      status,
      pet_status: status === "completed" ? "found" : undefined,
    });
  } catch (error) {
    await connection.rollback();

    console.log("Error in updateHandoverStatus", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    connection.release();
  }
};
