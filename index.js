// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { swaggerMiddleware, serve, setup } = require('./middlewares/swaggerMiddleware');const app = express();
const { loadModelsFromDatabase } = require('./models/dynamicModel');


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/build')));

// The "catchall" handler: for any request that doesn't match
// one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error(err);
});

mongoose.connection.once('open', async () => {
    console.log('Connected to MongoDB');
    await loadModelsFromDatabase();
});





// Dynamic route setup
const dynamicRoutes = require('./routes/dynamicRoutes');

app.use('/api', dynamicRoutes);

// Swagger routes for dynamic models
// app.get('/:modelName/api-docs', swaggerMiddleware, serve, setup(null, {
//     explorer: true,
//     swaggerOptions: {
//         url: '/:modelName/api-docs-json'
//     }
// }));

// app.get('/:modelName/api-docs-json', (req, res) => {
//     res.json(req.swaggerDoc);
// });
// Swagger routes for dynamic models
// app.use('/', swaggerMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
