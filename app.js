const path = require('path');

// external package import
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors')

const app = express();
dotenv.config();

// Development logging
app.use(morgan('dev'));

// internal modules import
const userRoute = require('./routes/userRoute');

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// static image file handle
app.use('/public/users/', express.static(path.join(__dirname, '/public/users/')));


// routes
app.use('/api/user', userRoute);


// module export
module.exports = app;