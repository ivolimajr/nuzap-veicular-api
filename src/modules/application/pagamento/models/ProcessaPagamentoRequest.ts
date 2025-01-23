import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Min,
} from '@nestjs/class-validator';
import { IsNumber, Max } from 'class-validator';

export class ProcessaPagamentoRequest {
  @IsArray({ message: 'A propriedade deve ser do tipo array de strings.' })
  @IsString({ each: true, message: 'Cada item na lista deve ser uma string.' })
  @IsNotEmpty({ message: 'A lista de débitos não pode estar vazia.' })
  @ApiProperty({
    description: 'Array com a lista dos débitos.',
    example: ['16639065', '16639066'],
    type: [String],
  })
  cdFaturas: string[];

  @Min(1, { message: 'A quantidade mínima de parcelas é 1.' })
  @Max(24, { message: 'A quantidade máxima de parcelas é 24.' })
  @IsNumber(
    { allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'O número de parcelas deve ser um inteiro.' },
  )
  @ApiProperty({
    description: 'Quantidade de parcelas a ser faturada no cartão.',
    example: 12,
    type: Number,
  })
  parcelas: number;

  @Min(1, { message: 'O valor deve ser maior que 0.' })
  @IsNumber(
    { allowNaN: false, maxDecimalPlaces: 2 },
    { message: 'O valor deve ser um número com no máximo duas casas decimais.' },
  )
  @ApiProperty({
    description: 'Valor total cobrado no cartão. Deve ser equivalente ao valor simulado anteriormente.',
    example: 1234.56,
    type: Number,
  })
  valorPagCartao: number;

  @IsNotEmpty({ message: 'O e-mail não pode estar vazio.' })
  @IsString({ message: 'E-mail deve ser uma string.' })
  @Length(5, 70, { message: 'E-mail deve ter entre 5 e 70 caracteres.' })
  @IsEmail({}, { message: 'O email deve ser um endereço de email válido.' })
  @ApiProperty({
    description: 'Email do cliente',
    example: 'joao.silva@example.com',
    type: String,
  })
  email: string;

  @Min(100, { message: 'O CVV deve ter no mínimo 3 dígitos.' })
  @Max(9999, { message: 'O CVV deve ter no máximo 4 dígitos.' })
  @IsNumber(
    { allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'O CVV deve ser um número inteiro.' },
  )
  @ApiProperty({
    description: 'CVV do cartão de crédito (3 dígitos para cartões padrão ou 4 dígitos para AMEX).',
    example: 123,
    type: Number,
  })
  securityCode: number;

  @IsNotEmpty({ message: 'O número do cartão não pode ser vazio.' })
  @IsString({ message: 'O número do cartão deve ser uma string.' })
  @Length(13, 20, { message: 'O número do cartão deve ter entre 13 e 20 caracteres.' })
  @ApiProperty({
    description: 'Número do cartão de crédito.',
    example: '4235647728025682',
    type: String,
  })
  creditCardNumber: string;

  @IsNotEmpty({ message: 'O vencimento do cartão não pode ser vazio.' })
  @IsString({ message: 'O vencimento do cartão deve ser uma string.' })
  @Length(5, 5, { message: 'O vencimento do cartão deve estar no formato MM/YY.' })
  @ApiProperty({
    description: 'Mês e ano de vencimento do cartão no formato MM/YY.',
    example: '01/32',
    type: String,
  })
  monthYear: string;

  @IsNotEmpty({ message: 'O nome do dono do cartão não pode ser vazio.' })
  @IsString({ message: 'O nome do dono do cartão deve ser uma string.' })
  @Length(2, 150, { message: 'O nome do dono do cartão deve ter entre 2 e 150 caracteres.' })
  @ApiProperty({
    description: 'Nome do dono do cartão.',
    example: 'Joao Costa da Silva',
    type: String,
  })
  holderName: string;

  @IsNotEmpty({ message: 'O CPF ou CNPJ do dono do cartão não pode ser vazio.' })
  @IsString({ message: 'O CPF ou CNPJ deve ser uma string.' })
  @Matches(/^\d{11}$|^\d{14}$/, {
    message: 'O CPF deve ter 11 dígitos ou o CNPJ deve ter 14 dígitos.',
  })
  @ApiProperty({
    description: 'CPF ou CNPJ do dono do cartão.',
    example: '83742308009',
    type: String,
  })
  cpfcnpj: string;

  @IsNotEmpty({ message: 'O telefone do dono do cartão não pode ser vazio.' })
  @Matches(/^\d{10,11}$/, {
    message: 'O telefone deve conter apenas números e ter 10 ou 11 dígitos.',
  })
  @ApiProperty({
    description: 'Telefone do dono do cartão para análise e aprovação.',
    example: '61986618602',
    type: String,
  })
  telefone: string;
}
