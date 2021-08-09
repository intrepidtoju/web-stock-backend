import db from '../../config/db';
import Order from '../order/model';

const Schema = {
  id: {
    type: DataTypes.INTEGER(11).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.CHAR(200),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false,
  },
};

const Product = db.define('products', Schema);

Product.hasMany(Order);
Order.belongsTo(Product);

export default Product;
