const express = require('express');
const { createModelSchema, createDocument, getDocuments,getDocument, updateDocument, deleteDocument } = require('../controllers/dynamicController');
const router = express.Router();

// Route to create model schema and initial document
router.post('/create', createModelSchema);

// Route to add new document to the existing model
router.post('/:modelName', createDocument);
router.get('/:modelName', getDocuments);
router.get('/:modelName/:id', getDocument);
router.put('/:modelName/:id', updateDocument);
router.delete('/:modelName/:id', deleteDocument);




// // const express = require('express');
// // const router = express.Router();
const swaggerMiddleware = require('../swagger/swaggerConfig');

// // Route for model-specific Swagger documentation
router.use('/:modelName/api-docs', swaggerMiddleware);

// // module.exports = router;

module.exports = router;