const lodash = require('lodash');
const crypto = require('crypto');
const getInfoDatas = ({ fields = [], data }) => {
  return lodash.pick(data, fields);
};

const generateKeyPair =  () => {
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

module.exports = {
  getInfoDatas,
  generateKeyPair,
};
