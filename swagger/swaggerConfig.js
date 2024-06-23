// swaggerMiddleware.js

const swaggerJSDoc = require('swagger-jsdoc');
const mongoose = require('mongoose');
const express = require('express');

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Dynamic API Documentation',
            version: '1.0.0',
            description: 'API documentation for dynamically generated APIs',
        },
    },
    apis: [], // Routes will be added dynamically
};

const swaggerSpec = swaggerJSDoc(options);

const updateSwaggerSpec = async (req, res, next) => {
    try {
        const models = mongoose.modelNames(); // Get a list of all registered models
        
        models.forEach(modelName => {
            const path = `./routes/${modelName}.js`; // Assuming each model has its own route file
            options.apis.push(path);
        });
        next();
    } catch (err) {
        console.error('Error updating Swagger spec:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const router = express.Router();
router.use('/api-docs', updateSwaggerSpec, express.static('swagger-ui')); // Serve Swagger UI

module.exports = router;
