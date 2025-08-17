const lodash = require("lodash");
const crypto = require("crypto");
const getInfoDatas = ({ fields = [], data }) => {
  return lodash.pick(data, fields);
};

const generateKeyPair = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048, // The key size in bits
    publicKeyEncoding: {
      type: "pkcs1", // "Public Key Cryptography Standards 1"
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
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



/*
  const a = {
    b : 1,
    c : 3
    d : {
      e : 3
      z : 2
    }
  }
    body = {
      d : {
        e : 5
      }
    }
  => a.b.e = 1
*/
const updatedNestedObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    const results = {};
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const response = updatedNestedObject(obj[key]);
      Object.keys(response).forEach((b) => {
        results[`${key}.${b}`] = response[b];
      });
    } else if (typeof obj[key] === "undefined") {
      delete obj[key];
    } else {
      results[key] = obj[key];
    }
  });
  return results;
};

module.exports = {
  getInfoDatas,
  generateKeyPair,
  selectMongooseFields,
  unSelectMongooseFields,
  unSelectMongooseFields
};
