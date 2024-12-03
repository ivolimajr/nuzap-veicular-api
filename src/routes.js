import { Router } from "express";

const routes = new Router();

routes.get("/", (req, res) => {
  res.status(200).send({ mensagem: "Tarefa executada com sucesso!" });
});

routes.post("/executar-tarefa", (req, res) => {
  console.log("Tarefa executada!");
  res
    .status(200)
    .send({ mensagem: "Tarefa executada com sucesso!", data: req.body });
});

// Remova o parêntese e exporte diretamente a instância `routes`.
export default routes;
