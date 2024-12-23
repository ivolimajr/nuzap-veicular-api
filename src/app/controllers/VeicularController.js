import BaseServices from "../services/domain/BaseServices.js";

class VeicularController {
  async consultarPedido(req, res, next) {
    try {
      const numeroPedido = Number(req.params.numeroPedido);
      return res
        .status(200)
        .json(await BaseServices.consultarPedido(numeroPedido));
    } catch (error) {
      next(error);
    }
  }

  async consultarPlaca(req, res, next) {
    try {
      const placa = req.params.placa;
      return res.status(200).json(await BaseServices.consultarPlaca(placa));
    } catch (error) {
      next(error);
    }
  }

  async consultarDebitos(req, res, next) {
    try {
      const { placa, email, telefone } = req.body;
      return res
        .status(200)
        .json(await BaseServices.consultaDebitos({ placa, email, telefone }));
    } catch (error) {
      next(error);
    }
  }
}

export default new VeicularController();
