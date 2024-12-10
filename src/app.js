import "dotenv/config";
import express from "express";

import routes from "./routes.js";
import "./config/database/index.js";
import errorHandler from "./app/middlewares/errorMiddleware.js";
import setupCronJobs from "./app/services/jobs/taskServices.js"; // Importa os jobs do Node-Cron

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
    setupCronJobs(); // Configura e inicia os cron jobs
  }
}

export default new App().server;
