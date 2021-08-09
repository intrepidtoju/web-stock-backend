'use strict';
import Sequelize from 'sequelize';
import config from './config';

const db = new Sequelize(config.DB_NAME, config.DB_USERNAME, config.DB_PASSWORD, {
  host: config.DB_HOST,
  dialect: 'mysql',
});

export default db;
