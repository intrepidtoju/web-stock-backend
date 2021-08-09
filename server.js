import express from 'express';
import config from './app/config/config';
import db from './app/config/db';
import middlewares from './app/routes/middlewares';
import routes from './app/routes/routes';

const app = express();
middlewares(app);
routes(app);

(async () => {
  try {
    // Create all database tables and propagate associations
    await db.sync();

    app.listen(config.PORT, err => {
      if (err) {
        console.log('Server connection failed');
        throw err;
      }

      console.log('Connection established on port ' + config.PORT);
    });
  } catch (err) {
    console.log('Database connection error');
    throw err;
  }
})();
