import pool from "../config/db.js";
import {
  deleteMedia,
  hasImageKitConfig,
  uploadMedia,
} from "../lib/imagekit.js";

export const getUserProfile = async (req, res) => {
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

        l.location_id,
        l.street,

        n.neighbourhood_id,
        n.neighbourhood_name,

        c.city_id,
        c.city_name

      FROM PERSON p

      LEFT JOIN LOCATION l
        ON p.location_id = l.location_id

      LEFT JOIN NEIGHBOURHOOD n
        ON l.neighbourhood_id = n.neighbourhood_id

      LEFT JOIN CITY c
        ON n.city_id = c.city_id

      WHERE p.person_id = ?
      `,
      [personId],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User profile retrieved successfully",
      user: rows[0],
    });
  } catch (error) {
    console.log("Error in getUserProfile", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const registerPet = async (req, res) => {
  try {
    const { speciesId, colorId, description, pet_name } = req.body;
    const ownerPersonId = req.user.person_id;

    // Validate required fields
    if (!speciesId || !colorId || !pet_name) {
      return res.status(400).json({
        message: "Pet name, species and colour are required",
      });
    }

    let petImageId = null;
    let uploadedFileId = null;

    // Upload pet image if provided
    if (req.file) {
      if (!hasImageKitConfig) {
        return res.status(500).json({
          message: "Media upload is not configured",
        });
      }

      const fileData = await uploadMedia(req.file);

      uploadedFileId = fileData.fileId;

      // Insert image into PET_IMAGE
      const [imgResult] = await pool.query(
        `
        INSERT INTO PET_IMAGE (url, fileid)
        VALUES (?, ?)
        `,
        [fileData.url, fileData.fileId],
      );

      petImageId = imgResult.insertId;
    }

    // Find the PET_OWNER belonging to the authenticated user
    const [ownerRows] = await pool.query(
      `
      SELECT pet_owner_id
      FROM PET_OWNER
      WHERE person_id = ?
      `,
      [ownerPersonId],
    );

    if (ownerRows.length === 0) {
      // Remove uploaded ImageKit file if owner doesn't exist
      if (uploadedFileId) {
        await deleteMedia(uploadedFileId);
      }

      return res.status(403).json({
        message: "Pet owner record not found",
      });
    }

    const ownerId = ownerRows[0].pet_owner_id;

    // Insert pet
    const [result] = await pool.query(
      `
      INSERT INTO PET (
        pet_name,
        species_id,
        colour_id,
        pet_owner_id,
        pet_image_id,
        pet_status,
        pet_description
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        pet_name,
        speciesId,
        colorId,
        ownerId,
        petImageId,
        "at_home",
        description || null,
      ],
    );

    const petId = result.insertId;

    // Add PET ID to PET_OWNER
    await pool.query(
      `
      UPDATE PET_OWNER
      SET pet_id = ?
      WHERE pet_owner_id = ?
      `,
      [petId, ownerId],
    );

    return res.status(201).json({
      message: "Pet registered successfully",
      pet_id: petId,
      pet_image_id: petImageId,
    });
  } catch (error) {
    console.error("Register pet error:", error);

    return res.status(500).json({
      message: "Error registering pet",
    });
  }
};

export const getMyPets = async (req, res) => {
  try {
    const personId = req.user.person_id;

    // Find the authenticated user's PET_OWNER record
    const [ownerRows] = await pool.query(
      `
      SELECT pet_owner_id
      FROM PET_OWNER
      WHERE person_id = ?
      `,
      [personId],
    );

    if (ownerRows.length === 0) {
      return res.status(404).json({
        message: "Pet owner record not found",
      });
    }

    const ownerId = ownerRows[0].pet_owner_id;

    // Get all pets belonging to the authenticated owner
    const [pets] = await pool.query(
      `
      SELECT
        p.pet_id,
        p.pet_name,
        p.pet_status,
        p.pet_description,

        ps.species_id,
        ps.species_name,

        pc.colour_id,
        pc.colour_name,

        pi.pet_image_id,
        pi.url AS image_url,
        pi.fileid AS image_file_id

      FROM PET p

      INNER JOIN PET_SPECIES ps
        ON p.species_id = ps.species_id

      INNER JOIN PET_COLOUR pc
        ON p.colour_id = pc.colour_id

      LEFT JOIN PET_IMAGE pi
        ON p.pet_image_id = pi.pet_image_id

      WHERE p.pet_owner_id = ?

      ORDER BY p.pet_id DESC
      `,
      [ownerId],
    );

    return res.status(200).json({
      message: "Pets retrieved successfully",
      pets,
    });
  } catch (error) {
    console.error("Get my pets error:", error);

    return res.status(500).json({
      message: "Error retrieving pets",
    });
  }
};

export const updatePet = async (req, res) => {
  try {
    const { petId } = req.params;
    const { pet_name, speciesId, colorId, description, pet_status } = req.body;

    const personId = req.user.person_id;

    // Find the authenticated user's PET_OWNER record
    const [ownerRows] = await pool.query(
      `
      SELECT pet_owner_id
      FROM PET_OWNER
      WHERE person_id = ?
      `,
      [personId],
    );

    if (ownerRows.length === 0) {
      return res.status(404).json({
        message: "Pet owner record not found",
      });
    }

    const ownerId = ownerRows[0].pet_owner_id;

    // Find pet belonging to this owner
    const [petRows] = await pool.query(
      `
      SELECT
        pet_id,
        pet_image_id
      FROM PET
      WHERE pet_id = ?
        AND pet_owner_id = ?
      `,
      [petId, ownerId],
    );

    if (petRows.length === 0) {
      return res.status(404).json({
        message: "Pet not found",
      });
    }

    const pet = petRows[0];

    // Build update dynamically
    const fields = [];
    const values = [];

    if (pet_name !== undefined) {
      fields.push("pet_name = ?");
      values.push(pet_name);
    }

    if (speciesId !== undefined) {
      fields.push("species_id = ?");
      values.push(speciesId);
    }

    if (colorId !== undefined) {
      fields.push("colour_id = ?");
      values.push(colorId);
    }

    if (description !== undefined) {
      fields.push("pet_description = ?");
      values.push(description);
    }

    if (pet_status !== undefined) {
      fields.push("pet_status = ?");
      values.push(pet_status);
    }

    // Handle new image
    let newPetImageId = pet.pet_image_id;
    let uploadedFileId = null;

    if (req.file) {
      if (!hasImageKitConfig) {
        return res.status(500).json({
          message: "Media upload is not configured",
        });
      }

      const fileData = await uploadMedia(req.file);

      uploadedFileId = fileData.fileId;

      const [imageResult] = await pool.query(
        `
        INSERT INTO PET_IMAGE (url, fileid)
        VALUES (?, ?)
        `,
        [fileData.url, fileData.fileId],
      );

      newPetImageId = imageResult.insertId;

      fields.push("pet_image_id = ?");
      values.push(newPetImageId);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        message: "No fields provided to update",
      });
    }

    values.push(petId, ownerId);

    await pool.query(
      `
      UPDATE PET
      SET ${fields.join(", ")}
      WHERE pet_id = ?
        AND pet_owner_id = ?
      `,
      values,
    );

    // Delete old image after PET has been updated
    if (req.file && pet.pet_image_id) {
      const [oldImageRows] = await pool.query(
        `
        SELECT fileid
        FROM PET_IMAGE
        WHERE pet_image_id = ?
        `,
        [pet.pet_image_id],
      );

      if (oldImageRows.length > 0) {
        try {
          await deleteMedia(oldImageRows[0].fileid);
        } catch (error) {
          console.error("Failed to delete old ImageKit file:", error);
        }
      }

      await pool.query(
        `
        DELETE FROM PET_IMAGE
        WHERE pet_image_id = ?
        `,
        [pet.pet_image_id],
      );
    }

    return res.status(200).json({
      message: "Pet updated successfully",
    });
  } catch (error) {
    console.error("Update pet error:", error);

    return res.status(500).json({
      message: "Error updating pet",
    });
  }
};

export const deletePet = async (req, res) => {
  try {
    const { petId } = req.params;
    const personId = req.user.person_id;

    // Find the authenticated user's PET_OWNER record
    const [ownerRows] = await pool.query(
      `
      SELECT pet_owner_id
      FROM PET_OWNER
      WHERE person_id = ?
      `,
      [personId],
    );

    if (ownerRows.length === 0) {
      return res.status(404).json({
        message: "Pet owner record not found",
      });
    }

    const ownerId = ownerRows[0].pet_owner_id;

    // Find pet belonging to this owner
    const [petRows] = await pool.query(
      `
      SELECT pet_id, pet_image_id
      FROM PET
      WHERE pet_id = ?
        AND pet_owner_id = ?
      `,
      [petId, ownerId],
    );

    if (petRows.length === 0) {
      return res.status(404).json({
        message: "Pet not found",
      });
    }

    const pet = petRows[0];

    // Get ImageKit file ID
    let imageFileId = null;

    if (pet.pet_image_id) {
      const [imageRows] = await pool.query(
        `
        SELECT fileid
        FROM PET_IMAGE
        WHERE pet_image_id = ?
        `,
        [pet.pet_image_id],
      );

      if (imageRows.length > 0) {
        imageFileId = imageRows[0].fileid;
      }
    }

    // Delete pet
    await pool.query(
      `
      DELETE FROM PET
      WHERE pet_id = ?
        AND pet_owner_id = ?
      `,
      [petId, ownerId],
    );

    // Delete PET_IMAGE database record
    if (pet.pet_image_id) {
      await pool.query(
        `
        DELETE FROM PET_IMAGE
        WHERE pet_image_id = ?
        `,
        [pet.pet_image_id],
      );
    }

    // Delete ImageKit file
    if (imageFileId) {
      try {
        await deleteMedia(imageFileId);
      } catch (error) {
        console.error("Failed to delete ImageKit file:", error);
      }
    }

    return res.status(200).json({
      message: "Pet deleted successfully",
    });
  } catch (error) {
    console.error("Delete pet error:", error);

    return res.status(500).json({
      message: "Error deleting pet",
    });
  }
};

export const reportMyLostPet = async (req, res) => {
  try {
    const { petId, locationId } = req.body;
    const personId = req.user.person_id;

    // Validate required fields
    if (!petId) {
      return res.status(400).json({
        message: "Pet ID is required",
      });
    }

    // Get the logged-in user's PET_OWNER record
    const [ownerRows] = await pool.query(
      `
      SELECT pet_owner_id
      FROM PET_OWNER
      WHERE person_id = ?
      `,
      [personId],
    );

    if (ownerRows.length === 0) {
      return res.status(403).json({
        message: "Pet owner record not found",
      });
    }

    const petOwnerId = ownerRows[0].pet_owner_id;

    // Make sure the pet belongs to the logged-in owner
    const [petRows] = await pool.query(
      `
      SELECT pet_id
      FROM PET
      WHERE pet_id = ?
        AND pet_owner_id = ?
      `,
      [petId, petOwnerId],
    );

    if (petRows.length === 0) {
      return res.status(404).json({
        message: "Pet not found or does not belong to you",
      });
    }

    // Prevent duplicate active missing reports
    const [existingReport] = await pool.query(
      `
      SELECT missing_pet_id
      FROM MISSING_PET
      WHERE pet_id = ?
        AND status = 'missing'
      `,
      [petId],
    );

    if (existingReport.length > 0) {
      return res.status(409).json({
        message: "This pet has already been reported missing",
      });
    }

    // Create missing pet report
    const [result] = await pool.query(
      `
      INSERT INTO MISSING_PET (
        pet_id,
        date_reported,
        location_id,
        status
      )
      VALUES (?, CURDATE(), ?, 'missing')
      `,
      [petId, locationId],
    );

    // Update the pet's status
    await pool.query(
      `
      UPDATE PET
      SET pet_status = 'missing'
      WHERE pet_id = ?
      `,
      [petId],
    );

    return res.status(201).json({
      message: "Pet reported missing successfully",
      missing_pet_id: result.insertId,
    });
  } catch (error) {
    console.log("Error in reportMyLostPet", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getMyMissingPets = async (req, res) => {
  try {
    const personId = req.user.person_id;

    // Find the authenticated user's PET_OWNER record
    const [ownerRows] = await pool.query(
      `
      SELECT pet_owner_id
      FROM PET_OWNER
      WHERE person_id = ?
      `,
      [personId],
    );

    if (ownerRows.length === 0) {
      return res.status(404).json({
        message: "Pet owner record not found",
      });
    }

    const petOwnerId = ownerRows[0].pet_owner_id;

    // Get all missing pets belonging to this owner
    const [missingPets] = await pool.query(
      `
      SELECT
        mp.missing_pet_id,
        mp.pet_id,
        mp.date_reported,
        mp.location_id,
        mp.status,

        p.pet_name,
        p.pet_status,
        p.pet_description,

        ps.species_id,
        ps.species_name,

        pc.colour_id,
        pc.colour_name,

        pi.pet_image_id,
        pi.url AS image_url,
        pi.fileid AS image_file_id,

        l.location_id,
        l.street,

        n.neighbourhood_id,
        n.neighbourhood_name,

        c.city_id,
        c.city_name

      FROM MISSING_PET mp

      INNER JOIN PET p
        ON mp.pet_id = p.pet_id

      INNER JOIN PET_SPECIES ps
        ON p.species_id = ps.species_id

      INNER JOIN PET_COLOUR pc
        ON p.colour_id = pc.colour_id

      LEFT JOIN PET_IMAGE pi
        ON p.pet_image_id = pi.pet_image_id

      INNER JOIN LOCATION l
        ON mp.location_id = l.location_id

      INNER JOIN NEIGHBOURHOOD n
        ON l.neighbourhood_id = n.neighbourhood_id

      INNER JOIN CITY c
        ON n.city_id = c.city_id

      WHERE p.pet_owner_id = ?

      ORDER BY mp.missing_pet_id DESC
      `,
      [petOwnerId],
    );

    return res.status(200).json({
      message: "My missing pets retrieved successfully",
      missingPets,
    });
  } catch (error) {
    console.error("Get my missing pets error:", error);

    return res.status(500).json({
      message: "Error retrieving missing pets",
    });
  }
};

export const getAllMissingPets = async (req, res) => {
  try {
    const [missingPets] = await pool.query(
      `
      SELECT
        mp.missing_pet_id,
        mp.pet_id,
        mp.date_reported,
        mp.location_id,
        mp.status,

        -- Pet
        p.pet_name,
        p.pet_status,
        p.pet_description,

        -- Species
        ps.species_id,
        ps.species_name,

        -- Colour
        pc.colour_id,
        pc.colour_name,

        -- Pet image
        pi.pet_image_id,
        pi.url AS image_url,
        pi.fileid AS image_file_id,

        -- Location
        l.street,

        n.neighbourhood_id,
        n.neighbourhood_name,

        c.city_id,
        c.city_name,

        -- Pet owner
        po.pet_owner_id,

        person.person_id,
        person.firstname,
        person.lastname,
        person.email

      FROM MISSING_PET mp

      INNER JOIN PET p
        ON mp.pet_id = p.pet_id

      INNER JOIN PET_SPECIES ps
        ON p.species_id = ps.species_id

      INNER JOIN PET_COLOUR pc
        ON p.colour_id = pc.colour_id

      LEFT JOIN PET_IMAGE pi
        ON p.pet_image_id = pi.pet_image_id

      INNER JOIN LOCATION l
        ON mp.location_id = l.location_id

      INNER JOIN NEIGHBOURHOOD n
        ON l.neighbourhood_id = n.neighbourhood_id

      INNER JOIN CITY c
        ON n.city_id = c.city_id

      INNER JOIN PET_OWNER po
        ON p.pet_owner_id = po.pet_owner_id

      INNER JOIN PERSON person
        ON po.person_id = person.person_id

      WHERE mp.status = 'missing'

      ORDER BY mp.missing_pet_id DESC
      `,
    );

    return res.status(200).json({
      message: "All missing pets retrieved successfully",
      missingPets,
    });
  } catch (error) {
    console.error("Get all missing pets error:", error);

    return res.status(500).json({
      message: "Error retrieving missing pets",
    });
  }
};

export const ReportFoundPet = async (req, res) => {
  try {
    const { petId, locationId, description } = req.body;
    const reporterId = req.user.person_id;

    // Validate required fields
    if (!petId || !locationId) {
      return res.status(400).json({
        message: "Pet ID and location ID are required",
      });
    }

    // Make sure the pet exists
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

    // Make sure this pet currently has an active missing report
    const [missingRows] = await pool.query(
      `
      SELECT missing_pet_id
      FROM MISSING_PET
      WHERE pet_id = ?
        AND status = 'missing'
      ORDER BY missing_pet_id DESC
      LIMIT 1
      `,
      [petId],
    );

    if (missingRows.length === 0) {
      return res.status(404).json({
        message: "This pet does not have an active missing report",
      });
    }

    const missingPetId = missingRows[0].missing_pet_id;

    // Prevent duplicate found reports
    const [existingFoundReport] = await pool.query(
      `
      SELECT found_pet_id
      FROM FOUND_PET
      WHERE pet_id = ?
        AND status = 'found'
      `,
      [petId],
    );

    if (existingFoundReport.length > 0) {
      return res.status(409).json({
        message: "This pet has already been reported as found",
      });
    }

    // Create found-pet report
    const [result] = await pool.query(
      `
      INSERT INTO FOUND_PET (
        pet_id,
        reporter_id,
        location_id,
        date_found,
        description,
        status
      )
      VALUES (?, ?, ?, CURDATE(), ?, 'found')
      `,
      [petId, reporterId, locationId, description || null],
    );

    // Update MISSING_PET status
    await pool.query(
      `
      UPDATE MISSING_PET
      SET status = 'found'
      WHERE missing_pet_id = ?
      `,
      [missingPetId],
    );

    // Update PET status
    await pool.query(
      `
      UPDATE PET
      SET pet_status = 'at_home'
      WHERE pet_id = ?
      `,
      [petId],
    );

    return res.status(201).json({
      message: "Pet reported found successfully",
      found_pet_id: result.insertId,
      missing_pet_id: missingPetId,
    });
  } catch (error) {
    console.error("Error in ReportFoundPet:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getMyFoundPets = async (req, res) => {
  try {
    const personId = req.user.person_id;

    const [foundPets] = await pool.query(
      `
      SELECT
        fp.found_pet_id,
        fp.pet_id,
        fp.reporter_id,
        fp.location_id,
        fp.date_found,
        fp.description,
        fp.status,

        -- Pet
        p.pet_name,
        p.pet_status,
        p.pet_description,

        -- Species
        ps.species_id,
        ps.species_name,

        -- Colour
        pc.colour_id,
        pc.colour_name,

        -- Pet image
        pi.pet_image_id,
        pi.url AS image_url,
        pi.fileid AS image_file_id,

        -- Location
        l.street,

        n.neighbourhood_id,
        n.neighbourhood_name,

        c.city_id,
        c.city_name,

        -- Reporter
        person.person_id,
        person.firstname,
        person.lastname,
        person.email

      FROM FOUND_PET fp

      INNER JOIN PET p
        ON fp.pet_id = p.pet_id

      INNER JOIN PET_SPECIES ps
        ON p.species_id = ps.species_id

      INNER JOIN PET_COLOUR pc
        ON p.colour_id = pc.colour_id

      LEFT JOIN PET_IMAGE pi
        ON p.pet_image_id = pi.pet_image_id

      INNER JOIN LOCATION l
        ON fp.location_id = l.location_id

      INNER JOIN NEIGHBOURHOOD n
        ON l.neighbourhood_id = n.neighbourhood_id

      INNER JOIN CITY c
        ON n.city_id = c.city_id

      INNER JOIN PERSON person
        ON fp.reporter_id = person.person_id

      WHERE fp.reporter_id = ?

      ORDER BY fp.found_pet_id DESC
      `,
      [personId],
    );

    return res.status(200).json({
      message: "My found pets retrieved successfully",
      foundPets,
    });
  } catch (error) {
    console.error("Get my found pets error:", error);

    return res.status(500).json({
      message: "Error retrieving my found pets",
    });
  }
};

export const getAllFoundPets = async (req, res) => {
  try {
    const [foundPets] = await pool.query(`
      SELECT
        fp.found_pet_id,
        fp.pet_id,
        fp.reporter_id,
        fp.location_id,
        fp.date_found,
        fp.description,
        fp.status,

        p.pet_name,
        p.pet_status,
        p.pet_description,

        ps.species_id,
        ps.species_name,

        pc.colour_id,
        pc.colour_name,

        pi.pet_image_id,
        pi.url AS image_url,
        pi.fileid AS image_file_id,

        l.street,

        n.neighbourhood_id,
        n.neighbourhood_name,

        c.city_id,
        c.city_name,

        person.person_id AS reporter_person_id,
        person.firstname AS reporter_firstname,
        person.lastname AS reporter_lastname,
        person.email AS reporter_email

      FROM FOUND_PET fp

      INNER JOIN PET p
        ON fp.pet_id = p.pet_id

      INNER JOIN PET_SPECIES ps
        ON p.species_id = ps.species_id

      INNER JOIN PET_COLOUR pc
        ON p.colour_id = pc.colour_id

      LEFT JOIN PET_IMAGE pi
        ON p.pet_image_id = pi.pet_image_id

      INNER JOIN LOCATION l
        ON fp.location_id = l.location_id

      INNER JOIN NEIGHBOURHOOD n
        ON l.neighbourhood_id = n.neighbourhood_id

      INNER JOIN CITY c
        ON n.city_id = c.city_id

      INNER JOIN PERSON person
        ON fp.reporter_id = person.person_id

      WHERE fp.status = 'found'

      ORDER BY fp.found_pet_id DESC
    `);

    const populatedFoundPets = foundPets
      .map((pet) => ({
        ...pet,

        reporter: {
          person_id: pet.reporter_person_id,
          firstname: pet.reporter_firstname,
          lastname: pet.reporter_lastname,
          email: pet.reporter_email,
        },

        reporter_person_id: undefined,
        reporter_firstname: undefined,
        reporter_lastname: undefined,
        reporter_email: undefined,
      }))
      .map(
        ({
          reporter_person_id,
          reporter_firstname,
          reporter_lastname,
          reporter_email,
          ...pet
        }) => pet,
      );

    return res.status(200).json({
      message: "All found pets retrieved successfully",
      foundPets: populatedFoundPets,
    });
  } catch (error) {
    console.error("Get all found pets error:", error);

    return res.status(500).json({
      message: "Error retrieving found pets",
    });
  }
};

export const getPetDetails = async (req, res) => {
  try {
    const { id: petId } = req.params;

    if (!petId) {
      return res.status(400).json({
        message: "Pet ID is required",
      });
    }

    const [rows] = await pool.query(
      `
      SELECT
        -- Pet details
        p.pet_id,
        p.species_id,
        ps.species_name,
        p.colour_id,
        pc.colour_name,
        p.pet_owner_id,
        p.pet_image_id,
        pi.url AS pet_image_url,
        p.pet_status,
        p.pet_description,

        -- Owner details
        po.person_id AS owner_person_id,
        person.firstname AS owner_firstname,
        person.lastname AS owner_lastname,
        person.email AS owner_email

      FROM PET p

      JOIN PET_SPECIES ps
        ON p.species_id = ps.species_id

      JOIN PET_COLOUR pc
        ON p.colour_id = pc.colour_id

      LEFT JOIN PET_IMAGE pi
        ON p.pet_image_id = pi.pet_image_id

      JOIN PET_OWNER po
        ON p.pet_owner_id = po.pet_owner_id

      JOIN PERSON person
        ON po.person_id = person.person_id

      WHERE p.pet_id = ?
      `,
      [petId],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Pet not found",
      });
    }

    return res.status(200).json({
      message: "Pet details retrieved successfully",
      pet: rows[0],
    });
  } catch (error) {
    console.log("Error in getPetDetails", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
