import { Router } from "express";
import EpsController from "./app/controllers/VeicularController.js";
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
routes.get("/veiculo/testar-autenticacao-api", TestController.testApiAuth);
routes.get("/veiculo/consultar-pedido/:numeroPedido", EpsController.consultarPedido);
routes.get("/veiculo/consultar-placa/:placa", EpsController.consultarPlaca);

export default routes;
