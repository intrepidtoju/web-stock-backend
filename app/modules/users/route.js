import { Router } from 'express';
import validate from 'express-validation';
import * as controller from './controller';
import validation from './validation';
const route = new Router();

route.post('/register', validate(validation.register), controller.register);
route.post('/login', validate(validation.login), controller.login);

export default route;
