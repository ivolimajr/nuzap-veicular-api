export interface PNHCotacaoDebitoResponse{
  success: boolean;
  message: string;
  data: {
    erros: any[];
    isValid: boolean;
    messagem: string;
    codigoMessagem: number;
    retorno: RetornoSimulacao;
    problemaDeInfraestrutura: boolean;
    warning: boolean;
    cd_cupom: number;
  };

}

interface RetornoSimulacao {
  principal: number;
  simumacaoParcelas: RespostaSimulacao[];
  valorTarifa: number;
}

interface RespostaSimulacao {
  parcela: number;
  valor: number;
  tipoOperacao: string;
  valorTotal: number;
  cet: number;
  valorSemCupom: number;
  valorTotalSemCupom: number;
  cupom: boolean;
}
