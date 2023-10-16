/*external modules*/
import { Request } from 'express';
import { createParamDecorator } from '@nestjs/common';
/*@interfaces*/
/*@entities*/
import { AuthCookies } from '@common/enums';

export const AccessToken = createParamDecorator((data, ctx) => {
  const req: Request = ctx.switchToHttp().getRequest();
  return req.cookies[AuthCookies.AccessToken];
});
