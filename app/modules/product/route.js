import { Router } from 'express';
import validate from 'express-validation';
import { jwtAuth } from '../../config/utils';
import * as controller from './controller';
import validation from './validation';
const route = new Router();

route.post('/create', jwtAuth(), validate(validation.create), controller.create);
route.get('/', jwtAuth(), controller.findAll);

export default route;
