import { StreamChat } from "stream-chat";
import { ENV } from "../config/env.js";

const { STREAM_API_KEY, STREAM_API_SECRET } = ENV;

const streamClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);

    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
    throw error; // let caller handle it
  }
};

export const generateStreamToken = (userId) => {
  try {
    // ensure userId is string
    const userIdStr = userId.toString();

    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.log("Error generating stream token", error);
  }
};
