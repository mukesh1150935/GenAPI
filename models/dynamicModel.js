// backend/models/dynamicModel.js

const mongoose = require('mongoose');
const ModelDefinition = require('./modelDefinition');

const modelCache = {};

const createModel = (modelName, schemaDefinition) => {
    if (modelCache[modelName]) {
        return modelCache[modelName];
    }

    const schemaConfig = {};
    for (const field in schemaDefinition) {
        schemaConfig[field] = {
            type: mongoose.Schema.Types[schemaDefinition[field].type],
            required: schemaDefinition[field].required
        };
    }

    const schema = new mongoose.Schema(schemaConfig);
    const Model = mongoose.model(modelName, schema);
    modelCache[modelName] = Model;
    return Model;
};

const getModel = (modelName) => {
    return modelCache[modelName];
};

const loadModelsFromDatabase = async () => {
    const modelDefinitions = await ModelDefinition.find({});
    modelDefinitions.forEach(def => {
        createModel(def.modelName, def.schemaDefinition);
    });
};

module.exports = {
    createModel,
    getModel,
    loadModelsFromDatabase
};
