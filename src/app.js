import express from 'express';
import morgan from 'morgan';
import path from 'path';
import routes from './routes';
import 'dotenv/config';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(morgan('dev'));
  }

  routes() {
    this.server.use(routes);
    this.server.use(
      '/local',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }
}

module.exports = new App().server;
