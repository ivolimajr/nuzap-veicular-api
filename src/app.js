import "dotenv/config";
import express from "express";

import routes from "./routes.js";
import "./config/database/index.js";
import errorHandler from "./app/middlewares/errorMiddleware.js";

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.errorHandler();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }

  errorHandler() {
    this.server.use(errorHandler);
  }

}

export default new App().server;
