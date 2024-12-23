export function getDigits(input) {
  if (!input || typeof input !== "string") return input;
  return input.replace(/\D/g, ""); // Remove todos os caracteres que não são números
}

export function exists(value, find) {
  const regex = new RegExp(find, "i"); // Ignora camel case
  return regex.test(value);
}
