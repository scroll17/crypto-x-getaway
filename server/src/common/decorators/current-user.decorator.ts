/*external modules*/
import { createParamDecorator } from '@nestjs/common';
/*@interfaces*/
import { ICurrentUserData } from '@common/types/auth';
/*@entities*/
import { UserModel } from '@entities/user';

export const CurrentUser = createParamDecorator<keyof UserModel>((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  const user: ICurrentUserData = request.user;

  return data ? (user?.info as any)[data] : user;
});
