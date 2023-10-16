import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards';
import { UserPasswordChangedGuard } from '@common/guards';
import { AuthCookies } from '@common/enums';

export function AuthUser() {
  return applyDecorators(UseGuards(JwtAuthGuard, UserPasswordChangedGuard), ApiCookieAuth(AuthCookies.AccessToken));
}
