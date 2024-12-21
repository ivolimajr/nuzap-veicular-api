import LogServices from "../services/domain/LogServices.js";

class LogController {
  async getLog(req, res, next) {
    try {
      return res.status(200).json(await LogServices.getLog(req, res));
    } catch (error) {
      next(error);
    }
  }
}

export default new LogController();
