import db from '../../config/db';
import Product from '../product/model';
import Order from './model';

export async function create({ quantity, productId }) {
  try {
    const product = await Product.findByPk(productId);
    if (!product) throw Error('Product not found');
    const order = await Order.create({ quantity, productId });
    return {
      message: 'Order created successfully.',
      data: order,
    };
  } catch (error) {
    throw error;
  }
}

export async function findAll() {
  try {
    const orders = await db.query(
      `SELECT p.name, o.quantity FROM orders o INNER JOIN products p ON p.id = o.productId`,
      { type: db.QueryTypes.SELECT },
    );
    return {
      success: true,
      data: orders,
      message: 'Orders fetched',
    };
  } catch (error) {}
}
