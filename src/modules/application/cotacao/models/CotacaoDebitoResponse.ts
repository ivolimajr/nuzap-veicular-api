import { ApiProperty } from '@nestjs/swagger';

export class CotacaoDebitoResponse {
  @ApiProperty({
    description: 'Status de retorno',
    example: true,
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensagem de retorno',
    example: 'Retorno Com Sucesso',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Dados de retorno da consulta',
    example: {
      erros: [],
      isValid: true,
      messagem: null,
      codigoMessagem: 0,
      retorno: {
        principal: 78.1,
        simumacaoParcelas: [
          {
            parcela: 1,
            valor: 81.15,
            tipoOperacao: 'Crédito',
            valorTotal: 81.15,
            cet: 3.91,
            valorSemCupom: 81.15,
            valorTotalSemCupom: 81.15,
            cupom: false,
          },
        ],
        valorTarifa: 10.15,
      },
      problemaDeInfraestrutura: false,
      warning: false,
      cd_cupom: 0,
    },
  })
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
