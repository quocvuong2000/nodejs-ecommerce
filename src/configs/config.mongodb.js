const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3056,
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || 'shopDEV',
  },
};
const pro = {
  app: {
    port: process.env.DEV_APP_PORT || 3056,
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || 'shopDEV',
  },
};

const configs = {
  dev,
  pro,
};
const env = process.env.NODE_ENV || 'dev';
module.exports = configs[env];