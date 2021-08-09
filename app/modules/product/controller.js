import * as services from './service';

export async function create(req, res) {
  try {
    const result = await services.create(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(errorMessage(error));
  }
}

export async function findAll(_req, res) {
  try {
    const result = await services.findAll();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(errorMessage(error));
  }
}
