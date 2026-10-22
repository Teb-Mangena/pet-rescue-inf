import axios from "axios";

const apiURL = "http://localhost:5050";

export const axiosInstance = axios.create({
  baseURL: `${apiURL}/api`,
  withCredentials: true,
});
