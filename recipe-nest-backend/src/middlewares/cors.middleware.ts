import cors from "cors";
import { FRONTEND_URL } from "../configs/config.js";

const corsOptions: cors.CorsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const configuredCors = cors(corsOptions);

export default configuredCors;
