export interface PNHProcessaPagamentoResponse {
  success: boolean;
  message: string;
  data: Data;
}

interface Data {
  mensagem: string;
  pedido: number;
  transacao: number;
}
