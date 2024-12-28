import { PNHDebitoResponse } from './PNHDebitoResponse';

export interface PNHConsultaDebitoResponse {
  success: boolean;
  message: string;
  data: {
    pedido: number;
    mensagem: string;
    debitos: PNHDebitoResponse[];
  };
}
