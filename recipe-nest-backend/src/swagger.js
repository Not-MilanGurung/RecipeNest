const swaggerJsdoc = require("swagger-jsdoc");
// Routes
const adminPaths = require("./routes/admin.routes.swagger.json");
const recipePaths = require("./routes/recipe.routes.swagger.json");
// Middleware
const swaggerErrorSchema = require("./middlewares/error-handler.swagger.json");
const authErrorExamples = require("./middlewares/auth.swagger.json");
const authResponses = require("./middlewares/auth.responses.swagger.json");
// Model
const modelSchemas = require("./models/schemas.swagger.json");
const modelResponses = require("./models/model.responses.swagger.json");

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

const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).json(specs);
});

module.exports = router;
