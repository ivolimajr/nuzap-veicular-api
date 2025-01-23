export interface PNHConsultaPlacaResponse {
  solicitacao: Solicitacao;
  resposta: Resposta;
}

interface Solicitacao {
  dado: string;
  numeroresposta: string;
  tempo: any;
  mensagem: string;
  horario: string;
}

interface Resposta {
  placa: string;
  chassi: string;
  renavam: string;
  marcaModelo: string;
  ano_fabricacao: string;
  anoModelo: string;
  cor: string;
  combustivel: string;
  uf: string;
  cpfCnpj: string;
}
