import EpsServices from "../services/domain/epsServices.js";

class EpsController {
  async checkOrders(req, res) {
    try {
      return res.status(200).json(await EpsServices.checkOrders());
    } catch (e) {
      return res.status(e.status).json({
        error: e.message,
        data: e.data,
      });
    }
  }

  async checkOrder(req, res) {
    try {
      const epsOrderCode  = Number(req.params.epsOrderCode);
      return res
        .status(200)
        .json(await EpsServices.checkOrder({ epsOrderCode }));
    } catch (e) {
      return res.status(e.status).json({
        error: e.message,
        data: e.data,
      });
    }
  }
}

export default new EpsController();
