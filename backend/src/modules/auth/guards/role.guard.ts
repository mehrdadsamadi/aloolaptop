import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../../../common/enums/role.enum';
import { Request } from 'express';
import { ROLES_KEY } from '../../../common/decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length == 0) return true;

    const request: Request = context.switchToHttp().getRequest<Request>();

    const user = request.user;
    const userRole = user?.role ?? Roles.BUYER;

    if (userRole === Roles.ADMIN) return true;
    if (requiredRoles.includes(userRole)) return true;

    throw new ForbiddenException();
  }
}
