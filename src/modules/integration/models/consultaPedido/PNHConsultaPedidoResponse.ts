export interface PNHConsultaPedidoResponse {
  success: boolean;
  message: string;
  data: Data;
}

interface Data {
  pedido: number;
  status: string;
}
