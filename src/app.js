const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());


// init db
require('./dbs/init.mongodb.lv0');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;
