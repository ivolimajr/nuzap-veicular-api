import { Router } from "express";
import EpsController from "./app/controllers/EpsController.js";
import TestController from "./app/controllers/TestController.js";
import auth from "./app/middlewares/authMiddleware.js";
const routes = new Router();

//rota publica
routes.get("/",TestController.test);

routes.use(auth);


//rota privada
routes.get("/vehicle/check-order/:epsOrderCode",EpsController.checkOrder);
routes.get("/vehicle/check-orders",EpsController.checkOrders);

export default routes;

