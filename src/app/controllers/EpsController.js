import EpsServices from "../services/domain/epsServices.js";

class EpsController {
  async checkOrders(req, res) {
    try {
      return res.status(200).json(await EpsServices.checkAllOrders());
    } catch (e) {
      return res.status(e.status || 500).json({
        error: e.message,
        data: e.data,
      });
    }
  }

  async checkOrderById(req, res) {
    try {
      const id = Number(req.params.id);
      return res.status(200).json(await EpsServices.checkOrderById(id));
    } catch (e) {
      return res.status(e.status || 500).json({
        error: e.message,
        data: e.data,
      });
    }
  }

  async checkOrderByOrderNumber(req, res) {
    try {
      const numeroPedido = Number(req.params.numeroPedido);
      return res
        .status(200)
        .json(await EpsServices.checkOrderByOrderNumber(numeroPedido));
    } catch (e) {
      return res.status(e.status || 500).json({
        error: e.message,
        data: e.data,
      });
    }
  }
}

export default new EpsController();
