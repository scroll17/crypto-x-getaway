import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthCookies } from '@common/enums';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public canActivate(context: ExecutionContext) {
    try {
      return super.canActivate(context);
    } catch (error) {
      const res = context.switchToHttp().getResponse();

      res.cookie(AuthCookies.LoggedIn, null, { maxAge: 0 });
      res.cookie(AuthCookies.AccessToken, null, { maxAge: 0 });
      res.cookie(AuthCookies.RefreshToken, null, { maxAge: 0 });

      throw error;
    }
  }
}
