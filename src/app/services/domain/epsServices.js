import { Op } from "sequelize";
import axios from "axios";
import EspApiServices from "../api/EspApiServices.js";
import LogServices from "./logServices.js";
import CustomException from "../../../config/CustomException.js";
import Pedido from "../../models/Pedido.js";
import Carro from "../../models/Carro.js";

class EpsServices {
  #sleepTime = Number(process.env.CONSULTA_SLEEP_TIME) || 1000;
  #webhookUrl = process.env.WEBHOOK_URL;
  #apiKey = process.env.APP_SECRET;

  async checkAllOrders() {
    const pedidos = await this.#getAllOrdersPending();
    console.info(`Total de ${pedidos.length} pendente atualizar`);
    if (!pedidos || pedidos.length === 0) return pedidos;

    const startTime = performance.now();

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

    console.info(`Tempo de execução: ${performance.now() - startTime} ms`);

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

  async directCheck(numeroPedido) {
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

  async checkPlate(plate) {
    if (!plate || plate <= 0)
      throw new CustomException(400, "Verifique o número da placa informada");

    try {
      // Consulta à API externa
      return await EspApiServices.checkPlate({ plate: plate });
    } catch (error) {
      throw error;
    }
  }

  async testPNHAuth() {
    try {
      return await EspApiServices.testPNHAuth();
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

      // Atualizar status do pedido se tiver mudança de status
      if (
        apiResult.success &&
        apiResult.data?.status &&
        apiResult.data.status !== pedido.status
      ) {
        // Registrar log
        await LogServices.registerLog({
          pedidoId: pedido.id,
          statusAtual: pedido.status,
          statusFinal: apiResult.data?.status || "Sem retorno de status",
          descricao: JSON.stringify(apiResult.data),
        });

        pedido.status = apiResult.data.status;
        await pedido.save();

        //Notifica a api do N8N para disparo do whatsapp
        if (this.#webhookUrl)
          await this.#confirmStatusChange({
            pedido: pedido,
            status: pedido.status,
          });
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

  async #confirmStatusChange({ pedido, status }) {
    if(!pedido || !status) return;
    try {
      const _pedido = await Pedido.findByPk(pedido.id, {
        attributes: ["id"],
        include: [
          {
            model: Carro,
            attributes: ["userId"],
          },
        ],
      });
      const body = {
        idPedido: _pedido.id,
        userId: _pedido.Carro.userId,
        status,
      };
      if (this.#webhookUrl)
        await axios.post(this.#webhookUrl, body, {
          headers: {
            "x-api-key": this.#apiKey,
          },
        });
    } catch (error) {
      console.error(error);
      error.userMessage = "Falha ao notificar via Webhook";
      throw error;
    }
  }

  async #delay() {
    return new Promise((resolve) => setTimeout(resolve, this.#sleepTime));
  }
}

export default new EpsServices();
