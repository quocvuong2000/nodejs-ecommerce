const lodash = require('lodash');
const crypto = require('crypto');
const getInfoDatas = ({ fields = [], data }) => {
  return lodash.pick(data, fields);
};

const generateKeyPair = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // The key size in bits
    publicKeyEncoding: {
      type: 'pkcs1', // "Public Key Cryptography Standards 1"
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  });
  return { privateKey, publicKey };
};

// ['name', 'email'] => { name: 1, email: 1 }
const selectMongooseFields = (fields) => {
  return Object.fromEntries(
    fields.map((field) => {
      return [field, 1];
    })
  );
};

// ['name', 'email'] => { name: 0, email: 0 }
const unSelectMongooseFields = (fields) => {
  return Object.fromEntries(
    fields.map((field) => {
      return [field, 0];
    })
  );
};

module.exports = {
  getInfoDatas,
  generateKeyPair,
  selectMongooseFields,
  unSelectMongooseFields,
};
