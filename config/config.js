// config.js
const dotenv = require('dotenv');
dotenv.config();

function getEnv(name) {
  const value = process.env[name];
  return value;
}

module.exports = {
  development: {
    dialect: 'postgres',
    port: parseInt(getEnv('DB_PORT')),
    host: getEnv('DB_HOST'),
    username: getEnv('DB_USERNAME'),
    password: getEnv('DB_PASSWORD'),
    database: getEnv('DB_NAME'),
    dialectOptions: {
      connectTimeout: 200000, 
    },
  },
  production: {
    dialect: getEnv('DB_DIALECT'),
    port: parseInt(getEnv('DB_PORT')),
    host: getEnv('DB_HOST'),
    username: getEnv('DB_USERNAME'),
    password: getEnv('DB_PASSWORD'),
    database: getEnv('DB_NAME'),
    dialectOptions: {
      connectTimeout: 200000, 
    },
  },
};
