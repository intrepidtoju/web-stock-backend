import { DataTypes } from 'sequelize';
import db from '../../config/db';

const Schema = {
  id: {
    type: DataTypes.INTEGER(11).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: {
    type: DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false,
  },
};

const Order = db.define('orders', Schema);

export default Order;
