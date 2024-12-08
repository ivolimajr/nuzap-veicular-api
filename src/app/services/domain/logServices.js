import Log from "../../models/Log.js";
import { Op } from "sequelize";


class LogServices {
  async registerLog({ pedidoId, statusAtual, descricao, statusFinal }) {
    return await Log.create({
      pedidoId,
      statusAtual,
      statusFinal,
      descricao,
    });
  }

  async getLog(req, res) {
    try {
      // Paginação e limites
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // Filtros de data
      const today = new Date().toISOString().split("T")[0]; // Data atual em formato YYYY-MM-DD
      const start = req.query.start ? new Date(req.query.start) : new Date(today);
      const end = req.query.end ? new Date(req.query.end) : new Date();

      // Adicionar o final do dia ao filtro de `end`
      end.setHours(23, 59, 59, 999);

      // Contar total de registros para paginação
      const totalRecords = await Log.count({
        where: {
          created_at: {
            [Op.between]: [start, end],
          },
        },
      });

      // Buscar os registros paginados
      const logs = await Log.findAll({
        where: {
          created_at: {
            [Op.between]: [start, end],
          },
        },
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });

      // Retornar resposta com total e dados paginados
      return res.status(200).json({
        total: totalRecords,
        page,
        limit,
        data: logs,
      });
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
      return res.status(500).json({ error: "Erro ao processar a requisição" });
    }
  }
}

export default new LogServices();
