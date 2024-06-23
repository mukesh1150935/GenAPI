// backend/middleware/swaggerMiddleware.js

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose');

const generateSwaggerSpec = (modelName, schemaDefinition) => {
    return {
        openapi: '3.0.0',
        info: {
            title: `${modelName} API`,
            version: '1.0.0',
            description: `API documentation for ${modelName}`
        },
        paths: {
            [`/api/${modelName}`]: {
                get: {
                    summary: `Get all ${modelName}`,
                    responses: {
                        200: {
                            description: `List of ${modelName}`,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            type: 'object'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                post: {
                    summary: `Create a new ${modelName}`,
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: schemaDefinition
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: `${modelName} created`,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: schemaDefinition
                                    }
                                }
                            }
                        }
                    }
                }
            },
            [`/api/${modelName}/{id}`]: {
                get: {
                    summary: `Get ${modelName} by ID`,
                    parameters: [{
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }],
                    responses: {
                        200: {
                            description: `${modelName} details`,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: schemaDefinition
                                    }
                                }
                            }
                        }
                    }
                },
                put: {
                    summary: `Update ${modelName} by ID`,
                    parameters: [{
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: schemaDefinition
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: `${modelName} updated`,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: schemaDefinition
                                    }
                                }
                            }
                        }
                    }
                },
                delete: {
                    summary: `Delete ${modelName} by ID`,
                    parameters: [{
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }],
                    responses: {
                        200: {
                            description: `${modelName} deleted`
                        }
                    }
                }
            }
        }
    };
};

const swaggerMiddleware = (req, res, next) => {
    const { modelName } = req.params;
    const Model = mongoose.model(modelName);
    if (!Model) {
        return res.status(404).send('Model not found');
    }
    const schemaDefinition = Object.keys(Model.schema.paths).reduce((acc, path) => {
        const type = Model.schema.paths[path].instance;
        acc[path] = { type: type.toLowerCase() };
        return acc;
    }, {});
    const swaggerSpec = generateSwaggerSpec(modelName, schemaDefinition);
    req.swaggerDoc = swaggerSpec;
    next();
};

module.exports = {
    swaggerMiddleware,
    serve: swaggerUi.serve,
    setup: swaggerUi.setup
};
