import ApiServices from "../api/ApiServices.js";
import CustomException from "../../../config/CustomException.js";

class BaseServices {
  async consultarPedido(numeroPedido) {
    if (!numeroPedido || numeroPedido <= 0)
      throw new CustomException(400, "Verifique o número do pedido informado");

    try {
      // Consulta à API externa
      return await ApiServices.consultarStatusPedido({
        numeroPedido: numeroPedido,
      });
    } catch (error) {
      throw error;
    }
  }

  async consultarPlaca(plate) {
    if (!plate || plate <= 0)
      throw new CustomException(400, "Verifique o número da placa informada");

    try {
      // Consulta à API externa
      return await ApiServices.consultarPlaca({ plate: plate });
    } catch (error) {
      throw error;
    }
  }

  async testeApiAuth() {
    try {
      return await ApiServices.testeApiAuth();
    } catch (error) {
      throw error;
    }
  }
}

export default new BaseServices();
