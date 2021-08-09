import * as service from './service';

export async function create(req, res) {
  try {
    const order = await service.create(req.body);
    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json(errorMessage(error));
  }
}

export async function findAll(req, res) {
  try {
    const orders = await service.findAll();
    return res.status(201).json(orders);
  } catch (error) {
    return res.status(500).json(errorMessage(error));
  }
}
