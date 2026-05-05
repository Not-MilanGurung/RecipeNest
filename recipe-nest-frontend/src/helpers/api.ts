import axios from "axios";
import { BACKEND_API_URL } from "./constants";
import type { UserContextData } from "./contexts";

const api = axios.create({
  baseURL: BACKEND_API_URL,
  withCredentials: true,
});

export const refreshToken = async () => {
  const response = await api.get("/users/refresh");
  const data: UserContextData = response.data.data;
  return data;
};

export default api;
