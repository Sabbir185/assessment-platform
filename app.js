const path = require('path');

// external package import
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors')

const app = express();
dotenv.config();


// // Development logging
if (process.env.NODE_ENV === "development")
  app.use(morgan('dev'));

// internal modules import
const userRouter = require('./routes/userRoute');
const gradeRouter = require('./routes/gradeRoute');
const assessmentRouter = require('./routes/assessmentRoute');

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// static image file handle
app.use('/public/users/', express.static(path.join(__dirname, '/public/users/')));
app.use('/public/submissions/', express.static(path.join(__dirname, '/public/submissions/')));


// routes
app.use('/api/user', userRouter);
app.use('/api/grade', gradeRouter);
app.use('/api/assessment', assessmentRouter);


// module export
module.exports = app;