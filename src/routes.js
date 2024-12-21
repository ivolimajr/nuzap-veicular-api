import { Router } from "express";
import EpsController from "./app/controllers/EpsController.js";
import TestController from "./app/controllers/TestController.js";
import auth from "./app/middlewares/authMiddleware.js";
import LogController from "./app/controllers/LogController.js";

const routes = new Router();

//rota publica
routes.get("/", TestController.test);
routes.get("/sentry", TestController.testSentry);
routes.get("/test-db-connection", TestController.testDbConnection);
routes.get("/get-log", LogController.getLog);

routes.use(auth);

//rota privada
routes.get(
  "/veiculo/buscar-numero-pedido/:numeroPedido",
  EpsController.checkOrderByOrderNumber,
);
routes.get("/veiculo/test-pnh-auth", TestController.testApiAuth);
routes.get("/veiculo/consulta-direta/:numeroPedido", EpsController.directCheckOrderNumber);
routes.get("/veiculo/consulta-placa/:placa", EpsController.checkPlate);
routes.get("/veiculo/buscar-pedido/:id", EpsController.checkOrderById);
routes.get("/veiculo/buscar-todos-pedidos", EpsController.checkOrders);

export default routes;
