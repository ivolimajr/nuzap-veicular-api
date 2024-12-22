import EspServices from "../services/domain/BaseServices.js";
import Veiculo from "../models/Veiculo.js";

class TestController {
  async test(req, res) {
    return res.status(200).json({ message: "Olá!" });
  }

  testSentry(req, res) {
    throw new Error("Testing Sentry error!");
  }

  async testDbConnection(req, res, next) {
    try {
      const logs = await Veiculo.findAll({
        limit: 10,
        order: [["created_at", "DESC"]],
      });

      return res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  }

  async testApiAuth(req, res, next) {
    try {
      const result = await EspServices.testeApiAuth();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new TestController();
