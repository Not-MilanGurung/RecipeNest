"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
require("./configs/database");
const { PORT } = require("./configs/config");
const cors = require("./middlewares/cors.middleware");
app.use(express.json());
app.use(cookieParser());
app.use(cors);
const userRoutes = require("./routes/user.routes");
const recipeRoutes = require("./routes/recipe.routes");
const adminRoutes = require("./routes/admin.routes");
app.use("/users", userRoutes);
app.use("/recipes", recipeRoutes);
app.use("/admin", adminRoutes);
// Swagger endpoint
const swaggerRoute = require("./swagger");
app.use("/api-docs.json", swaggerRoute);
const errorHandler = require("./middlewares/error-handler.middleware");
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map