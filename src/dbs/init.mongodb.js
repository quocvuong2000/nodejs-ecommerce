'use strict';

const mongoose = require('mongoose');

const conectionString = 'mongodb://localhost:27017/study-nodejs';

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    if(1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }
    mongoose
      .connect(conectionString)
      .then(() => {
        console.log('Connected to MongoDB PRO');
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