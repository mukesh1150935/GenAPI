// backend/controllers/dynamicController.js

const { createModel, getModel } = require('../models/dynamicModel');
const ModelDefinition = require('../models/modelDefinition');
const mongoose = require('mongoose');
const shortid = require('shortid');

exports.createModelSchema = async (req, res) => {
    const { modelName, schemaDefinition, document } = req.body;
    // console.log(document);

    for (const field in schemaDefinition) {
        const type = schemaDefinition[field].type;
        if (!mongoose.Schema.Types[type]) {
            return res.status(400).json({ error: `Invalid schema type: ${type} for field: ${field}` });
        }
    }

    const uniqueModelName = `${modelName}_${shortid.generate()}`;
    const Model = createModel(uniqueModelName, schemaDefinition);

    try {
        const modelDefinition = new ModelDefinition({ modelName: uniqueModelName, schemaDefinition });
        await modelDefinition.save();

        const newDocument = new Model(document);
        await newDocument.save();
        const apiEndpoint = `/api/${uniqueModelName}`;
        res.json({ newDocument, apiEndpoint });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createDocument = async (req, res) => {
    const { modelName } = req.params;
    const document = req.body;

    try {
        const Model = getModel(modelName);
        if (!Model) {
            return res.status(400).json({ error: `Model ${modelName} not found` });
        }
        const newDocument = new Model(document);
        await newDocument.save();
        res.json(newDocument);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDocuments = async (req, res) => {
    const { modelName } = req.params;

    try {
        const Model = getModel(modelName);
        if (!Model) {
            return res.status(400).json({ error: `Model ${modelName} not found` });
        }

        // Extract query parameters
        const query = req.query;

        // Find documents based on query parameters
        const documents = await Model.find(query);
        res.json(documents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.updateDocument = async (req, res) => {
    const { modelName, id } = req.params;
    const document = req.body;

    try {
        const Model = getModel(modelName);
        if (!Model) {
            return res.status(400).json({ error: `Model ${modelName} not found` });
        }
        const updatedDocument = await Model.findByIdAndUpdate(id, document, { new: true });
        res.json(updatedDocument);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteDocument = async (req, res) => {
    const { modelName, id } = req.params;

    try {
        const Model = getModel(modelName);
        if (!Model) {
            return res.status(400).json({ error: `Model ${modelName} not found` });
        }
        await Model.findByIdAndDelete(id);
        res.json({ message: 'Document deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDocument = async (req, res) => {
    const { modelName, id } = req.params;
    try {
        const Model = getModel(modelName);
        if (!Model) {
            return res.status(400).json({ error: `Model ${modelName} not found` });
        }
        const results= await Model.findById(id);
        // if(!results){
        //     return res.json({});
        // }
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
