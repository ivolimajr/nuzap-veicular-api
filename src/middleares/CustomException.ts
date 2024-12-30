import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  public readonly message: string;
  public readonly userMessage: string;
  public readonly data: any;

  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    userMessage?: string,
    data?: any,
  ) {
    super({ message: message, userMessage, data }, status);
    this.message = message;
    this.userMessage = userMessage || "";
    this.data = data || null;
  }
}
