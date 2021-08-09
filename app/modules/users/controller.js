'use strict';
import { errorMessage } from '../../config/utils';
import * as service from './service';

export async function register(req, res) {
  try {
    const user = await service.create(req.body);
    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorMessage(error));
  }
}

export async function login(req, res) {
  try {
    const result = await service.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(errorMessage(error));
  }
}
