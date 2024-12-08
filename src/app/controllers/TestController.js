import Log from "../models/Log.js";

class TestController {
  async test(req, res) {
    return res.status(200).json({ message: "Olá!" });
  }

  testSentry(req, res) {
    throw new Error("Testing Sentry error!");
  }
  async testDbConnection(req, res) {
    try {
      const logs = await Log.findAll({
        limit: 10,
        order: [["created_at", "DESC"]],
      });

      return res.status(200).json(logs);
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
      return res.status(500).json({ error: "Erro ao processar a requisição" });
    }
  }
}

export default new TestController();
