const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

require("./src/configs/database");

const { PORT } = require("./src/configs/config");
const cors = require("./src/middlewares/cors.middleware");

app.use(express.json());
app.use(cookieParser());
app.use(cors);

const userRoutes = require("./src/routes/user.routes");
const recipeRoutes = require("./src/routes/recipe.routes");
const adminRoutes  = require("./src/routes/admin.routes");

app.use("/users", userRoutes);
app.use("/recipes", recipeRoutes);
app.use("/admin", adminRoutes);

// Swagger endpoint
const swaggerRoute = require("./src/swagger");

app.use("/api-docs.json", swaggerRoute);

const errorHandler = require("./src/middlewares/error-handler.middleware");
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
