/**
 * Recebe um texto ou frase completa e remove todos os caracteres que não são números
 * @param input texto
 * @type string
 * @return String
 * @example (11) 91234-5678 -> 11912345678
 * @example '000000123' -> '123
 */
export function getDigits(input: string): string {
  if (!input || typeof input !== "string") return input;
  return input.replace(/\D/g, ""); // Remove todos os caracteres que não são números
}

/**
 * Limpa todos os caracteres especiais de um cpf ou cnpj
 * @type string
 * @return String
 * @example "037.464.571-06" > "03746457106"
 * @example '0000@00!12>3' -> '000000123
 * @param documento
 */
export function limparDocumento(documento: string): string {
  return documento.replace(/\D/g, '');
}



/**
 * Verifica se um valor está contido dentro de uma string completa.
 * @param value texto completo
 * @type string
 * @param find valor a ser procurado no texto
 * @type string
 * @return Boolean
 * @example "Pagamento não processado" | "Processado" = true
 */
export function exists(value: string, find: string): boolean {
  const regex = new RegExp(find, "i"); // Ignora camel case
  return regex.test(value);
}
