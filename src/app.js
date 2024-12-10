import "dotenv/config";
import express from "express";

import routes from "./routes.js";
import "./config/database/index.js";
import errorHandler from "./app/middlewares/errorMiddleware.js";
import checkAllOrders from "./app/services/jobs/taskServices.js";

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.errorHandler();
    this.startCronJobs(); // Inicia os cron jobs
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

  startCronJobs() {
    checkAllOrders(); // Configura e inicia os cron jobs
  }
}

export default new App().server;
