import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const message = exception.getResponse() as
      | string
      | { message: string; error: string };

    let statusText = 'Internal Server Error';
    if (typeof message === 'string') {
      statusText = message;
    } else if (message && message.message) {
      statusText = message.message;
    }

    return res.status(status).json({
      statusCode: status,
      statusText,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}
