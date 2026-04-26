const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RecipeNest API',
      version: '1.0.0',
      description: 'API documentation for the RecipeNest',
    },
  },
  // Path to the API docs (where your routes are)
  apis: ['./src/routes/*.js'], 
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};