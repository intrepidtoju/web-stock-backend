'use strict';
/* Development server config */
const developmentConfig = {
  DB_NAME: 'stock_db',
  DB_USERNAME: 'root',
  DB_PASSWORD: '',
  DB_HOST: 'localhost',
  BASE_URL: 'http://localhost:3100/api/',
  PORT: 3100,
};

/* Production server config */
const productionConfig = {
  DB_NAME: process.env.DB_NAME,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  BASE_URL: process.env.BASE_URL,
  PORT: process.env.PORT,
};

/* Test server config */
const testConfig = {
  DB_NAME: '',
  DB_USERNAME: '',
  DB_PASSWORD: '',
  DB_HOST: '',
  BASE_URL: '',
  PORT: '',
};

/* Default configuration for all servers */
const defaultConfig = {
  APP_NAME: 'Stock',
  API_VERSION: 'v1',
  /* JWT Token secret key */
  JWT_SECRET: 'inGXVHWPU9BB5q2oix1r-zaA',
  JWT_TOKEN_VALIDITY: '7d',

  /* Encryption secret key */
  CRYPTR_SECRET: 'inGXVHWPU9BB5q2oix1r-zaA',
};

const config = (env) => {
  switch (env) {
    case 'development':
      return developmentConfig;
    case 'test':
      return testConfig;
    default:
      return productionConfig;
  }
};

const envPayload = { ...config(process.env.NODE_ENV) };

/* Merge server configuration to a single object */
export default {
  ...defaultConfig,
  ...envPayload,
  BASE_URL: envPayload.BASE_URL + defaultConfig.API_VERSION,
};
