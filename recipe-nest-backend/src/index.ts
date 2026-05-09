import express  from "express";
import cookieParser from "cookie-parser";
const app = express();

import "./configs/database";

import { PORT } from "./configs/config";
import cors from "./middlewares/cors.middleware";

app.use(express.json());
app.use(cookieParser());
app.use(cors);

const userRoutes = require("./routes/user.routes");
const recipeRoutes = require("./routes/recipe.routes");
const adminRoutes  = require("./routes/admin.routes");

app.use("/users", userRoutes);
app.use("/recipes", recipeRoutes);
app.use("/admin", adminRoutes);

// Swagger endpoint
const swaggerRoute = require("./swagger");

app.use("/api-docs.json", swaggerRoute);

import errorHandler from "./middlewares/error-handler.middleware";
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
