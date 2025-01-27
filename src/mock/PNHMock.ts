export const PNHMockConsultaPlacaResponse = {
  solitacao: {
    dado: 'qov3066',
    numeroresposta: '',
    mensagem: '1',
    horario: '10/20/2023 4:53:15 PM',
  },
  resposta: {
    placa: 'qov3066',
    chassi: '9BD358A4NKYJ07435',
    renavam: '01160753420',
    marcaModelo: 'FIAT/ARGO DRIVE 1.0',
    ano_fabricacao: '',
    anoModelo: '2019',
    cor: 'Branca',
    combustivel: '',
    uf: 'DF',
    cpfCnpj: '67003354187',
  },
};

export const PNHMockConsultaDebitoResponse = {
  success: true,
  message: 'Retorno Com Sucesso',
  data: {
    pedido: 5648743,
    mensagem: '',
    debitos: [
      {
        codFatura: 16662596,
        codDebito: 16662596,
        codNsu: '16662596',
        vencimento: '12/23/2024 3:00:00 AM',
        statusDebito: 'Em aberto',
        valor: '388.67',
        codBarras: null,
        exigivel: 0,
        descricao: 'IPVA 2024 - 3° cota',
        identificador: '1',
        codAutoInfracao: null,
        autoInfracao: null,
      },
      {
        codFatura: 16662597,
        codDebito: 16662597,
        codNsu: '16662597',
        vencimento: '12/23/2024 3:00:00 AM',
        statusDebito: 'Em aberto',
        valor: '391.2',
        codBarras: null,
        exigivel: 0,
        descricao: 'IPVA 2024 - 1° cota',
        identificador: '1',
        codAutoInfracao: null,
        autoInfracao: null,
      },
      {
        codFatura: 16662598,
        codDebito: 16662598,
        codNsu: '16662598',
        vencimento: '12/23/2024 3:00:00 AM',
        statusDebito: 'Em aberto',
        valor: '391.2',
        codBarras: null,
        exigivel: 0,
        descricao: 'IPVA 2024 - 2° cota',
        identificador: '1',
        codAutoInfracao: null,
        autoInfracao: null,
      },
      {
        codFatura: 16662599,
        codDebito: 16662599,
        codNsu: '16662599',
        vencimento: '12/22/2024 3:00:00 AM',
        statusDebito: 'Em aberto',
        valor: '1171.07',
        codBarras: null,
        exigivel: 0,
        descricao: 'IPVA 2024 - Cota única',
        identificador: '1',
        codAutoInfracao: null,
        autoInfracao: null,
      },
    ],
  },
};

export const PNHMockConsultarPedidoResponse = {
  success: true,
  message: 'Retorno Com Sucesso',
  data: {
    pedido: 1495757,
    status: 'Negado Adquirente',
  },
};

export const PNHMockConsultaPlacaError = {
  solitacao: {
    dado: 'n2x9399',
    numeroresposta: null,
    tempo: null,
    mensagem:
      'Erro: Erro de Requisição: Erro na consulta, tente novamente mais tarde.',
    horario: '12/22/2024 7:56:10 PM',
  },
  resposta: {
    placa: 'n2x9399',
    chassi: '',
    renavam: '',
    marcaModelo: '',
    ano_fabricacao: '',
    anoModelo: '',
    cor: '',
    combustivel: '',
    uf: null,
    infocarbaseestadual: null,
    debitodireto: null,
    cpfCnpj: '',
  },
};

export const PNHMockPagamentoResponse = {
  success: true,
  message: 'Retorno Com Sucesso',
  data: {
    mensagem: 'Aguarde o processamento do pagamento',
    pedido: 5654110,
    transacao: 1373237,
    transacaoWynk: 1373236
  }
};
