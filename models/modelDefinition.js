// backend/models/modelDefinition.js

const mongoose = require('mongoose');

const modelDefinitionSchema = new mongoose.Schema({
    modelName: { type: String, required: true, unique: true },
    schemaDefinition: { type: Object, required: true }
});

module.exports = mongoose.model('ModelDefinition', modelDefinitionSchema);
