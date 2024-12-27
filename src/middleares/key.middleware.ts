import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import * as process from "node:process";

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const apiKey = req.headers['x-api-key'];
    if (apiKey === process.env.APP_SECRET) {
      next();
    } else {
      throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
    }
  }
}
