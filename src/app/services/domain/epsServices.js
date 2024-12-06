import EspApiServices from "../api/EspApiServices.js";
import { EPSMockRequestCodigosPedido } from "../../mock/epsMock.js";
import CustomException from "../../../config/CustomException.js";

class EpsServices {
  async checkOrders() {
      const result = [];
      for (const e of EPSMockRequestCodigosPedido)
        result.push(await this.checkOrder({ epsOrderCode: e }));
      return result;
  }

  async checkOrder({ epsOrderCode }) {
    if (!epsOrderCode || epsOrderCode <= 0)
      throw new CustomException(404,"Verifique o número do pedido informa");

      return await EspApiServices.checkOrder({ epsOrderCode });
  }
}

export default new EpsServices();
