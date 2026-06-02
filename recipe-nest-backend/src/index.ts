import express  from "express";
import cookieParser from "cookie-parser";
const app = express();

import "./configs/database.js";

import { PORT } from "./configs/config.js";
import cors from "./middlewares/cors.middleware.js";

app.use(express.json());
app.use(cookieParser());
app.use(cors);

import userRoutes from "./routes/user.routes.js";
import recipeRoutes from "./routes/recipe.routes.js";
import adminRoutes  from "./routes/admin.routes.js";

app.use("/users", userRoutes);
app.use("/recipes", recipeRoutes);
app.use("/admin", adminRoutes);

// Swagger endpoint
import swaggerRoute from "./swagger.js";

app.use("/api-docs.json", swaggerRoute);

import errorHandler from "./middlewares/error-handler.middleware.js";
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
