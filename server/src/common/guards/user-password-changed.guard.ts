/*external modules*/
import { Injectable, CanActivate, ExecutionContext, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ICurrentUserData } from '@common/types/auth';
import { UserEntity } from '@entities/user';

@Injectable()
export class UserPasswordChangedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const data: ICurrentUserData = request.user;

    if (!data) throw new NotFoundException('User not found');
    if (data.isAdmin) return true;

    const user = data.info as UserEntity;
    if (user.changePassword) throw new ForbiddenException('User must change password.');

    return true;
  }
}
