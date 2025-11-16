import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthMessage } from '../../../common/enums/message.enum';
import { isJWT } from 'class-validator';
import { AuthService } from '../auth.service';
import { Reflector } from '@nestjs/core';
import { SKIP_AUTH } from '../../../common/decorators/skip-auth.decorator';
import { IUserRequestType } from '../../user/types/request.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    const isSkippedAuthorization = this.reflector.getAllAndOverride<boolean>(
      SKIP_AUTH,
      [context.getHandler(), context.getClass()],
    );
    if (isSkippedAuthorization) return true;

    const httpContext = context.switchToHttp();

    const request: Request = httpContext.getRequest<Request>();

    const token = this.extractToken(request);

    const user = await this.authService.validateAccessToken(token);

    request.user = {
      _id: user._id,
      role: user.role,
      mobile: user.mobile,
      mobileVerified: user.mobileVerified,
    } as IUserRequestType;

    return true;
  }

  protected extractToken(request: Request) {
    const { authorization } = request.headers;

    if (!authorization || authorization.trim() === '') {
      throw new UnauthorizedException(AuthMessage.RequiredLogin);
    }

    const [bearer, token] = authorization.split(' ');
    if (bearer?.toLocaleLowerCase() !== 'bearer' || !token || !isJWT(token)) {
      throw new UnauthorizedException(AuthMessage.RequiredLogin);
    }

    return token;
  }
}
