import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { IUserRequestType } from '../types/request.type';

export const UserReq = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as IUserRequestType;
  },
);
