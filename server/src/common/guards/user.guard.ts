/*external modules*/
import { Injectable, CanActivate, ExecutionContext, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ICurrentUserData } from '@common/types/auth';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const data: ICurrentUserData = request.user;

    if (!data) throw new NotFoundException('User not found');
    if (data.isAdmin) {
      throw new ForbiddenException('Access only for User.');
    }

    return true;
  }
}
