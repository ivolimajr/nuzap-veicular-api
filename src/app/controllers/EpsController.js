import EpsServices from "../services/domain/epsServices.js";

class EpsController {
  async checkOrders(req, res,next) {
    try {
      return res.status(200).json(await EpsServices.checkAllOrders());
    } catch (error) {
      next(error);
    }
  }

  async checkOrderById(req, res,next) {
    try {
      const id = Number(req.params.id);
      return res.status(200).json(await EpsServices.checkOrderById(id));
    } catch (error) {
      next(error);
    }
  }

  async checkOrderByOrderNumber(req, res, next) {
    try {
      const numeroPedido = Number(req.params.numeroPedido);
      return res
        .status(200)
        .json(await EpsServices.checkOrderByOrderNumber(numeroPedido));
    } catch (error) {
      next(error);
    }
  }

  async directCheckOrderNumber(req, res, next) {
    try {
      const numeroPedido = Number(req.params.numeroPedido);
      return res.status(200).json(await EpsServices.directCheck(numeroPedido));
    } catch (error) {
      next(error);
    }
  }
  async checkPlate(req, res, next) {
    try {
      const placa = req.params.placa;
      return res.status(200).json(await EpsServices.checkPlate(placa));
    } catch (error) {
      next(error);
    }
  }
}

export default new EpsController();
