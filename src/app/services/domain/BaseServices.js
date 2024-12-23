import ApiServices from "../api/ApiServices.js";
import CustomException from "../../../config/CustomException.js";
import Veiculo from "../../models/Veiculo.js";
import Pedido from "../../models/Pedido.js";
import { exists, getDigits } from "../../utils/stringUtils.js";
import Debito from "../../models/Debito.js";
import moment from "moment";

class BaseServices {
  /**
   * Consulta o status de um pedido pelo número do pedido.
   * @param {number} numeroPedido - Número do pedido a ser consultado.
   * @returns {Object} - Resposta da API com o status do pedido.
   */
  async consultarPedido(numeroPedido) {
    if (!numeroPedido || numeroPedido <= 0)
      throw new CustomException(400, "Verifique o número do pedido informado");

    try {
      return await ApiServices.consultarStatusPedido(numeroPedido);
    } catch (error) {
      throw error; // Repassa o erro para o chamador.
    }
  }

  /**
   * Consulta informações de um veículo pela placa. Primeiro verifica na base local,
   * caso não encontre, realiza uma consulta na API externa.
   * @param {string} placa - Placa do veículo a ser consultado.
   * @throws {CustomException} - Se a placa for inválida ou não for encontrada.
   * @returns {Object} - Dados do veículo.
   */
  async consultarPlaca(placa) {
    if (!placa || typeof placa !== "string" || placa.trim() === "")
      throw new CustomException(400, "Verifique o número da placa informada");

    try {
      placa = placa.toLowerCase();
      const veiculo = await Veiculo.findOne({
        where: { placa },
        attributes: {
          exclude: ["createdAt", "updatedAt"], // Exclui campos desnecessários na consulta.
        },
      });

      // Retorna o veículo encontrado na base de dados local.
      if (veiculo) return veiculo;

      // Consulta o veículo na API externa.
      const { solitacao, resposta } = await ApiServices.consultarPlaca(placa);

      if (exists(solitacao.mensagem, "erro")) {
        throw new CustomException(
          404,
          solitacao.mensagem,
          "Erro na consulta, tente novamente mais tarde",
        );
      }

      // Cria um novo registro de veículo na base de dados.
      let createResponse;
      if (resposta && resposta.uf && resposta.renavam)
        createResponse = await Veiculo.create(resposta);

      //retorna o id no novo registro para aproveitamento
      resposta.id = createResponse.id;
      return resposta;
    } catch (error) {
      throw error; // Repassa o erro para o chamador.
    }
  }

  /**
   * Consulta débitos associados a um veículo pela placa.
   * Verifica débitos na base local e, se necessário, consulta a API externa.
   * @param {Object} params - Parâmetros para a consulta.
   * @param {string} params.placa - Placa do veículo.
   * @param {string} params.email - Email do usuário.
   * @param {string} params.telefone - Telefone do usuário.
   * @throws {CustomException} - Se o veículo não for encontrado ou a API retornar erro.
   * @returns {Object} - Lista de débitos e mensagem de sucesso.
   */
  async consultaDebitos({ placa, email, telefone }) {
    placa = placa.toLowerCase();
    telefone = getDigits(telefone); // Remove caracteres não numéricos do telefone.

    try {
      // busca o veiculo pela placa para validar e
      // buscar renavam + chassi e demais dados para consultar os débito
      const veiculo = await this.consultarPlaca(placa);
      if (!veiculo) throw new CustomException(400, "Veículo não encontrado");

      // Busca o último pedido associado ao veículo na base local.
      const pedido = await Pedido.findOne({
        where: { veiculoId: veiculo.id },
        order: [["createdAt", "DESC"]],
        include: {
          model: Debito,
          as: "debitos",
          attributes: ["id", "codFatura", "vencimento", "valor", "descricao"],
        },
      });

      // Se há um pedido recente com débitos associados, retorna os dados.
      if (
        pedido &&
        !this.#consultaAntiga(pedido.createdAt) &&
        pedido.debitos?.length > 0
      ) {
        return {
          success: true,
          message: pedido.mensagem,
          debitos: pedido.debitos,
        };
      }

      // Consulta débitos na API externa.
      const apiResult = await ApiServices.consultaDebitos({
        placa: veiculo.placa,
        email,
        telefone,
        cpfCnpj: veiculo.cpfCnpj,
        renavam: veiculo.renavam,
        chassi: veiculo.chassi,
        uf: veiculo.uf,
      });

      // caso venha falha, essa api não trata a resposta
      if (!apiResult.success) {
        throw new CustomException(
          400,
          "Erro ao processar resposta da API de débitos",
          `${apiResult.message} | ${apiResult.data?.mensagem}`,
        );
      }

      //O trecho de código abaixo, salva os dados da API na base para reaproveitamento

      // Cria um novo pedido associado ao veículo.
      const newPedido = await Pedido.create({
        veiculoId: veiculo.id,
        mensagem: apiResult.message,
        pedido: apiResult.data.pedido,
      });

      // Insere débitos retornados pela API no banco de dados.
      if (apiResult.data.debitos?.length > 0) {
        await Promise.all(
          apiResult.data.debitos.map((item) => {
            const vencimento = moment(
              item.vencimento,
              "M/D/YYYY h:mm:ss A",
            ).format("YYYY-MM-DD HH:mm:ss"); // Converte para o formato DateTime.

            return Debito.create({
              ...item,
              vencimento,
              pedidoId: newPedido.id,
            });
          }),
        );
      }

      return apiResult;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verifica se uma consulta é antiga com base na data informada.
   * @param {Date} data - Data da consulta.
   * @returns {boolean} - Retorna true se a consulta for de outro dia.
   */
  #consultaAntiga(data) {
    const hoje = new Date().setHours(0, 0, 0, 0);
    const dataComparada = new Date(data).setHours(0, 0, 0, 0);
    return dataComparada !== hoje;
  }

  /**
   * Testa a autenticação na API externa.
   * @returns {Object} - Resultado do teste.
   */
  async testeApiAuth() {
    try {
      return await ApiServices.testeApiAuth();
    } catch (error) {
      throw error;
    }
  }
}

export default new BaseServices();
