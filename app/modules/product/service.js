import Product from './model';

export async function create(body) {
  try {
    const product = await Product.create(body);
    return {
      message: 'Product created successfully',
      data: product,
    };
  } catch (error) {
    throw error;
  }
}

export async function findAll() {
  try {
    const products = await Product.findAll();
    return {
      message: 'All products retrived',
      data: products,
    };
  } catch (error) {
    throw error;
  }
}
