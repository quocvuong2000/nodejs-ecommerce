'use strict';

const mongoose = require('mongoose');
const connectString = 'mongodb://localhost:27017/study-nodejs';

const testSchema = new mongoose.Schema({
  name: String,
});

const TestModel = mongoose.model('Test', testSchema);

describe('Test mongodb connection', () => {
  let connection;

  beforeEach(async () => {
    connection = await mongoose.connect(connectString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await connection.disconnect();
  });

  it('should connect to MongoDB', async () => {
    const db = mongoose.connection;
    expect(db.readyState).toBe(1); // 1 means connected
  });

  it('should create and retrieve a document', async () => {
    const testDoc = new TestModel({ name: 'Test Name' });
    await testDoc.save();

    const foundDoc = await TestModel.findOne({ name: 'Test Name' });
    expect(foundDoc.name).toBe('Test Name');
  });
});
