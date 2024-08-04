import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class UserRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user }: { user: User } = context.switchToHttp().getRequest();
    const userRoles = user.roles.map((role) => role.toUpperCase());
    return requiredRoles.some((role) => userRoles.includes(role.toUpperCase()));
  }
}
