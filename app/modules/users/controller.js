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
    res.status(200).json(req.user.getAuthJSON());
  } catch (error) {
    return res.status(500).json(errorMessage(error));
  }
}
