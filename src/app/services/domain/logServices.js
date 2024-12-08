import Log from "../../models/Log.js";

class LogServices {
  async registerLog({ pedidoId, statusAtual, descricao, statusFinal}) {
    return await Log.create({
      pedidoId,
      statusAtual,
      statusFinal,
      descricao,
    })
  }
}

export default new LogServices();
