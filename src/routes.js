import { Router } from "express";
import EpsController from "./app/controllers/EpsController.js";
import TestController from "./app/controllers/TestController.js";

const routes = new Router();

routes.get("/",TestController.test);

routes.get("/vehicle/check-order/:epsOrderCode",EpsController.checkOrder);
routes.get("/vehicle/check-orders",EpsController.checkOrders);

export default routes;

