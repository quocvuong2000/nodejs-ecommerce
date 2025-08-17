const mongoose = require('mongoose');

const conectionString = 'mongodb://localhost:27017/study-nodejs';

mongoose
  .connect(conectionString)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

if (1 === 0) {
  mongoose.set('debug', true);
  mongoose.set('debug', { color: true });
}

module.exports = mongoose;
