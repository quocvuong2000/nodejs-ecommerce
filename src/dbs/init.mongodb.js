'use strict';

const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost:27017/study-nodejs';
const { countConnect } = require('../helpers/check.connect');
class Database {
  constructor() {
    this.connect();
  }

  connect() {
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }
    mongoose
      .connect(connectionString)
      .then(() => {
        console.log('Connected to MongoDB PRO', countConnect());
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const db = Database.getInstance();

module.exports = db;
