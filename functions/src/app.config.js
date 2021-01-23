const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const defaultRoute = require('../src/routes/default.route');
const documentsRoute = require('../src/routes/documents.route');
const usersRoute = require('../src/routes/users.route');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(morgan('combined'));

// Routes
app.use('/', defaultRoute);
app.use('/documents', documentsRoute);
app.use('/users', usersRoute);

module.exports = app;