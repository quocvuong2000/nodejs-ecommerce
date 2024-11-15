require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();

// init middlewares
//LOG
app.use(morgan('dev'));
//Help secure Express apps by setting HTTP response headers.
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init db
require('./dbs/init.mongodb');
// const { checkOverload } = require('./helpers/check.connect');
// checkOverload();

// Init routes
app.use("/", require("./routes"));

// error handler
app.use(function ( req, res, next) {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
})
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({
    status: 'error',
    code : status,
    message: err.message || "Internal Server Error"
  })
});

module.exports = app;
