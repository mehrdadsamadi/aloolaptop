import { SetMetadata } from '@nestjs/common';
import { Roles } from '../enums/role.enum';

export const ROLES_KEY = 'ROLES';

export const CanAccess = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles);
