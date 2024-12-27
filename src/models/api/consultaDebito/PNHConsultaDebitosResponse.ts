import { PNHDebitosResponse } from "./PNHDebitosResponse";

export interface PNHConsultaDebitosResponse {
  success: boolean;
  message: string;
  data: {
    pedido: number;
    mensagem: string;
    debitos: PNHDebitosResponse[];
  };
}