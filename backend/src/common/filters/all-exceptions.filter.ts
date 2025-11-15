import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: any = [{ field: null, messages: ['Internal server error'] }];

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = [{ field: null, messages: [res] }];
      } else if (typeof res === 'object' && (res as any).message) {
        if (Array.isArray((res as any).message)) {
          message = (res as any).message;
        } else {
          message = [{ field: null, messages: [(res as any).message] }];
        }
      }
    } else if (exception instanceof Error) {
      message = [{ field: null, messages: [exception.message] }];
    }

    response.status(status).json({
      statusCode: status,
      error: HttpStatus[status],
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
