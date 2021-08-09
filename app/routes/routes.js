'use strict';
import config from '../config/config';
import { errorMessage } from '../config/utils';
import UsersRoute from '../modules/users/route';

export default app => {
  app.use('/api/v1/users', UsersRoute);
  app.use((err, req, res, next) => {
    if (err) {
      let message;
      if (err.errors && err.errors[0].messages[0]) {
        message = err.errors[0].messages[0];
      } else if (err.message) {
        message = err.message;
      } else if (typeof err === 'string') {
        message = err;
      } else {
        message = 'Something went wrong';
      }
      res.status(400).json(errorMessage(message));
    } else {
      res.status(404).json({ message: 'Requested route not found' });
    }
  });
};
