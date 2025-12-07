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

    let messages: any = [{ field: null, message: ['Internal server error'] }];

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') {
        messages = [{ field: null, message: [res] }];
      } else if (typeof res === 'object' && (res as any).message) {
        if (Array.isArray((res as any).message)) {
          messages = (res as any).message;
        } else {
          messages = [{ field: null, message: [(res as any).message] }];
        }
      }
    } else if (exception instanceof Error) {
      messages = [{ field: null, message: [exception.message] }];
    }

    response.status(status).json({
      statusCode: status,
      error: HttpStatus[status],
      messages,
      timestamp: new Date().toISOString(),
      path: request.url,
      ok: false,
    });
  }
}
