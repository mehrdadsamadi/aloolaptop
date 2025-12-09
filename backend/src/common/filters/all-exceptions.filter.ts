import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // --------------------------
    // Extract Messages
    // --------------------------
    let messages: string[] = ['خطایی رخ داده است، دوباره تلاش کنید'];

    if (exception instanceof HttpException) {
      const res = exception.getResponse();

      if (typeof res === 'string') {
        messages = [res];
      } else if (typeof res === 'object' && (res as any).message) {
        const msg = (res as any).message;
        messages = Array.isArray(msg) ? msg : [msg];
      }
    } else if (exception instanceof Error) {
      messages = [exception.message];
    }

    // --------------------------
    // Logging (very important)
    // --------------------------
    this.logger.error(
      {
        status,
        path: request.url,
        method: request.method,
        messages,
        stack: exception instanceof Error ? exception.stack : undefined,
      },
      '',
      'ExceptionFilter',
    );

    // --------------------------
    // Response format
    // --------------------------
    response.status(status).json({
      statusCode: status,
      error: HttpStatus[status],
      messages,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      ok: false,

      // Only in DEV
      ...(process.env.NODE_ENV !== 'production' &&
        exception instanceof Error && {
          debug: {
            name: exception.name,
            stack: exception.stack,
          },
        }),
    });
  }
}
