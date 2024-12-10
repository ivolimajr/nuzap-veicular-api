import { Op } from "sequelize";
import EspApiServices from "../api/EspApiServices.js";
import LogServices from "./logServices.js";
import CustomException from "../../../config/CustomException.js";
import Pedido from "../../models/Pedido.js";

class EpsServices {
  #sleepTime = Number(process.env.CONSULTA_SLEEP_TIME) || 1000;

  async checkAllOrders() {
    const pedidos = await this.#getAllOrdersPending();
    const results = [];

    for (const pedido of pedidos) {
      try {
        const checkedOrder = await this.#checkOrder(pedido);
        results.push(checkedOrder);
      } catch (error) {
        throw error;
      }

      // Pausa entre as verificações
      await this.#delay();
    }

    return results;
  }

  async checkOrderByOrderNumber(numeroPedido) {
    const pedido = await Pedido.findOne({
      where: { numeroPedido },
      attributes: ["id", "numeroPedido", "status"],
    });
    return await this.#checkOrder(pedido);
  }

  async checkOrderById(pedidoId) {
    const pedido = await Pedido.findByPk(pedidoId, {
      attributes: ["id", "numeroPedido", "status"],
    });
    return await this.#checkOrder(pedido);
  }

  async directCheck(numeroPedido){
    if (!numeroPedido || numeroPedido <= 0)
      throw new CustomException(400, "Verifique o número do pedido informado");

    try {
      // Consulta à API externa
      return await EspApiServices.checkOrder({
        numeroPedido: numeroPedido,
      });
    } catch (error) {
      throw error;
    }
  }


  async #checkOrder(pedido) {
    if (!pedido || !pedido.id)
      throw new CustomException(400, "Verifique o número do pedido informado");

    try {
      // Consulta à API externa
      const apiResult = await EspApiServices.checkOrder({
        numeroPedido: pedido.numeroPedido,
      });

      // Registrar log
      await LogServices.registerLog({
        pedidoId: pedido.id,
        statusAtual: pedido.status,
        statusFinal: apiResult.data?.status || "Sem retorno de status",
        descricao: JSON.stringify(apiResult.data),
      });

      // Atualizar status do pedido se necessário
      if (
        apiResult.success &&
        apiResult.data?.status &&
        apiResult.data.status !== pedido.status
      ) {
        pedido.status = apiResult.data.status;
        await pedido.save();

        // TODO: Implementar notificação via WhatsApp
      }

      return pedido;
    } catch (error) {
      throw error;
    }
  }

  async #getAllOrdersPending() {
    const keywords = [
      "Aguardando",
      "Análise",
      "Analise",
      "Parcial",
      "Pendente",
    ];

    return await Pedido.findAll({
      where: {
        [Op.or]: keywords.map((word) => ({
          status: { [Op.iLike]: `%${word}%` },
        })),
      },
      attributes: ["id", "numeroPedido", "status"],
    });
  }

  async #delay() {
    return new Promise((resolve) => setTimeout(resolve, this.#sleepTime));
  }
}

export default new EpsServices();
