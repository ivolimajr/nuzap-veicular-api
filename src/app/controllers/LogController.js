import LogServices from "../services/domain/logServices.js";

class LogController {
  async getLog(req, res) {
    try {
      return res.status(200).json(await LogServices.getLog(req, res));
    } catch (e) {
      return res.status(e.status || 500).json({
        error: e.message,
        data: e.data,
      });
    }
  }
}

export default new LogController();
