import { generateStreamToken } from "../lib/stream.js";

export const getStreamToken = async (req, res) => {
  try {
    const userId = req.user.person_id;

    const token = generateStreamToken(userId);

    res.status(200).json({ token });
  } catch (error) {
    console.log("Error getting stream token", error);
    res.status(500).json("Internal server error");
  }
};
