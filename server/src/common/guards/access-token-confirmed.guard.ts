/*external modules*/
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ICurrentUserData } from '@common/types/auth';

@Injectable()
export class AccessTokenConfirmedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const data: ICurrentUserData = request.user;

    if (!data) throw new NotFoundException('User not found');
    if (!data.token!.confirmed) throw new HttpException('Access token not confirmed.', HttpStatus.FORBIDDEN);

    return true;
  }
}
