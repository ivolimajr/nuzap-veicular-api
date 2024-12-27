export interface PNHAutenticacaoResponse {
  "usuario": PNHUsuarioAutenticacaoResponse,
  "token": string,
}

interface PNHUsuarioAutenticacaoResponse{
  "guid": string,
  "nome": string,
  "email": string,
  "senha": string,
  "funcao": string,
  "idUser": number
}
