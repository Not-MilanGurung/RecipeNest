import swaggerJsdoc from "swagger-jsdoc";
// Routes
import adminPaths from "./routes/admin.routes.swagger.json" with { type: 'json'};
import recipePaths from "./routes/recipe.routes.swagger.json" with { type: 'json'};
// Middleware
import swaggerErrorSchema  from "./middlewares/error-handler.swagger.json" with { type: 'json'};
import authErrorExamples from "./middlewares/auth.swagger.json" with { type: 'json'};
import authResponses from "./middlewares/auth.responses.swagger.json" with { type: 'json'};
// Model
import modelSchemas from "./models/schemas.swagger.json" with { type: 'json'};
import modelResponses from "./models/model.responses.swagger.json" with { type: 'json'};
import type { RequestHandler } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RecipeNest API",
      version: "1.0.0",
      description: "API documentation for the RecipeNest",
    },
    components: {
      schemas: {
        ...swaggerErrorSchema,
        ...modelSchemas,
      },
      examples: {
        ...authErrorExamples,
      },
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      responses: {
        ...authResponses,
        ...modelResponses,
      },
    },
    paths: {
      ...adminPaths,
      ...recipePaths,
    },
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

import { Router }  from "express";
const router = Router();
const swaggerRoute: RequestHandler = (req, res) => {
  res.status(200).json(specs);
}

router.get("/", swaggerRoute);

export default router;
