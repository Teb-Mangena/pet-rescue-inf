import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import { genToken } from "../config/genToken.js";
import { upsertStreamUser } from "../lib/stream.js";

// NOTES
// AVAILABLE ROLES
//  'rescue_operator',
//  'manager',
//  'it_admin',
//  'pet_owner',
//  'community_member'

export const signup = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const {
      password,
      firstname,
      lastname,
      role = "community_member",
    } = req.body;

    if (!email || !password || !firstname || !lastname) {
      return res.status(400).json({
        message: "All fields must be filled",
      });
    }

    // Validate email and password
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Email is invalid",
      });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        message: "Password is not strong enough",
      });
    }

    // Check if email already exists
    const [existEmail] = await pool.query(
      `
      SELECT person_id
      FROM person
      WHERE email = ?
      LIMIT 1
      `,
      [email],
    );

    if (existEmail.length > 0) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const validRoles = [
      "it_admin",
      "manager",
      "rescue_operator",
      "pet_owner",
      "community_member",
    ];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: `Role: ${role} does not exist`,
      });
    }

    // generate random profilePic
    const profileImage = `https://ui-avatars.com/api/?name=${firstname}+${lastname}&background=random`;

    // Create user in database
    const [user] = await pool.query(
      `
      INSERT INTO person (email, password,firstname,lastname,role,profileImage)
      VALUES (?, ?, ?,?,?,?)
      `,
      [email, hash, firstname, lastname, role.toLowerCase(), profileImage],
    );

    const userId = user.insertId;

    switch (role.toLowerCase()) {
      case "it_admin":
        await pool.query(`INSERT INTO itadmin  (person_id) VALUES (?)`, [
          userId,
        ]);
        break;
      case "manager":
        await pool.query(`INSERT INTO manager (person_id) VALUES (?)`, [
          userId,
        ]);
        break;
      case "rescue_operator":
        await pool.query(`INSERT INTO rescue_operator (person_id) VALUES (?)`, [
          userId,
        ]);
        break;
      case "pet_owner":
        await pool.query(`INSERT INTO pet_owner (person_id) VALUES (?)`, [
          userId,
        ]);
        break;
      case "community_member":
        await pool.query(`INSERT INTO member (person_id) VALUES (?)`, [userId]);
        break;
      default:
        console.log(`${role} does not exist in the database`);
        break;
    }

    // Get the created user
    const [createdUser] = await pool.query(
      `
      SELECT person_id, email, firstname, lastname, role, profileImage, location_id FROM person
      WHERE person_id = ?
      `,
      [userId],
    );

    const streamUser = createdUser[0];

    // create stream user
    try {
      const streamResponse = await upsertStreamUser({
        id: streamUser.person_id.toString(),
        name: streamUser.firstname + " " + streamUser.lastname,
        image: streamUser.profileImage,
      });

      console.log("Stream user created:", streamResponse);
    } catch (error) {
      console.log("Error creating Stream user:", error);
    }

    // Generate JWT
    genToken(res, userId);

    return res.status(201).json({
      message: "Account created successfully",
      user: createdUser[0],
    });
  } catch (error) {
    console.log("Error in signup:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required",
      });
    }

    // check if email exists
    const [emailExists] = await pool.query(
      `
      SELECT * FROM person 
      WHERE email = ?
    `,
      [email],
    );

    if (emailExists.length === 0) {
      return res.status(401).json({ message: "Incorrect credentials" });
    }

    const user = emailExists[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        message: "Incorrect credentials",
      });
    }

    genToken(res, user.person_id);

    delete user.password;

    return res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.log("Error in login", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({
      message: "Error logging out",
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json({
      message: "user is logged in",
      user: req.user,
    });
  } catch (error) {
    console.log("Error in check auth", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { id: person_id } = req.params;

    const [personRows] = await pool.query(
      `
      SELECT
        person_id,
        firstname,
        lastname,
        email,
        role,
        profileImage
      FROM PERSON
      WHERE person_id = ?
      `,
      [person_id],
    );

    if (personRows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(personRows[0]);
  } catch (error) {
    console.error("Error in getUserDetails:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
